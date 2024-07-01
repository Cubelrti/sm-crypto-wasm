import { defineConfig } from 'vite';
import wasmPackPlugin from './plugin/vite-plugin-wasm-pack';
import webassemblyRenamePlugin from './plugin/vite-plugin-webassembly';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: 'js/index.js',
        worker: 'js/worker-index.js',
      },
      output: {
        format: 'cjs',
        dir: 'templates/alipay/sm-crypto/',
        entryFileNames: '[name].js',
      }
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'pkg/index_bg.wasm', dest: path.join(__dirname, '..', 'templates/alipay/sm-crypto/'), rename: 'crypto.wasm' },
      ],

    }),
    wasmPackPlugin({
      extraArgs: '--target web --release'
    }),
    webassemblyRenamePlugin({
      name: 'MYWebAssembly',
    }),
  ]
});