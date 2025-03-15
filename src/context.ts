import type { VueMcpContext } from './types'
import { createHooks } from 'hookable'

export function createVueMcpContext(): VueMcpContext {
  return {
    hooks: createHooks(),
    rpc: null!,
    rpcServer: null!,
  }
}
