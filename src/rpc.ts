import type { RpcFunctions, ViteMcpContext } from './types'

export function createServerRpc(ctx: ViteMcpContext): RpcFunctions {
  return {
    getInspectorTree: (options: { event: string, componentName?: string }) => ({}),
    onInspectorTreeUpdated: (event: string, data: string) => {
      ctx.hooks.callHook(event, data)
    },
  }
}
