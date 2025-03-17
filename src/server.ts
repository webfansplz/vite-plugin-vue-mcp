import type { ViteDevServer } from 'vite'
import type { VueMcpContext, VueMcpOptions } from './types'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { version } from '../package.json'

export function createMcpServerDefault(
  options: VueMcpOptions,
  vite: ViteDevServer,
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

  server.tool(
    'get-component-state',
    'Get the Vue component state in JSON structure format.',
    {
      componentName: z.string(),
    },
    async ({ componentName }) => {
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
        ctx.rpcServer.getInspectorState({ event: eventName, componentName })
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
      return new Promise((resolve) => {
        ctx.rpcServer.editComponentState({ componentName, path, value, valueType })
        resolve({
          content: [{
            type: 'text',
            text: 'ok',
          }],
        })
      })
    },
  )

  server.tool(
    'highlight-component',
    'Highlight the Vue component.',
    {
      componentName: z.string(),
    },
    async ({ componentName }) => {
      return new Promise((resolve) => {
        ctx.rpcServer.highlightComponent({ componentName })
        resolve({
          content: [{
            type: 'text',
            text: 'ok',
          }],
        })
      })
    },
  )

  server.tool(
    'get-router-info',
    'Get the Vue router info in JSON structure format.',
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
        ctx.rpcServer.getRouterInfo({ event: eventName })
      })
    },
  )

  server.tool(
    'get-pinia-state',
    'Get the Pinia state in JSON structure format.',
    {
      storeName: z.string(),
    },
    async ({ storeName }) => {
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
        ctx.rpcServer.getPiniaState({ event: eventName, storeName })
      })
    },
  )

  server.tool(
    'get-pinia-tree',
    'Get the Pinia tree in JSON structure format.',
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
        ctx.rpcServer.getPiniaTree({ event: eventName })
      })
    },
  )

  return server
}
