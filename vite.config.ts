import tailwindcss from '@tailwindcss/vite'
import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'

const CHUNKS: Record<string, Set<string>> = {
  data: new Set([
    '@tanstack/react-query',
    '@tanstack/react-router',
    '@tanstack/react-table',
    'pocketbase'
  ]),
  forms: new Set([
    'react-hook-form',
    '@hookform/resolvers',
    'zod',
    'date-fns',
    'react-day-picker'
  ]),
  ui: new Set([
    '@radix-ui/react-avatar',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-icons',
    '@radix-ui/react-label',
    '@radix-ui/react-popover',
    '@radix-ui/react-select',
    '@radix-ui/react-separator',
    '@radix-ui/react-slot',
    '@radix-ui/react-switch',
    '@radix-ui/react-toggle',
    '@radix-ui/react-toggle-group',
    'class-variance-authority',
    'clsx',
    'next-themes',
    'lucide-react',
    'cmdk',
    'vaul',
    'sonner'
  ])
}

function manualChunks(id: string) {
  const match = id.match(/\/node_modules\/((?:@[^/]+\/)?[^/]+)\//)
  if (!match) return
  const pkg = match[1]
  for (const [chunk, pkgs] of Object.entries(CHUNKS)) {
    if (pkgs.has(pkg)) return chunk
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:8090'

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss()
    ],
    build: {
      outDir: './backend/dist',
      emptyOutDir: true,
      rolldownOptions: {
        output: { manualChunks }
      }
    },
    publicDir: './frontend/public',
    resolve: { alias: { '@': path.resolve(__dirname, './frontend/src') } },
    server: {
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true
        }
      }
    }
  }
})