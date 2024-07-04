import { defineConfig } from 'vite';
import wasmPackPlugin from './plugin/vite-plugin-wasm-pack';
import webassemblyRenamePlugin from './plugin/vite-plugin-webassembly';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path, { resolve } from 'node:path';
import dts from 'vite-plugin-dts'

let PREFER_WORKER = false;

const ROOT = 'templates/tt/sm-crypto/'
// https://vitejs.dev/config/
export default defineConfig({
  define: {
    PLATFORM: 'tt',
    __CONVERT_ARRAYBUFFER__: true,
    WORKER_SCRIPT_PATH: `'sm-crypto/workers/sm-crypto.js'`,
    WASM_BINARY_PATH: `'/sm-crypto/crypto.wasm'`,
  },
  build: {
    lib: {
      entry: resolve(__dirname, `../js/index.${PREFER_WORKER ? '' : 'wasm.'}ts`),
      name: 'smCrypto',
      fileName: 'index',
      formats: ['cjs'],
    },
    outDir: ROOT,
    rollupOptions: {
      input: {
        index: PREFER_WORKER ? 'js/index.ts' : 'js/index.wasm.ts',
        'workers/sm-crypto': 'js/worker-index.js',
      },
      output: {
        format: 'cjs',
        dir: ROOT,
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        inlineDynamicImports: false,
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
      extraArgs: '--target web --release',
    }),
    webassemblyRenamePlugin({
      name: 'TTWebAssembly',
    }),
    dts({
      copyDtsFiles: true,
    }),
  ]
});