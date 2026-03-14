import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { ViteDevServer } from 'vite'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'

// eslint-disable-next-line no-console
const log = (...args: any[]): void => console.log(...args)

export async function setupRoutes(
  base: string,
  createServer: () => Promise<McpServer>,
  vite: ViteDevServer,
): Promise<void> {
  const transports = new Map<string, SSEServerTransport>()

  vite.middlewares.use(`${base}/sse`, async (req, res) => {
    try {
      const transport = new SSEServerTransport(`${base}/messages`, res)
      const server = await createServer()
      transports.set(transport.sessionId, transport)
      log(`[vue-mcp] SSE client connected: ${transport.sessionId}`)
      res.on('close', () => {
        log(`[vue-mcp] SSE client disconnected: ${transport.sessionId}`)
        transports.delete(transport.sessionId)
        server.close().catch((e: unknown) => {
          console.error('[vue-mcp] Error closing MCP server:', e)
        })
      })
      await server.connect(transport)
    }
    catch (e) {
      console.error('[vue-mcp] SSE connection error:', e)
      if (!res.headersSent) {
        res.statusCode = 500
        res.end('Internal Server Error')
      }
    }
  })

  vite.middlewares.use(`${base}/messages`, async (req, res) => {
    if (req.method !== 'POST') {
      res.statusCode = 405
      res.end('Method Not Allowed')
      return
    }

    const query = new URLSearchParams(req.url?.split('?').pop() || '')
    const clientId = query.get('sessionId')

    if (!clientId || typeof clientId !== 'string') {
      res.statusCode = 400
      res.end('Bad Request')
      return
    }

    const transport = transports.get(clientId)
    if (!transport) {
      console.warn(`[vue-mcp] Message for unknown session: ${clientId}`)
      res.statusCode = 404
      res.end('Not Found')
      return
    }

    try {
      log(`[vue-mcp] Message received from session: ${clientId}`)
      await transport.handlePostMessage(req, res)
    }
    catch (e) {
      console.error(`[vue-mcp] Message handling error for session ${clientId}:`, e)
      if (!res.headersSent) {
        res.statusCode = 500
        res.end('Internal Server Error')
      }
    }
  })
}
