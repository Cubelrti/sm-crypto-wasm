import { defineConfig } from 'vite';
import wasmPackPlugin from './plugin/vite-plugin-wasm-pack';
import webassemblyRenamePlugin from './plugin/vite-plugin-webassembly';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: 'js/index.js',
      output: {
        format: 'cjs',
        dir: 'templates/alipay/workers/',
        entryFileNames: 'index.js',
      }
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'pkg/index_bg.wasm', dest: path.join(__dirname, '..', 'templates/alipay/') },
      ]
    }),
    wasmPackPlugin({
      extraArgs: '--target web --release'
    }),
    webassemblyRenamePlugin({
      name: 'MYWebAssembly',
    }),
  ]
});