import { defineConfig } from 'vite';
import wasmPackPlugin from './plugin/vite-plugin-wasm-pack';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path, { resolve } from 'node:path';

const ROOT = 'templates/web/'
// https://vitejs.dev/config/
export default defineConfig({
  define: {
    WASM_BINARY_PATH: `undefined`,
  },
  base: '/sm-crypto-wasm/',
  build: {
    outDir: ROOT,
    rollupOptions: {
      output: {
        // format: 'cjs',
        dir: ROOT,
        // entryFileNames: '[name].js',
        // inlineDynamicImports: false,
      }
    },
  },
  plugins: [
    wasmPackPlugin({
      extraArgs: '--target web --release'
    }),
  ]
});