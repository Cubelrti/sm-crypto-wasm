import { defineConfig } from 'vite';
import wasmPackPlugin from './plugin/vite-plugin-wasm-pack';
import webassemblyPlugin from './plugin/vite-plugin-webassembly';
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
    WASM_BINARY_PATH: `'sm-crypto/crypto.wasm'`,
  },
  build: {
    lib: {
      entry: resolve(__dirname, `../js/index.${PREFER_WORKER ? 'worker' : 'native'}.ts`),
      name: 'smCrypto',
      fileName: 'index',
      formats: ['cjs'],
    },
    outDir: ROOT,
    rollupOptions: {
      input: {
        index: `js/index.${PREFER_WORKER ? 'worker' : 'native'}.ts`,
        // if you use worker, you need to uncomment the following line:
        // 'workers/sm-crypto': 'js/worker-index.js',
      },
      output: {
        format: 'cjs',
        dir: ROOT,
        entryFileNames: '[name].js',
        inlineDynamicImports: false,
      }
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'js/pkg/index_bg.wasm', dest: path.join(__dirname, '..', ROOT), rename: 'crypto.wasm' },
      ],

    }),
    wasmPackPlugin({
      extraArgs: '--target web --release'
    }),
    webassemblyPlugin({
      name: 'TTWebAssembly',
    }),
    dts({
      copyDtsFiles: true,
      rollupTypes: true,
      rollupOptions: {
        showVerboseMessages: true,
      },
    }),
  ]
});