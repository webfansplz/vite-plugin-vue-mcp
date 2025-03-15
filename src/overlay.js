import { devtools } from '@vue/devtools-kit'

import { createRPCClient } from 'vite-dev-rpc'
import { createHotContext } from 'vite-hot-client'

const hot = createHotContext()

devtools.init()

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
      console.log('getInspectorTree', query)
    },
  },
  {
    timeout: -1,
  },
)
