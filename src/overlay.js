import { devtools, devtoolsRouterInfo, devtoolsState, getInspector, stringify, toggleHighPerfMode } from '@vue/devtools-kit'

import { createRPCClient } from 'vite-dev-rpc'
import { createHotContext } from 'vite-hot-client'


const base = import.meta.env.BASE_URL || '/'
const hot = createHotContext('',base)
const PINIA_INSPECTOR_ID = 'pinia'
const COMPONENTS_INSPECTOR_ID = 'components'
const BOOLEAN_VALUES_TRUE = 'true'
let highlightComponentTimeout = null

// Type conversion utilities
const typeConverters = {
  number: value => Number(value),
  boolean: value => value === BOOLEAN_VALUES_TRUE,
  object: (value) => {
    try {
      return JSON.parse(value)
    }
    catch (e) {
      console.warn('[MCP] Failed to parse object:', e)
      return value
    }
  },
  array: (value) => {
    try {
      return JSON.parse(value)
    }
    catch (e) {
      console.warn('[MCP] Failed to parse array:', e)
      return value
    }
  },
  string: value => String(value),
}

// Utility functions
function convertValue(value, type) {
  const converter = typeConverters[type]
  if (!converter) {
    console.warn(`[MCP] Unknown type: ${type}, returning original value`)
    return value
  }
  return converter(value)
}

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

// Helper function to get component tree
async function getComponentTree() {
  return await devtools.api.getInspectorTree({
    inspectorId: COMPONENTS_INSPECTOR_ID,
    filter: '',
  })
}

// Helper function to handle Pinia performance mode
async function withPiniaPerf(callback) {
  const highPerfModeEnabled = devtoolsState.highPerfModeEnabled
  if (highPerfModeEnabled) {
    toggleHighPerfMode(false)
  }
  try {
    return await callback()
  }
  finally {
    if (highPerfModeEnabled) {
      toggleHighPerfMode(true)
    }
  }
}

devtools.init()

const rpc = createRPCClient(
  'vite-plugin-vue-mcp',
  hot,
  {
    // get component tree
    async getInspectorTree(query) {
      const inspectorTree = await getComponentTree()
      rpc.onInspectorTreeUpdated(query.event, inspectorTree[0])
    },

    async getInspectorState(query) {
      const inspectorTree = await getComponentTree()
      const flattenedChildren = flattenChildren(inspectorTree[0])
      const targetNode = flattenedChildren.find(child => child.name === query.componentName)
      const inspectorState = await devtools.api.getInspectorState({
        inspectorId: COMPONENTS_INSPECTOR_ID,
        nodeId: targetNode.id,
      })
      rpc.onInspectorStateUpdated(query.event, stringify(inspectorState))
    },

    async editComponentState(query) {
      const inspectorTree = await getComponentTree()
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
          value: convertValue(query.value, query.valueType),
        },
        type: undefined,
      }

      console.warn('[MCP] Edit state payload:', payload)
      await devtools.ctx.api.editInspectorState(payload)
    },

    async highlightComponent(query) {
      clearTimeout(highlightComponentTimeout)
      const inspectorTree = await getComponentTree()
      const flattenedChildren = flattenChildren(inspectorTree[0])
      const targetNode = flattenedChildren.find(child => child.name === query.componentName)
      devtools.ctx.hooks.callHook('componentHighlight', { uid: targetNode.id })
      highlightComponentTimeout = setTimeout(() => {
        devtools.ctx.hooks.callHook('componentUnhighlight')
      }, 5000)
    },

    // Router operations
    async getRouterInfo(query) {
      rpc.onRouterInfoUpdated(query.event, JSON.stringify(devtoolsRouterInfo, null, 2))
    },

    // Pinia operations
    async getPiniaTree(query) {
      const inspectorTree = await withPiniaPerf(async () => {
        return await devtools.api.getInspectorTree({
          inspectorId: PINIA_INSPECTOR_ID,
          filter: '',
        })
      })
      rpc.onPiniaTreeUpdated(query.event, inspectorTree)
    },

    async getPiniaState(query) {
      const res = await withPiniaPerf(async () => {
        const payload = {
          inspectorId: PINIA_INSPECTOR_ID,
          nodeId: query.storeName,
        }
        const inspector = getInspector(payload.inspectorId)

        if (inspector) {
          inspector.selectedNodeId = payload.nodeId
        }

        return await devtools.ctx.api.getInspectorState(payload)
      })
      rpc.onPiniaInfoUpdated(query.event, stringify(res))
    },
  },
  {
    timeout: -1,
  },
)
