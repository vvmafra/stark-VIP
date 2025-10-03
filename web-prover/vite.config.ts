import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    esbuildOptions: { target: 'esnext' },
    exclude: [
      '@noir-lang/noirc_abi', 
      '@noir-lang/acvm_js',
      '@noir-lang/noir_js',
      '@aztec/bb.js'
    ]
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})
