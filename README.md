# sm-crypto-wasm

<center>
Universal ShangMi Cryptography Library in WebAssembly

基于 WebAssembly 的全平台国密加解密库
</center>

Disclaimer: This project is still under development, and the API may change in the future.

## Features

- Decent Performance for Encryption and Decryption by WebAssembly
- SM2/SM3/SM4 Algorithms and Key Exchange Protocols
- Similar API to `sm-crypto` and `sm-crypto-v2` for development convenience

## Supported Runtime

- Web, Browser(H5)
- WeChat MiniProgram
- Toutiao MiniProgram
- Alipay MiniProgram (Worker Only)

For Cross-Platform Runtime, we also supported Taro and Uniapp:
- Taro v3.x
- Uni-app v4.x

## Terminology

For different platforms, due to API inconsistency, we have to use different terminology for the same concept:
- Alipay: Worker
- WeChat: WXWebAssembly or Worker
- Toutiao / Douyin: TTWebAssembly

Native WebAssembly is more suggested as it don't have worker count limits and may have better performance.

Platform Support Matrix:

| Platform        | WeChat        | Douyin     | Alipay      |
| --------------- | ------------- | ---------- | ----------- |
| iOS(Worker)     | ✅ (8.0.49)    | ✅ (3.0.30) | ✅ (10.6.6)  |
| iOS(Native)     | ✅ (8.0.49)    | ✅ (3.0.30) | ❌           |
| Android(Worker) | ❌ (Error)     | ✅ (30.5.0) | ✅ (10.6.10) |
| Android(Native) | ✅ (15.0.2560) | ✅ (30.5.0) | ❌           |

Note:
- Alipay don't support Native WebAssembly yet.
- WeChat Android Worker has some issues with WebAssembly loading: `Failed to load module Missing internal module _http_agent.`
- Douyin need custom shim for Crypto API and TextEncoder/TextDecoder.
- WeChat need custom shim for TextEncoder/TextDecoder for Native WebAssembly.
- Douyin Android can only pass ArrayBuffer back and forth between JS and Worker.
- WeChat can only pass ArrayBuffer back and forth between JS and Worker.

## Usage
<!-- 
Install with Package Manager you have:

```bash
npm install @sm-crypto-wasm/weapp # for specific environment
``` -->

or, view `templates` for specific platform to start.

Since the project is still under development, you may need to build the project by yourself.

<!-- Alternatively, you can see the code snippet for several DevTools:
- [WeChat DevTools Snippet](https://example.com)
- [Alipay DevTools Snippet](https://example.com) -->

## API

Not ready yet. Please refer to `lib.rs` to add your API manually.

## License

MIT

## Development & Contribution

You need Rust and wasm-pack to build the project. 

```bash
rustup toolchain install nightly
rustup target add wasm32-unknown-unknown
cargo install wasm-pack
```

For usability, we use some nightly features, so you may need to install nightly Rust:

```bash
rustup install nightly
# rustc --version
# rustc 1.78.0-nightly (ef324565d 2024-02-27)
```

## Reference

This project heavily inspired by the following projects:
- [sm-crypto](https://github.com/JuneAndGreen/sm-crypto)
- [wx-wasm-bindgen](https://github.com/planet0104/wx-wasm-bindgen)

We also use the following crates:
- [smcrypto rust implementation](https://github.com/zhuobie/smcrypto)
