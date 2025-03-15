import { devtools, stringify } from '@vue/devtools-kit'

import { createRPCClient } from 'vite-dev-rpc'
import { createHotContext } from 'vite-hot-client'

const hot = createHotContext()

devtools.init()

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
    async getInspectorTree(query) {
      const inspectorTree = await devtools.api.getInspectorTree({
        inspectorId: 'components',
        filter: '',
      })
      rpc.onInspectorTreeUpdated(query.event, inspectorTree[0])
    },
    async getInspectorState(query) {
      const inspectorTree = await devtools.api.getInspectorTree({
        inspectorId: 'components',
        filter: '',
      })
      const flattenedChildren = flattenChildren(inspectorTree[0])
      const targetNode = flattenedChildren.find(child => child.name === query.componentName)
      const inspectorState = await devtools.api.getInspectorState({
        inspectorId: 'components',
        nodeId: targetNode.id,
      })
      rpc.onInspectorStateUpdated(query.event, stringify(inspectorState))
    },
  },
  {
    timeout: -1,
  },
)
