import type { RpcFunctions, VueMcpContext } from './types'

export function createServerRpc(ctx: VueMcpContext): RpcFunctions {
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
    // pinia tree
    getPiniaTree: (_: { event: string }) => ({}),
    onPiniaTreeUpdated: (event: string, data: string) => {
      ctx.hooks.callHook(event, data)
    },
    // pinia state
    getPiniaState: (_: { event: string, storeName: string }) => ({}),
    onPiniaInfoUpdated: (event: string, data: string) => {
      ctx.hooks.callHook(event, data)
    },
    // edit component state
    editComponentState: (options: { componentName: string, path: string[], value: string, valueType: string }) => {},
    // highlight component
    highlightComponent: (options: { componentName: string }) => {},
  }
}
