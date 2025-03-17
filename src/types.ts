import type { Awaitable } from '@antfu/utils'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { Implementation as McpServerInfo } from '@modelcontextprotocol/sdk/types.js'
import type { BirpcGroupReturn } from 'birpc'
import type { Hookable } from 'hookable'
import type { ViteDevServer } from 'vite'

export interface RpcFunctions {
  // components
  getInspectorTree: (options: { event: string, componentName?: string }) => void
  onInspectorTreeUpdated: (event: string, data: string) => void
  getInspectorState: (options: { event: string, componentName: string }) => void
  onInspectorStateUpdated: (event: string, data: string) => void
  highlightComponent: (options: { componentName: string }) => void
  // router
  getRouterInfo: (options: { event: string }) => void
  onRouterInfoUpdated: (event: string, data: string) => void
  // pinia
  getPiniaState: (options: { event: string, storeName: string }) => void
  onPiniaInfoUpdated: (event: string, data: string) => void
  getPiniaTree: (options: { event: string }) => void
  onPiniaTreeUpdated: (event: string, data: string) => void
}
export interface VueMcpContext {
  hooks: Hookable
  rpc: RpcFunctions
  rpcServer: BirpcGroupReturn<RpcFunctions>
}
export interface VueMcpOptions {
  /**
   * The host to listen on, default is `localhost`
   */
  host?: string

  /**
   * The port to listen on, default is the port of the Vite dev server
   */
  port?: number

  /**
   * Print the MCP server URL in the console
   *
   * @default true
   */
  printUrl?: boolean

  /**
   * The MCP server info. Ingored when `mcpServer` is provided
   */
  mcpServerInfo?: McpServerInfo

  /**
   * Custom MCP server, when this is provided, the built-in MCP tools will be ignored
   */
  mcpServer?: (viteServer: ViteDevServer) => Awaitable<McpServer>

  /**
   * Setup the MCP server, this is called when the MCP server is created
   * You may also return a new MCP server to replace the default one
   */
  mcpServerSetup?: (server: McpServer, viteServer: ViteDevServer) => Awaitable<void | McpServer>

  /**
   * The path to the MCP server, default is `/__mcp`
   */
  mcpPath?: string

  /**
   * Update the address of the MCP server in the cursor config file `.cursor/mcp.json`,
   * if `.cursor` folder exists.
   *
   * @default true
   */
  updateCursorMcpJson?: boolean | {
    enabled: boolean
    /**
     * The name of the MCP server, default is `vue-mcp`
     */
    serverName?: string
  }

  /**
   * append an import to the module id ending with `appendTo` instead of adding a script into body
   * useful for projects that do not use html file as an entry
   *
   * WARNING: only set this if you know exactly what it does.
   * @default ''
   */
  appendTo?: string | RegExp
}
