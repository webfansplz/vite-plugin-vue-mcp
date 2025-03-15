import type { ViteDevServer } from 'vite'
import type { ViteMcpContext, VueMcpOptions } from './types'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { version } from '../package.json'

export function createMcpServerDefault(
  options: VueMcpOptions,
  vite: ViteDevServer,
  ctx: ViteMcpContext,
): McpServer {
  const server = new McpServer(
    {
      name: 'vite',
      version,
      ...options.mcpServerInfo,
    },
  )

  server.tool(
    'get-component-tree',
    'Get the Vue component tree.',
    {
    },
    async () => {
      return new Promise((resolve) => {
        const eventName = nanoid()
        ctx.hooks.hookOnce(eventName, (res) => {
          resolve({
            content: [{
              type: 'text',
              text: JSON.stringify(res),
            }],
          })
        })
        ctx.rpcServer.getInspectorTree({ event: eventName })
      })
    },
  )

  return server
}
