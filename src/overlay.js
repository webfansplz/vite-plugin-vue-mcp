import { devtools, devtoolsRouterInfo, devtoolsState, getInspector, stringify, toggleHighPerfMode } from '@vue/devtools-kit'

import { createRPCClient } from 'vite-dev-rpc'
import { createHotContext } from 'vite-hot-client'


const base = import.meta.env.BASE_URL || '/'
const hot = createHotContext('',base)
const PINIA_INSPECTOR_ID = 'pinia'
const COMPONENTS_INSPECTOR_ID = 'components'

devtools.init()

let highlightComponentTimeout = null

function flattenChildren(node) {
  const result = []

  function traverse(node) {
    if (!node)
      return
    result.push(node)

    if (Array.isArray(node.children)) {
      node.children.forEach(child => traverse(child))
    }
  }

  traverse(node)
  return result
}

const rpc = createRPCClient(
  'vite-plugin-vue-mcp',
  hot,
  {
    // get component tree
    async getInspectorTree(query) {
      const inspectorTree = await devtools.api.getInspectorTree({
        inspectorId: COMPONENTS_INSPECTOR_ID,
        filter: '',
      })
      rpc.onInspectorTreeUpdated(query.event, inspectorTree[0])
    },
    // get component state
    async getInspectorState(query) {
      const inspectorTree = await devtools.api.getInspectorTree({
        inspectorId: COMPONENTS_INSPECTOR_ID,
        filter: '',
      })
      const flattenedChildren = flattenChildren(inspectorTree[0])
      const targetNode = flattenedChildren.find(child => child.name === query.componentName)
      const inspectorState = await devtools.api.getInspectorState({
        inspectorId: COMPONENTS_INSPECTOR_ID,
        nodeId: targetNode.id,
      })
      rpc.onInspectorStateUpdated(query.event, stringify(inspectorState))
    },

    // edit component state
    async editComponentState(query) {
      const inspectorTree = await devtools.api.getInspectorTree({
        inspectorId: COMPONENTS_INSPECTOR_ID,
        filter: '',
      })
      const flattenedChildren = flattenChildren(inspectorTree[0])
      const targetNode = flattenedChildren.find(child => child.name === query.componentName)
      const payload = {
        inspectorId: COMPONENTS_INSPECTOR_ID,
        nodeId: targetNode.id,
        path: query.path,
        state: {
          new: null,
          remove: false,
          type: query.valueType,
          value: query.value,
        },
        type: undefined,
      }
      await devtools.ctx.api.editInspectorState(payload)
    },

    // highlight component
    async highlightComponent(query) {
      clearTimeout(highlightComponentTimeout)
      const inspectorTree = await devtools.api.getInspectorTree({
        inspectorId: COMPONENTS_INSPECTOR_ID,
        filter: '',
      })
      const flattenedChildren = flattenChildren(inspectorTree[0])
      const targetNode = flattenedChildren.find(child => child.name === query.componentName)
      devtools.ctx.hooks.callHook('componentHighlight', { uid: targetNode.id })
      highlightComponentTimeout = setTimeout(() => {
        devtools.ctx.hooks.callHook('componentUnhighlight')
      }, 5000)
    },
    // get router info
    async getRouterInfo(query) {
      rpc.onRouterInfoUpdated(query.event, JSON.stringify(devtoolsRouterInfo, null, 2))
    },
    // get pinia tree
    async getPiniaTree(query) {
      const highPerfModeEnabled = devtoolsState.highPerfModeEnabled
      if (highPerfModeEnabled) {
        toggleHighPerfMode(false)
      }
      const inspectorTree = await devtools.api.getInspectorTree({
        inspectorId: PINIA_INSPECTOR_ID,
        filter: '',
      })
      if (highPerfModeEnabled) {
        toggleHighPerfMode(true)
      }
      rpc.onPiniaTreeUpdated(query.event, inspectorTree)
    },
    // get pinia state
    async getPiniaState(query) {
      const highPerfModeEnabled = devtoolsState.highPerfModeEnabled
      if (highPerfModeEnabled) {
        toggleHighPerfMode(false)
      }
      const payload = {
        inspectorId: PINIA_INSPECTOR_ID,
        nodeId: query.storeName,
      }
      const inspector = getInspector(payload.inspectorId)

      if (inspector)
        inspector.selectedNodeId = payload.nodeId

      const res = await devtools.ctx.api.getInspectorState(payload)
      if (highPerfModeEnabled) {
        toggleHighPerfMode(true)
      }
      rpc.onPiniaInfoUpdated(query.event, stringify(res))
    },
  },
  {
    timeout: -1,
  },
)
