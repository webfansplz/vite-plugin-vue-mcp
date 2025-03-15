import type { RpcFunctions, ViteMcpContext } from './types'

export function createServerRpc(ctx: ViteMcpContext): RpcFunctions {
  return {
    // component tree
    getInspectorTree: (_: { event: string, componentName?: string }) => ({}),
    onInspectorTreeUpdated: (event: string, data: string) => {
      ctx.hooks.callHook(event, data)
    },
    // component state
    getInspectorState: (_: { event: string, componentName: string }) => ({}),
    onInspectorStateUpdated: (event: string, data: string) => {
      ctx.hooks.callHook(event, data)
    },
  }
}
