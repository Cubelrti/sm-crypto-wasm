use wasm_bindgen::prelude::wasm_bindgen;
use crate::concvec;

use super::sm4;

pub fn derive_key_nonce(key: &[u8], nonce: &[u8]) -> (Vec<u8>, Vec<u8>) {
    let mut k = sm4::encrypt_cbc(&vec![0u8; 16], key, &vec![0u8; 16], false);
    let mut msb = 0u8;
    let klen = k.len();
    for i in (0..klen).rev() {
        msb = k[i] >> 7;
        k[i] = (k[i] << 1) | msb;
    }
    k[klen - 1] ^= msb * 0b10000111;

    let mut m: Vec<u8> = vec![0u8; 16];
    m[1] = 0x04; // 0x04 indicates SM4
    m[2] = 0x58; // 'X'
    m[4..].copy_from_slice(&nonce[..12]);
    let kx = sm4::encrypt_cbc(&m, key, &k, false);
    let nx = nonce[12..].to_vec();
    (kx, nx)
}

#[wasm_bindgen]
pub fn xsm4_encrypt(key: &[u8], nonce: &[u8], data: &[u8], aad: &[u8]) -> Vec<u8> {
    let (kx, nx) = derive_key_nonce(key, nonce);
    let (cipher, tag) = sm4::encrypt_gcm(data, &kx, &nx, aad);
    concvec!(&cipher, &tag)
}

#[wasm_bindgen]
pub fn xsm4_decrypt(key: &[u8], nonce: &[u8], data: &[u8], aad: &[u8]) -> Vec<u8> {
  let (data, tag) = data.split_at(data.len() - 16);
    let (kx, nx) = derive_key_nonce(key, nonce);
    sm4::decrypt_gcm(data, &kx, &nx, aad, tag)
      .unwrap_or([].into())
}