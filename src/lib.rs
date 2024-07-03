use wasm_bindgen::prelude::*;
use web_sys::console;

mod crypto;

// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
//
// If you don't want to use `wee_alloc`, you can safely delete this.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn sm3() -> String {
    console::log_1(&JsValue::from_str("invoked sm3"));
    let str = crypto::sm3::sm3_hash("abc".as_bytes());
    str
}

#[wasm_bindgen]
pub fn sm2_encrypt() -> String {
    console::log_1(&JsValue::from_str("invoked sm2_encrypt"));
    let pk: String = String::from("04ac19d348738627d8e4b295ac792d0cdaf8489bdb3d932e569c485766d4dbf80a24ca30ead81e3b617f3c24852dfdf9cd13948c02b1e8692eb2e2200475a4cea0");
    let enc_ctx = crypto::sm2::Encrypt::new(&pk);
    let data: [u8; 16] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    let data_enc = enc_ctx.encrypt_hex(&data);
    data_enc
}

#[wasm_bindgen]
pub fn sm4_encrypt(input: String, key: &[u8], iv: &[u8]) -> String {
    console::log_1(&JsValue::from_str("invoked sm4_encrypt"));
    let data = crypto::sm4::CryptSM4CBC::new(key, iv).encrypt_cbc(input.as_bytes());
    hex::encode(data)
}


// This is like the `main` function, except for JavaScript.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    // This provides better error messages in debug mode.
    // It's disabled in release mode so it doesn't bloat up the file size.
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    // Your code goes here!
    console::log_1(&JsValue::from_str("sm-crypto-wasm 0.0.1 initialized."));
    Ok(())
}
