use std::{cell::RefCell, option};

use crate::crypto::sm2::concvec;
use bytemuck::cast_slice;
use num_bigint::BigUint;
use num_traits::{sign, Num};
use rand::SeedableRng;
use rand_chacha::ChaCha8Rng;
use serde_json::json;
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

thread_local! {
    static RNG: RefCell<Option<ChaCha8Rng>> = RefCell::new(None);
}

#[wasm_bindgen]
pub fn init_rng_pool(seed: &[u8]) {
    let mut seed_arr = [0u8; 32];
    seed_arr.copy_from_slice(seed);
    RNG.with(|rng| {
        *rng.borrow_mut() = Some(ChaCha8Rng::from_seed(seed_arr));
    });
}

#[wasm_bindgen]
pub fn sm3(input: &[u8]) -> Vec<u8> {
    console::log_1(&JsValue::from_str("invoked sm3"));
    let slice_u32 = crypto::sm3::sm3_hash_u32(input);
    // Cast the Vec<u32> to a slice of u8
    let slice_u8: &[u8] = cast_slice(&slice_u32);

    // Convert the slice into a Vec<u8> without copying
    Vec::from(slice_u8)
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
        }
    };
    data_dec
}

#[wasm_bindgen]
pub fn sm2_decrypt_hex(sk: &str, data: &[u8], options: JsValue) -> String {
    console::log_1(&"invoked sm2_decrypt_hex".into());
    let data_dec = sm2_decrypt(sk, data, options);
    hex::encode(data_dec)
}

#[derive(Serialize, Deserialize)]
#[allow(non_snake_case)] // for JS interop and API consistency
pub struct Sm2SignatureOptions {
    pub hash: bool,
    pub userId: Option<String>,
    pub der: bool,
}

#[wasm_bindgen]
pub fn sm2_sign(sk: &str, msg: &[u8], options: JsValue) -> String {
    console::log_1(&JsValue::from_str("invoked sm2_sign"));
    let options: Sm2SignatureOptions = serde_wasm_bindgen::from_value(options).unwrap();

    let id = (&options.userId).clone().unwrap_or_default();
    let sign_ctx = match options.userId {
        Some(_) => crypto::sm2::Sign::new_with_id(id.as_bytes(), sk),
        None => crypto::sm2::Sign::new(sk),
    };

    let sign = match options.hash {
        true => sign_ctx.sign(msg, options.der),
        false => sign_ctx.sign_raw(msg, options.der),
    };
    hex::encode(sign)
}

#[wasm_bindgen]
pub fn sm2_verify(pk: &str, msg: &[u8], sign: &str, options: JsValue) -> bool {
    console::log_1(&JsValue::from_str("invoked sm2_verify"));
    let options: Sm2SignatureOptions = serde_wasm_bindgen::from_value(options).unwrap();
    console::log_1(&options.hash.into());

    let id = (&options.userId).clone().unwrap_or_default();
    let verify_ctx = match options.userId {
        Some(_) => crypto::sm2::Verify::new_with_id(id.as_bytes(), pk),
        None => crypto::sm2::Verify::new(pk),
    };
    match options.hash {
        true => verify_ctx.verify(msg, &hex::decode(sign).unwrap(), options.der),
        false => verify_ctx.verify_raw(msg, &hex::decode(sign).unwrap(), options.der),
    }
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
pub fn sm3_hmac(key: &[u8], msg: &[u8]) -> Vec<u8> {
    console::log_1(&JsValue::from_str("invoked sm3_hmac"));
    crypto::sm3::sm3_hmac(key, msg)
}

#[derive(Serialize, Deserialize)]
#[allow(non_snake_case)] // for JS interop and API consistency
pub struct Sm4EncryptionOptions {
    // mode?: 'cbc' | 'ecb'
    // padding?: 'pkcs7' | 'none'
    // iv?: string | Uint8Array
    pub mode: String,
    pub padding: String,
    pub iv: Option<Vec<u8>>,
}


#[wasm_bindgen]
pub fn sm4_encrypt(input: &[u8], key: &[u8], options: JsValue) -> Vec<u8> {
    console::log_1(&JsValue::from_str("invoked sm4_encrypt"));
    let options: Sm4EncryptionOptions = serde_wasm_bindgen::from_value(options).unwrap();
    let data = match options.mode.as_str() {
        "cbc" => {
            let iv = options.iv.as_ref().map(|v| v.as_slice()).unwrap();
            crypto::sm4::CryptSM4CBC::new(key, iv).encrypt_cbc(input, options.padding == "pkcs7")
        },
        "ecb" => crypto::sm4::CryptSM4ECB::new(key).encrypt_ecb(input, options.padding == "pkcs7"),
        "ctr" => {
            let iv = options.iv.as_ref().map(|v| v.as_slice()).unwrap();
            crypto::sm4::encrypt_ctr(input, key, iv, options.padding == "pkcs7")
        }
        _ => panic!("mode {} not supported. for gcm, use sm4_encrypt_gcm instead", options.mode),
    };
    data
}

#[wasm_bindgen]
pub fn sm4_encrypt_gcm(input: &[u8], key: &[u8], iv: &[u8], aad: &[u8]) -> Vec<u8> {
    console::log_1(&JsValue::from_str("invoked sm4_encrypt_gcm"));
    let (data, tag) = crypto::sm4::encrypt_gcm(input, key, iv, aad);
    concvec!(&data, &tag)
}

#[wasm_bindgen]
pub fn sm4_encrypt_hex(input: &[u8], key: &[u8], options: JsValue) -> String {
    console::log_1(&JsValue::from_str("invoked sm4_encrypt_hex"));
    let data = sm4_encrypt(input, key, options);
    hex::encode(data)
}

#[wasm_bindgen]
pub fn sm4_decrypt(input: &[u8], key: &[u8], options: JsValue) -> Vec<u8> {
    console::log_1(&JsValue::from_str("invoked sm4_decrypt"));
    let options: Sm4EncryptionOptions = serde_wasm_bindgen::from_value(options).unwrap();
    let data = match options.mode.as_str() {
        "cbc" => {
            let iv = options.iv.as_ref().map(|v| v.as_slice()).unwrap();
            crypto::sm4::CryptSM4CBC::new(key, iv).decrypt_cbc(input, options.padding == "pkcs7")
        },
        "ecb" => crypto::sm4::CryptSM4ECB::new(key).decrypt_ecb(input, options.padding == "pkcs7"),
        _ => panic!("mode {} not supported", options.mode),
    };
    data
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
