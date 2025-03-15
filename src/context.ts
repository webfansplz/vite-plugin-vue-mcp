import type { ViteMcpContext } from './types'
import { createHooks } from 'hookable'

export function createViteMcpContext(): ViteMcpContext {
  return {
    hooks: createHooks(),
    rpc: null!,
    rpcServer: null!,
  }
}
