import { defineConfig } from 'vite';
import wasmPackPlugin from './plugin/vite-plugin-wasm-pack';
import webassemblyRenamePlugin from './plugin/vite-plugin-webassembly';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path, { resolve } from 'node:path';
import dts from 'vite-plugin-dts'

const ROOT = 'templates/web/'
// https://vitejs.dev/config/
export default defineConfig({
  define: {
    WORKER_SCRIPT_PATH: `'sm-crypto/workers/sm-crypto.js'`,
    WASM_BINARY_PATH: `'sm-crypto/crypto.wasm'`,
  },
  build: {
    outDir: ROOT,
    rollupOptions: {
      input: "html/index.html",
      output: {
        // format: 'cjs',
        dir: ROOT,
        // entryFileNames: '[name].js',
        // inlineDynamicImports: false,
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
  ]
});