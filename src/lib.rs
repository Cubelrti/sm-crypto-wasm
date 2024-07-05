use std::{cell::RefCell};

use num_bigint::BigUint;
use num_traits::Num;
use rand::SeedableRng;
use wasm_bindgen::prelude::*;
use web_sys::console;
use rand_chacha::ChaCha8Rng;

mod crypto;

// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
//
// If you don't want to use `wee_alloc`, you can safely delete this.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

thread_local! {
    static RNG: RefCell<Option<ChaCha8Rng>> = RefCell::new(None);
}

#[wasm_bindgen]
pub fn init_rng_pool(seed: &[u8]) {
    let mut seed_arr = [0u8; 32];
    seed_arr.copy_from_slice(seed);
    RNG.with(|rng| {
        *rng.borrow_mut() = Some(
            ChaCha8Rng::from_seed(seed_arr)
        );
    });
}

#[wasm_bindgen]
pub fn sm3() -> String {
    console::log_1(&JsValue::from_str("invoked sm3"));
    let str = crypto::sm3::sm3_hash("abc".as_bytes());
    str
}

#[wasm_bindgen]
pub fn sm2_encrypt(pk: &str, data: &[u8]) -> String {
    console::log_1(&JsValue::from_str("invoked sm2_encrypt"));
    let enc_ctx = crypto::sm2::Encrypt::new(&pk);
    console::log_1(&JsValue::from_str(hex::encode(data).as_str()));
    let data_enc = enc_ctx.encrypt_hex(&data);
    data_enc
}

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[allow(non_snake_case)] // for JS interop and API consistency
pub struct KeyPair {
    pub publicKey: String,
    pub privateKey: String,
}

#[wasm_bindgen]
pub fn sm2_generate_keypair() -> JsValue {
    let (sk, pk) = crypto::sm2::gen_keypair();
    // prefix 04 for uncompressed public key
    let pk = format!("04{}", pk);
    let keypair = KeyPair {
        publicKey: pk,
        privateKey: sk,
    };
    serde_wasm_bindgen::to_value(&keypair).unwrap()
}

#[wasm_bindgen]
pub fn compress_public_key_hex(s: &str) -> Result<String, JsError> {
    if s.len() != 130 {
        return Err(JsError::new("invalid public key length"));
    }
    let public_key = &s[2..];
    let x_hex: &str = &public_key[0..64];
    let y: &str = &public_key[64..128];
    let y = BigUint::from_str_radix(y, 16).unwrap();
    let prefix = if y.bit(0) { "03" } else { "02" };
    let compressed = format!("{}{}", prefix, x_hex);
    Ok(compressed)
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
