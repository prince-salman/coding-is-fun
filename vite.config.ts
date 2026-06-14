import { defineConfig, loadEnv, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { tryHandleTtsRequest } from './server/tts-handler.js'

/**
 * Plugin dev: menyediakan endpoint /api/tts saat `npm run dev`.
 * API key dibaca via loadEnv (server-side) — TIDAK di-inline ke bundle client.
 */
function ttsDevPlugin(mode: string): PluginOption {
  const env = loadEnv(mode, process.cwd(), '')
  const getApiKey = () => process.env.GEMINI_API_KEY || env.GEMINI_API_KEY
  return {
    name: 'tts-dev-endpoint',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        tryHandleTtsRequest(getApiKey, req, res).then((handled) => {
          if (!handled) next()
        }, next)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), ttsDevPlugin(mode)],
}))
