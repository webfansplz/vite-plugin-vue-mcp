import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import type { RpcFunctions, VueMcpContext, VueMcpOptions } from './types'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import c from 'ansis'
import { join } from 'pathe'
import { normalizePath, searchForWorkspaceRoot } from 'vite'
import { createRPCServer } from 'vite-dev-rpc'
import { setupRoutes } from './connect'
import { createVueMcpContext } from './context'
import { createServerRpc } from './rpc'

function getVueMcpPath(): string {
  const pluginPath = normalizePath(path.dirname(fileURLToPath(import.meta.url)))
  return pluginPath.replace(/\/dist$/, '/\/src')
}
const vueMcpResourceSymbol = '?__vue-mcp-resource'

export function VueMcp(options: VueMcpOptions = {}): Plugin {
  const {
    mcpPath = '/__mcp',
    updateCursorMcpJson = true,
    printUrl = true,
    mcpServer = (vite: ViteDevServer, ctx: VueMcpContext) => import('./server').then(m => m.createMcpServerDefault(options, vite, ctx)),
  } = options

  const cursorMcpOptions = typeof updateCursorMcpJson === 'boolean'
    ? { enabled: updateCursorMcpJson }
    : updateCursorMcpJson

  let config: ResolvedConfig
  const vueMcpPath = getVueMcpPath()
  const vueMcpOptionsImportee = 'virtual:vue-mcp-options'
  const resolvedVueMcpOptions = `\0${vueMcpOptionsImportee}`

  const ctx = createVueMcpContext()

  return {
    name: 'vite-plugin-mcp',
    enforce: 'pre',
    apply: 'serve',
    async configureServer(vite) {
      const rpc = createServerRpc(ctx)

      const rpcServer = createRPCServer<RpcFunctions, RpcFunctions>(
        'vite-plugin-vue-mcp',
        vite.ws,
        rpc,
        {
          timeout: -1,
        },
      )
      ctx.rpcServer = rpcServer
      ctx.rpc = rpc

      let mcp = await mcpServer(vite, ctx)
      mcp = await options.mcpServerSetup?.(mcp, vite) || mcp
      await setupRoutes(mcpPath, mcp, vite)

      const port = vite.config.server.port || 5173
      const root = searchForWorkspaceRoot(vite.config.root)

      const sseUrl = `http://${options.host || 'localhost'}:${port}${mcpPath}/sse`

      if (cursorMcpOptions.enabled) {
        if (existsSync(join(root, '.cursor'))) {
          const mcp = existsSync(join(root, '.cursor/mcp.json'))
            ? JSON.parse(await fs.readFile(join(root, '.cursor/mcp.json'), 'utf-8') || '{}')
            : {}
          mcp.mcpServers ||= {}
          mcp.mcpServers[cursorMcpOptions.serverName || 'vue-mcp'] = { url: sseUrl }
          await fs.writeFile(join(root, '.cursor/mcp.json'), `${JSON.stringify(mcp, null, 2)}\n`)
        }
      }

      if (printUrl) {
        setTimeout(() => {
          // eslint-disable-next-line no-console
          console.log(`${c.yellow.bold`  ➜  MCP:     `}Server is running at ${sseUrl}`)
        }, 300)
      }
    },
    async resolveId(importee: string) {
      if (importee === vueMcpOptionsImportee) {
        return resolvedVueMcpOptions
      }
      if (importee.startsWith('virtual:vue-mcp-path:')) {
        const resolved = importee.replace('virtual:vue-mcp-path:', `${vueMcpPath}/`)
        return `${resolved}${vueMcpResourceSymbol}`
      }
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    transform(code, id, _options) {
      if (_options?.ssr)
        return

      const appendTo = options.appendTo
      const [filename] = id.split('?', 2)

      if (appendTo
        && (
          (typeof appendTo === 'string' && filename.endsWith(appendTo))
          || (appendTo instanceof RegExp && appendTo.test(filename)))) {
        const modifiedCode = `import 'virtual:vue-mcp-path:overlay.js';\n${code}`
        return modifiedCode
      }

      return code
    },
    transformIndexHtml(html) {
      if (options.appendTo)
        return

      return {
        html,
        tags: [
          {
            tag: 'script',
            injectTo: 'head-prepend',
            attrs: {
              type: 'module',
              src: `${config.base || '/'}@id/virtual:vue-mcp-path:overlay.js`,
            },
          },
        ],
      }
    },
  }
}
