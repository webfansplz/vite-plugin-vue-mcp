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
    // router info
    getRouterInfo: (_: { event: string }) => ({}),
    onRouterInfoUpdated: (event: string, data: string) => {
      ctx.hooks.callHook(event, data)
    },
    // pinia info
    getPiniaState: (_: { event: string, storeName: string }) => ({}),
    onPiniaInfoUpdated: (event: string, data: string) => {
      ctx.hooks.callHook(event, data)
    },
  }
}
