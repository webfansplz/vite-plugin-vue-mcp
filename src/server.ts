import type { ViteDevServer } from 'vite'
import type { VueMcpContext, VueMcpOptions } from './types'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { version } from '../package.json'

const TOOL_TIMEOUT = 10_000

// eslint-disable-next-line no-console
const log = (...args: any[]): void => console.log(...args)

function createToolHandler(
  ctx: VueMcpContext,
  toolName: string,
  rpcCall: (eventName: string) => void,
) {
  return () => {
    log(`[vue-mcp] tool:${toolName} called`)
    return new Promise<{ content: { type: 'text', text: string }[] }>((resolve, reject) => {
      const eventName = nanoid()

      const timeout = setTimeout(() => {
        console.error(`[vue-mcp] tool:${toolName} timed out after ${TOOL_TIMEOUT}ms — is a browser tab open?`)
        reject(new Error(`[vue-mcp] tool:${toolName} timed out — no response from browser client`))
      }, TOOL_TIMEOUT)

      ctx.hooks.hookOnce(eventName, (res) => {
        clearTimeout(timeout)
        log(`[vue-mcp] tool:${toolName} received response`)
        resolve({
          content: [{ type: 'text', text: JSON.stringify(res) }],
        })
      })

      try {
        rpcCall(eventName)
      }
      catch (e) {
        clearTimeout(timeout)
        console.error(`[vue-mcp] tool:${toolName} RPC call failed:`, e)
        reject(e)
      }
    })
  }
}

export function createMcpServerDefault(
  options: VueMcpOptions,
  _vite: ViteDevServer,
  ctx: VueMcpContext,
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
    'Get the Vue component tree in markdown tree syntax format.',
    {},
    createToolHandler(ctx, 'get-component-tree', (event) => {
      ctx.rpcServer.getInspectorTree({ event })
    }),
  )

  server.tool(
    'get-component-state',
    'Get the Vue component state in JSON structure format.',
    {
      componentName: z.string(),
    },
    async ({ componentName }) => {
      log(`[vue-mcp] tool:get-component-state called for "${componentName}"`)
      return new Promise((resolve, reject) => {
        const eventName = nanoid()

        const timeout = setTimeout(() => {
          console.error(`[vue-mcp] tool:get-component-state timed out after ${TOOL_TIMEOUT}ms`)
          reject(new Error(`[vue-mcp] tool:get-component-state timed out — no response from browser client`))
        }, TOOL_TIMEOUT)

        ctx.hooks.hookOnce(eventName, (res) => {
          clearTimeout(timeout)
          log(`[vue-mcp] tool:get-component-state received response`)
          resolve({
            content: [{ type: 'text', text: JSON.stringify(res) }],
          })
        })

        try {
          ctx.rpcServer.getInspectorState({ event: eventName, componentName })
        }
        catch (e) {
          clearTimeout(timeout)
          console.error(`[vue-mcp] tool:get-component-state RPC call failed:`, e)
          reject(e)
        }
      })
    },
  )

  server.tool(
    'edit-component-state',
    'Edit the Vue component state.',
    {
      componentName: z.string(),
      path: z.array(z.string()),
      value: z.string(),
      valueType: z.enum(['string', 'number', 'boolean', 'object', 'array']),
    },
    async ({ componentName, path, value, valueType }) => {
      log(`[vue-mcp] tool:edit-component-state called for "${componentName}" path=${path.join('.')}`)
      try {
        ctx.rpcServer.editComponentState({ componentName, path, value, valueType })
        log(`[vue-mcp] tool:edit-component-state completed`)
        return {
          content: [{ type: 'text', text: 'ok' }],
        }
      }
      catch (e) {
        console.error(`[vue-mcp] tool:edit-component-state failed:`, e)
        throw e
      }
    },
  )

  server.tool(
    'highlight-component',
    'Highlight the Vue component.',
    {
      componentName: z.string(),
    },
    async ({ componentName }) => {
      log(`[vue-mcp] tool:highlight-component called for "${componentName}"`)
      try {
        ctx.rpcServer.highlightComponent({ componentName })
        log(`[vue-mcp] tool:highlight-component completed`)
        return {
          content: [{ type: 'text', text: 'ok' }],
        }
      }
      catch (e) {
        console.error(`[vue-mcp] tool:highlight-component failed:`, e)
        throw e
      }
    },
  )

  server.tool(
    'get-router-info',
    'Get the Vue router info in JSON structure format.',
    {},
    createToolHandler(ctx, 'get-router-info', (event) => {
      ctx.rpcServer.getRouterInfo({ event })
    }),
  )

  server.tool(
    'get-pinia-state',
    'Get the Pinia state in JSON structure format.',
    {
      storeName: z.string(),
    },
    async ({ storeName }) => {
      log(`[vue-mcp] tool:get-pinia-state called for store "${storeName}"`)
      return new Promise((resolve, reject) => {
        const eventName = nanoid()

        const timeout = setTimeout(() => {
          console.error(`[vue-mcp] tool:get-pinia-state timed out after ${TOOL_TIMEOUT}ms`)
          reject(new Error(`[vue-mcp] tool:get-pinia-state timed out — no response from browser client`))
        }, TOOL_TIMEOUT)

        ctx.hooks.hookOnce(eventName, (res) => {
          clearTimeout(timeout)
          log(`[vue-mcp] tool:get-pinia-state received response`)
          resolve({
            content: [{ type: 'text', text: JSON.stringify(res) }],
          })
        })

        try {
          ctx.rpcServer.getPiniaState({ event: eventName, storeName })
        }
        catch (e) {
          clearTimeout(timeout)
          console.error(`[vue-mcp] tool:get-pinia-state RPC call failed:`, e)
          reject(e)
        }
      })
    },
  )

  server.tool(
    'get-pinia-tree',
    'Get the Pinia tree in JSON structure format.',
    {},
    createToolHandler(ctx, 'get-pinia-tree', (event) => {
      ctx.rpcServer.getPiniaTree({ event })
    }),
  )

  return server
}
