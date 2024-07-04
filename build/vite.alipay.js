import { defineConfig } from 'vite';
import wasmPackPlugin from './plugin/vite-plugin-wasm-pack';
import webassemblyRenamePlugin from './plugin/vite-plugin-webassembly';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path, { resolve } from 'node:path';
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    PLATFORM: 'my',
    WORKER_SCRIPT_PATH: `'sm-crypto/workers/sm-crypto.js'`,
    WASM_BINARY_PATH: `'sm-crypto/crypto.wasm'`,
    __CONVERT_ARRAYBUFFER__: true,
  },

  build: {
    lib: {
      entry: resolve(__dirname, '../js/index.worker.ts'),
      name: 'smCrypto',
      fileName: 'index',
      formats: ['cjs'],
    },
    outDir: 'templates/alipay/sm-crypto/',
    rollupOptions: {
      input: {
        index: 'js/index.worker.ts',
        'workers/sm-crypto': 'js/worker-index.js',
      },
      output: {
        format: 'cjs',
        dir: 'templates/alipay/sm-crypto/',
        entryFileNames: '[name].js',
        inlineDynamicImports: false,
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
    dts({
      copyDtsFiles: true,
    }),
  ]
});