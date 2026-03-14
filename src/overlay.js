import { devtools, devtoolsRouterInfo, devtoolsState, getInspector, stringify, toggleHighPerfMode } from '@vue/devtools-kit'

import { createRPCClient } from 'vite-dev-rpc'
import { createHotContext } from 'vite-hot-client'

// eslint-disable-next-line no-console
const log = (...args) => console.log(...args)

const base = import.meta.env.BASE_URL || '/'
const hot = createHotContext('', base)
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

function findComponent(flattenedChildren, componentName, toolName) {
  const targetNode = flattenedChildren.find(child => child.name === componentName)
  if (!targetNode) {
    console.warn(`[vue-mcp:browser] ${toolName}: component "${componentName}" not found in tree`)
    return null
  }
  return targetNode
}

function restoreHighPerfMode(wasEnabled) {
  if (wasEnabled) {
    try {
      toggleHighPerfMode(true)
    }
    catch (e) {
      console.error('[vue-mcp:browser] Failed to restore high perf mode:', e)
    }
  }
}

const rpc = createRPCClient(
  'vite-plugin-vue-mcp',
  hot,
  {
    // get component tree
    async getInspectorTree(query) {
      log('[vue-mcp:browser] getInspectorTree called')
      try {
        const inspectorTree = await devtools.api.getInspectorTree({
          inspectorId: COMPONENTS_INSPECTOR_ID,
          filter: '',
        })
        log('[vue-mcp:browser] getInspectorTree resolved')
        rpc.onInspectorTreeUpdated(query.event, inspectorTree[0])
      }
      catch (e) {
        console.error('[vue-mcp:browser] getInspectorTree failed:', e)
        rpc.onInspectorTreeUpdated(query.event, null)
      }
    },
    // get component state
    async getInspectorState(query) {
      log(`[vue-mcp:browser] getInspectorState called for "${query.componentName}"`)
      try {
        const inspectorTree = await devtools.api.getInspectorTree({
          inspectorId: COMPONENTS_INSPECTOR_ID,
          filter: '',
        })
        const flattenedChildren = flattenChildren(inspectorTree[0])
        const targetNode = findComponent(flattenedChildren, query.componentName, 'getInspectorState')
        if (!targetNode) {
          rpc.onInspectorStateUpdated(query.event, stringify({ error: `Component "${query.componentName}" not found` }))
          return
        }
        const inspectorState = await devtools.api.getInspectorState({
          inspectorId: COMPONENTS_INSPECTOR_ID,
          nodeId: targetNode.id,
        })
        log('[vue-mcp:browser] getInspectorState resolved')
        rpc.onInspectorStateUpdated(query.event, stringify(inspectorState))
      }
      catch (e) {
        console.error('[vue-mcp:browser] getInspectorState failed:', e)
        rpc.onInspectorStateUpdated(query.event, stringify({ error: String(e) }))
      }
    },

    // edit component state
    async editComponentState(query) {
      log(`[vue-mcp:browser] editComponentState called for "${query.componentName}"`)
      try {
        const inspectorTree = await devtools.api.getInspectorTree({
          inspectorId: COMPONENTS_INSPECTOR_ID,
          filter: '',
        })
        const flattenedChildren = flattenChildren(inspectorTree[0])
        const targetNode = findComponent(flattenedChildren, query.componentName, 'editComponentState')
        if (!targetNode) {
          return
        }
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
        log('[vue-mcp:browser] editComponentState completed')
      }
      catch (e) {
        console.error('[vue-mcp:browser] editComponentState failed:', e)
      }
    },

    // highlight component
    async highlightComponent(query) {
      log(`[vue-mcp:browser] highlightComponent called for "${query.componentName}"`)
      try {
        clearTimeout(highlightComponentTimeout)
        const inspectorTree = await devtools.api.getInspectorTree({
          inspectorId: COMPONENTS_INSPECTOR_ID,
          filter: '',
        })
        const flattenedChildren = flattenChildren(inspectorTree[0])
        const targetNode = findComponent(flattenedChildren, query.componentName, 'highlightComponent')
        if (!targetNode) {
          return
        }
        devtools.ctx.hooks.callHook('componentHighlight', { uid: targetNode.id })
        highlightComponentTimeout = setTimeout(() => {
          devtools.ctx.hooks.callHook('componentUnhighlight')
        }, 5000)
        log('[vue-mcp:browser] highlightComponent completed')
      }
      catch (e) {
        console.error('[vue-mcp:browser] highlightComponent failed:', e)
      }
    },
    // get router info
    async getRouterInfo(query) {
      log('[vue-mcp:browser] getRouterInfo called')
      try {
        rpc.onRouterInfoUpdated(query.event, JSON.stringify(devtoolsRouterInfo, null, 2))
      }
      catch (e) {
        console.error('[vue-mcp:browser] getRouterInfo failed:', e)
        rpc.onRouterInfoUpdated(query.event, JSON.stringify({ error: String(e) }))
      }
    },
    // get pinia tree
    async getPiniaTree(query) {
      log('[vue-mcp:browser] getPiniaTree called')
      const highPerfModeEnabled = devtoolsState.highPerfModeEnabled
      try {
        if (highPerfModeEnabled) {
          toggleHighPerfMode(false)
        }
        const inspectorTree = await devtools.api.getInspectorTree({
          inspectorId: PINIA_INSPECTOR_ID,
          filter: '',
        })
        restoreHighPerfMode(highPerfModeEnabled)
        log('[vue-mcp:browser] getPiniaTree resolved')
        rpc.onPiniaTreeUpdated(query.event, inspectorTree)
      }
      catch (e) {
        restoreHighPerfMode(highPerfModeEnabled)
        console.error('[vue-mcp:browser] getPiniaTree failed:', e)
        rpc.onPiniaTreeUpdated(query.event, null)
      }
    },
    // get pinia state
    async getPiniaState(query) {
      log(`[vue-mcp:browser] getPiniaState called for store "${query.storeName}"`)
      const highPerfModeEnabled = devtoolsState.highPerfModeEnabled
      try {
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
        restoreHighPerfMode(highPerfModeEnabled)
        log('[vue-mcp:browser] getPiniaState resolved')
        rpc.onPiniaInfoUpdated(query.event, stringify(res))
      }
      catch (e) {
        restoreHighPerfMode(highPerfModeEnabled)
        console.error('[vue-mcp:browser] getPiniaState failed:', e)
        rpc.onPiniaInfoUpdated(query.event, stringify({ error: String(e) }))
      }
    },
  },
  {
    timeout: -1,
  },
)
