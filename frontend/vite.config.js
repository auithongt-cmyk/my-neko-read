import { createReadStream, existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const projectPublicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')

function serveProjectPublicAssets() {
  return {
    name: 'serve-project-public-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = new URL(req.url || '/', 'http://localhost').pathname
        const fileName = decodeURIComponent(pathname.slice(1))

        if (!fileName || path.basename(fileName) !== fileName) {
          next()
          return
        }

        const filePath = path.join(projectPublicDir, fileName)
        if (!existsSync(filePath)) {
          next()
          return
        }

        res.setHeader('Content-Type', 'image/png')
        createReadStream(filePath).pipe(res)
      })
    },
    generateBundle() {
      for (const fileName of readdirSync(projectPublicDir)) {
        const filePath = path.join(projectPublicDir, fileName)
        this.emitFile({
          type: 'asset',
          fileName,
          source: readFileSync(filePath),
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), serveProjectPublicAssets()],
  publicDir: '../public',
})
