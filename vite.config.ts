import fs from 'node:fs'
import path from 'node:path'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, type Plugin } from 'vite'

const MODELS_SOURCE_DIR = path.resolve(
  import.meta.dirname,
  'src/assets/images/productPage/models3d',
)

const MIME_TYPES: Record<string, string> = {
  '.gltf': 'model/gltf+json',
  '.glb': 'model/gltf-binary',
  '.bin': 'application/octet-stream',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
}

function serveAssets3DPlugin(): Plugin {
  const createMiddleware = () => {
    return (
      req: { url?: string },
      res: {
        statusCode: number
        setHeader: (name: string, value: string) => void
        end: (data?: Buffer | string) => void
      },
      next: () => void,
    ) => {
      if (!req.url || !req.url.startsWith('/models/')) {
        next()
        return
      }

      const rawPath = decodeURIComponent(req.url.split('?')[0].slice('/models/'.length))
      const resolvedPath = path.resolve(MODELS_SOURCE_DIR, rawPath)

      if (!resolvedPath.startsWith(MODELS_SOURCE_DIR)) {
        res.statusCode = 403
        res.end('Forbidden')
        return
      }

      if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
        next()
        return
      }

      const ext = path.extname(resolvedPath).toLowerCase()
      res.setHeader('Content-Type', MIME_TYPES[ext] ?? 'application/octet-stream')
      fs.createReadStream(resolvedPath).pipe(res as unknown as NodeJS.WritableStream)
    }
  }

  return {
    name: 'serve-assets-3d-models',
    configureServer(server) {
      server.middlewares.use(createMiddleware())
    },
    configurePreviewServer(server) {
      server.middlewares.use(createMiddleware())
    },
    closeBundle() {
      const distModelsDir = path.resolve(import.meta.dirname, 'dist/models')
      if (fs.existsSync(MODELS_SOURCE_DIR)) {
        fs.cpSync(MODELS_SOURCE_DIR, distModelsDir, { recursive: true })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    serveAssets3DPlugin(),
  ],
})
