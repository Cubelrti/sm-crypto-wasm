use std::{cell::RefCell};

use num_bigint::BigUint;
use num_traits::Num;
use rand::SeedableRng;
use wasm_bindgen::prelude::*;
use web_sys::console;
use rand_chacha::ChaCha8Rng;
use crate::crypto::sm2::concvec;

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
    console::log_1(&hex::encode(seed_arr).into());
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


#[derive(Serialize, Deserialize)]
#[allow(non_snake_case)] // for JS interop and API consistency
pub struct Sm2EncryptOptions {
    pub asn1: bool,
    pub c1c2c3: bool,
}


#[wasm_bindgen]
pub fn sm2_encrypt(pk: &str, data: &[u8], options: JsValue) -> Vec<u8> {
    console::log_1(&JsValue::from_str("invoked sm2_encrypt"));
    let options: Sm2EncryptOptions = serde_wasm_bindgen::from_value(options).unwrap();
    let enc_ctx = crypto::sm2::Encrypt::new(&pk);
    let data_enc = match options.asn1 {
        true => enc_ctx.encrypt_asna1(data, options.c1c2c3),
        false => enc_ctx.encrypt(data, options.c1c2c3),
    };
    data_enc
}

#[wasm_bindgen]
pub fn sm2_encrypt_hex(pk: &str, data: &[u8], options: JsValue) -> String {
    console::log_1(&JsValue::from_str("invoked sm2_encrypt_hex"));
    let data_enc = sm2_encrypt(pk, data, options);
    hex::encode(data_enc)
}


#[wasm_bindgen]
pub fn sm2_decrypt(sk: &str, data: &[u8], options: JsValue) -> Vec<u8> {
    console::log_1(&"invoked sm2_decrypt".into());
    let options: Sm2EncryptOptions = serde_wasm_bindgen::from_value(options).unwrap();

    let dec_ctx = crypto::sm2::Decrypt::new(sk);
    let data_dec = match (options.asn1, options.c1c2c3) {
        (false, false) => dec_ctx.decrypt(data),
        (false, true) => dec_ctx.decrypt_c1c2c3(data),
        (true, false) => dec_ctx.decrypt_asna1(data),
        (true, true) => {
            let c1: &[u8] = &data[0..64];
            let c2 = &data[64..(data.len() - 32)];
            let c3 = &data[(data.len() - 32)..];
            let cipher_c1c3c2 = concvec!(c1, c3, c2);   
            dec_ctx.decrypt_asna1(&cipher_c1c3c2)
        },
    };
    data_dec
}

#[wasm_bindgen]
pub fn sm2_decrypt_hex(sk: &str, data: &[u8], options: JsValue) -> String {
    console::log_1(&"invoked sm2_decrypt".into());
    let data_dec = sm2_decrypt(sk, data, options);
    hex::encode(data_dec)
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
