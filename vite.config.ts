import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  assetsInclude: ['**/*.splinecode', '**/*.gltf', '**/*.fbx', '**/*.glb'],
  server: {
    port: 3300,
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  publicDir: 'public',
})
