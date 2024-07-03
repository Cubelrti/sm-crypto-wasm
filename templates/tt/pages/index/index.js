
const app = getApp()

Page({
  data: {

  },
  onLoad: async function () {
  },
  test: async () => {
    try {
      let fn = () => {}
      const a = await TTWebAssembly.instantiate('/crypto.wasm', {
        wbg: {
          __wbg_self_ce0dbfc45cf2f5be: fn,
          __wbg_window_c6fb939a7f436783: fn,
          __wbindgen_object_drop_ref: fn,
          __wbg_globalThis_d1e6af4856ba331b: fn,
          __wbg_global_207b558942527489: fn,
          __wbindgen_is_undefined: fn,
          __wbg_newnoargs_e258087cd0daa0ea: fn,
          __wbg_call_27c0f87801dedf93: fn,
          __wbindgen_object_clone_ref: fn,
          __wbg_crypto_1d1f22824a6a080c: fn,
          __wbindgen_is_object: fn,
          __wbg_process_4a72847cc503995b: fn,
          __wbg_versions_f686565e586dd935: fn,
          __wbg_node_104a2ff8d6ea03a2: fn,
          __wbindgen_is_string: fn,
          __wbg_require_cca90b1a94a0255b: fn,
          __wbindgen_is_function: fn,
          __wbindgen_string_new: fn,
          __wbg_call_b3ca7c6051f9bec1: fn,
          __wbg_msCrypto_eb05e62b530a1508: fn,
          __wbg_newwithlength_e9b4878cebadb3d3: fn,
          __wbindgen_memory: fn,
          __wbg_buffer_12d079cc21e14bdb: fn,
          __wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb: fn,
          __wbg_randomFillSync_5c9c955aa56b6049: fn,
          __wbg_subarray_a1f73cd4b5b42fe1: fn,
          __wbg_getRandomValues_3aa56aa6edec874c: fn,
          __wbg_new_63b92bc8671ed464: fn,
          __wbg_set_a47bac70306a19a7: fn,
          __wbg_log_5bb5f88f245d7762: fn,
          __wbindgen_throw: fn,
        },
      })
      console.log('ok', a)
    } catch (error) {
      console.log('fail', error)
    }
  },
  load: async () => {
    const smCrypto = require('../../sm-crypto/index')
    console.log('Welcome to Mini Code')
    await smCrypto.initSMCrypto()
    console.log('Loaded')
    const sm2Result = await smCrypto.sm2()
    console.log(sm2Result)
    const sm3Result = await smCrypto.sm3()
    console.log(sm3Result)
    const sm4Result = await smCrypto.sm4('123', new Uint8Array(16), new Uint8Array(16))
    console.log(sm4Result)

  }
})
