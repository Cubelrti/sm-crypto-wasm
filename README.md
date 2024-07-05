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
- WeChat Mini Program
- Douyin Mini Program / Toutiao Mini Program
- Alipay Mini Program (Worker Only, Enterprise Entity Required)

## Secure Random Number Generation

For secure random number generation, we use `rand` crate for Rust, and `rand_core` for WebAssembly.

For WebAssembly in browser, we use `js-sys` to call `crypto.getRandomValues` for secure random number generation.

For mini program runtime, only WeChat Mini Program provided `wx.getRandomValues`. For other platforms, you may need to provide your own secure random number generation, like get random number from server, or avoid using algorithms that require some random number:
- SM2: Key Exchange, Signature, Encryption

It is strongly recommended to use secure random number generation for security. We provide a shim for `getRandomValues` for unsupported platforms using `Math.random()`, but it is not secure enough for production use.

Internally we use `ChaCha8` for random number generation, which is secure enough for most cases. But for security, the seed should be generated from a secure source and contain enough entropy.


## Background

Native WebAssembly is more suggested as it don't have worker count limits and may have better performance.

Platform Support Matrix:

| Platform        | WeChat     | Douyin     | Alipay      |
| --------------- | ---------- | ---------- | ----------- |
| iOS(Worker)     | ✅ (8.0.49) | ✅ (3.0.30) | ✅ (10.6.6)  |
| iOS(Native)     | ✅ (8.0.49) | ✅ (3.0.30) | ❌           |
| Android(Worker) | ✅ (8.0.49) | ✅ (30.5.0) | ✅ (10.6.10) |
| Android(Native) | ✅ (8.0.49) | ✅ (30.5.0) | ❌           |

Note:
- Alipay only support WebAssembly inside Worker.
- WeChat need manual removal of `instantiateStreaming` for Worker on Android.
- Douyin need custom shim for Crypto API and TextEncoder/TextDecoder.
- WeChat need custom shim for TextEncoder/TextDecoder for Native WebAssembly.
- WeChat and Douyin Android can only pass ArrayBuffer back and forth between JS and Worker.

## Usage
Install with Package Manager you have:

```bash
npm install @sm-crypto-wasm/weapp # for specific environment
```

or, view `templates` for specific platform to start.

Since the project is still under development, you may need to build the project by yourself.

Alternatively, you can see the code snippet for several DevTools:
- [WeChat DevTools Snippet](https://example.com)
- [Alipay DevTools Snippet](https://example.com)

## API

### SM2 Public Key Cryptography

```typescript

let keypair = await sm2.generateKeyPairHex() // Promise<{ privateKey: string, publicKey: string }>
let compressedPublicKey = sm2.compressPublicKeyHex(publicKey) 
```

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
rustup install nightly # for reference, we use nightly-2024-02-28
rustup default nightly-2024-02-28-aarch64-apple-darwin
rustc --version
# rustc 1.78.0-nightly (ef324565d 2024-02-27)
```

## Reference

This project heavily inspired by the following projects, most of code are borrowed from them:

- [sm-crypto](https://github.com/JuneAndGreen/sm-crypto)
- [wx-wasm-bindgen](https://github.com/planet0104/wx-wasm-bindgen)
- [smcrypto rust implementation](https://github.com/zhuobie/smcrypto)

## More Platform

If you want to support more platforms, please open an issue or PR to discuss. 

### OpenHarmony

For OpenHarmony, since there is no WebAssembly support, you can use `smcrypto` crate for Rust, and compile it to cdylib for C/C++ usage. And HarmonyOS provides a Crypto Framework for SM2/SM3/SM4, you can use it directly.

See also: https://doc.rust-lang.org/rustc/platform-support/openharmony.html and https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/js-apis-cryptoframework-V5

You can refer to [this article](https://ohos.rs/docs/basic.html) for more information.
