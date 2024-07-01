import { defineConfig } from 'vite';
import wasmPackPlugin from './plugin/vite-plugin-wasm-pack';
import webassemblyRenamePlugin from './plugin/vite-plugin-webassembly';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'node:path';
const ROOT = 'templates/weapp/sm-crypto/'
// https://vitejs.dev/config/
export default defineConfig({
  define: {
    UNIFIED_PLATFORM: 'wx',
  },
  build: {
    rollupOptions: {
      input: {
        index: 'js/index.js',
        'workers/sm-crypto': 'js/worker-index.js',
      },
      output: {
        format: 'cjs',
        dir: ROOT,
        entryFileNames: '[name].js',
      }
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'pkg/index_bg.wasm', dest: path.join(__dirname, '..', ROOT), rename: 'crypto.wasm' },
      ],

    }),
    wasmPackPlugin({
      extraArgs: '--target web --release'
    }),
    webassemblyRenamePlugin({
      name: 'WXWebAssembly',
    }),
  ]
});