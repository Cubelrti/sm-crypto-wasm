use ghash::universal_hash::UniversalHash;
use ghash::{
    universal_hash::{
        array::Array,
        consts::{U16},
        KeyInit,
    },
    GHash,
};
const SM4_BOXES_TABLE: [u8; 256] = [
    0xd6, 0x90, 0xe9, 0xfe, 0xcc, 0xe1, 0x3d, 0xb7, 0x16, 0xb6, 0x14, 0xc2, 0x28, 0xfb, 0x2c, 0x05,
    0x2b, 0x67, 0x9a, 0x76, 0x2a, 0xbe, 0x04, 0xc3, 0xaa, 0x44, 0x13, 0x26, 0x49, 0x86, 0x06, 0x99,
    0x9c, 0x42, 0x50, 0xf4, 0x91, 0xef, 0x98, 0x7a, 0x33, 0x54, 0x0b, 0x43, 0xed, 0xcf, 0xac, 0x62,
    0xe4, 0xb3, 0x1c, 0xa9, 0xc9, 0x08, 0xe8, 0x95, 0x80, 0xdf, 0x94, 0xfa, 0x75, 0x8f, 0x3f, 0xa6,
    0x47, 0x07, 0xa7, 0xfc, 0xf3, 0x73, 0x17, 0xba, 0x83, 0x59, 0x3c, 0x19, 0xe6, 0x85, 0x4f, 0xa8,
    0x68, 0x6b, 0x81, 0xb2, 0x71, 0x64, 0xda, 0x8b, 0xf8, 0xeb, 0x0f, 0x4b, 0x70, 0x56, 0x9d, 0x35,
    0x1e, 0x24, 0x0e, 0x5e, 0x63, 0x58, 0xd1, 0xa2, 0x25, 0x22, 0x7c, 0x3b, 0x01, 0x21, 0x78, 0x87,
    0xd4, 0x00, 0x46, 0x57, 0x9f, 0xd3, 0x27, 0x52, 0x4c, 0x36, 0x02, 0xe7, 0xa0, 0xc4, 0xc8, 0x9e,
    0xea, 0xbf, 0x8a, 0xd2, 0x40, 0xc7, 0x38, 0xb5, 0xa3, 0xf7, 0xf2, 0xce, 0xf9, 0x61, 0x15, 0xa1,
    0xe0, 0xae, 0x5d, 0xa4, 0x9b, 0x34, 0x1a, 0x55, 0xad, 0x93, 0x32, 0x30, 0xf5, 0x8c, 0xb1, 0xe3,
    0x1d, 0xf6, 0xe2, 0x2e, 0x82, 0x66, 0xca, 0x60, 0xc0, 0x29, 0x23, 0xab, 0x0d, 0x53, 0x4e, 0x6f,
    0xd5, 0xdb, 0x37, 0x45, 0xde, 0xfd, 0x8e, 0x2f, 0x03, 0xff, 0x6a, 0x72, 0x6d, 0x6c, 0x5b, 0x51,
    0x8d, 0x1b, 0xaf, 0x92, 0xbb, 0xdd, 0xbc, 0x7f, 0x11, 0xd9, 0x5c, 0x41, 0x1f, 0x10, 0x5a, 0xd8,
    0x0a, 0xc1, 0x31, 0x88, 0xa5, 0xcd, 0x7b, 0xbd, 0x2d, 0x74, 0xd0, 0x12, 0xb8, 0xe5, 0xb4, 0xb0,
    0x89, 0x69, 0x97, 0x4a, 0x0c, 0x96, 0x77, 0x7e, 0x65, 0xb9, 0xf1, 0x09, 0xc5, 0x6e, 0xc6, 0x84,
    0x18, 0xf0, 0x7d, 0xec, 0x3a, 0xdc, 0x4d, 0x20, 0x79, 0xee, 0x5f, 0x3e, 0xd7, 0xcb, 0x39, 0x48,
];

const SM4_FK: [u32; 4] = [0xa3b1bac6, 0x56aa3350, 0x677d9197, 0xb27022dc];

const SM4_CK: [u32; 32] = [
    0x00070e15, 0x1c232a31, 0x383f464d, 0x545b6269, 0x70777e85, 0x8c939aa1, 0xa8afb6bd, 0xc4cbd2d9,
    0xe0e7eef5, 0xfc030a11, 0x181f262d, 0x343b4249, 0x50575e65, 0x6c737a81, 0x888f969d, 0xa4abb2b9,
    0xc0c7ced5, 0xdce3eaf1, 0xf8ff060d, 0x141b2229, 0x30373e45, 0x4c535a61, 0x686f767d, 0x848b9299,
    0xa0a7aeb5, 0xbcc3cad1, 0xd8dfe6ed, 0xf4fb0209, 0x10171e25, 0x2c333a41, 0x484f565d, 0x646b7279,
];

fn round_key(ka: u32) -> u32 {
    let mut b: [u8; 4] = [0, 0, 0, 0];
    let a = ka.to_be_bytes();
    b[0] = SM4_BOXES_TABLE[a[0] as usize];
    b[1] = SM4_BOXES_TABLE[a[1] as usize];
    b[2] = SM4_BOXES_TABLE[a[2] as usize];
    b[3] = SM4_BOXES_TABLE[a[3] as usize];
    let bb = u32::from_be_bytes(b);
    let rk = bb ^ (bb.rotate_left(13)) ^ (bb.rotate_left(23));
    rk
}

fn sm4_l_t(ka: u32) -> u32 {
    let mut b: [u8; 4] = [0, 0, 0, 0];
    let a = ka.to_be_bytes();
    b[0] = SM4_BOXES_TABLE[a[0] as usize];
    b[1] = SM4_BOXES_TABLE[a[1] as usize];
    b[2] = SM4_BOXES_TABLE[a[2] as usize];
    b[3] = SM4_BOXES_TABLE[a[3] as usize];
    let bb = u32::from_be_bytes(b);
    bb ^ (bb.rotate_left(2)) ^ (bb.rotate_left(10)) ^ (bb.rotate_left(18)) ^ (bb.rotate_left(24))
}

fn f(x0: u32, x1: u32, x2: u32, x3: u32, rk: u32) -> u32 {
    x0 ^ sm4_l_t(x1 ^ x2 ^ x3 ^ rk)
}

fn xor(a: &Vec<u8>, b: &Vec<u8>) -> Vec<u8> {
    assert_eq!(a.len(), b.len());
    (0..a.len()).map(|i| a[i] ^ b[i]).collect()
}

fn padding(data: Vec<u8>) -> Vec<u8> {
    let mut result: Vec<u8> = data.clone();
    let mut append: Vec<u8> = vec![(16 - &data.len() % 16) as u8; 16 - &data.len() % 16];
    result.append(&mut append);
    result
}

fn unpadding(data: Vec<u8>) -> Vec<u8> {
    data[0..(data.len() - data[data.len() - 1] as usize)].to_vec()
}

#[derive(PartialEq)]
enum Mode {
    Sm4Encrypt,
    Sm4Decrypt,
}

fn set_key(key: &[u8], mode: Mode) -> Vec<u32> {
    let mut sk: Vec<u32> = vec![0; 32];
    let mut mk: Vec<u32> = vec![0, 0, 0, 0];
    let mut k: Vec<u32> = vec![0; 36];
    mk[0] = u32::from_be_bytes([key[0], key[1], key[2], key[3]]);
    mk[1] = u32::from_be_bytes([key[4], key[5], key[6], key[7]]);
    mk[2] = u32::from_be_bytes([key[8], key[9], key[10], key[11]]);
    mk[3] = u32::from_be_bytes([key[12], key[13], key[14], key[15]]);
    let temp: Vec<u32> = (0..4).map(|i| mk[i] ^ SM4_FK[i]).collect();
    k[0..4].clone_from_slice(&temp);
    for i in 0..32 {
        k[i + 4] = k[i] ^ (round_key(k[i + 1] ^ k[i + 2] ^ k[i + 3] ^ SM4_CK[i]));
        sk[i] = k[i + 4];
    }
    if mode == Mode::Sm4Decrypt {
        for idx in 0..16 {
            let t = sk[idx];
            sk[idx] = sk[31 - idx];
            sk[31 - idx] = t;
        }
    }
    sk
}

fn one_round(sk: Vec<u32>, in_put: Vec<u8>) -> Vec<u8> {
    let mut out_put = vec![];
    let mut ulbuf = vec![0; 36];
    ulbuf[0] = u32::from_be_bytes([in_put[0], in_put[1], in_put[2], in_put[3]]);
    ulbuf[1] = u32::from_be_bytes([in_put[4], in_put[5], in_put[6], in_put[7]]);
    ulbuf[2] = u32::from_be_bytes([in_put[8], in_put[9], in_put[10], in_put[11]]);
    ulbuf[3] = u32::from_be_bytes([in_put[12], in_put[13], in_put[14], in_put[15]]);
    for idx in 0..32 {
        ulbuf[idx + 4] = f(
            ulbuf[idx],
            ulbuf[idx + 1],
            ulbuf[idx + 2],
            ulbuf[idx + 3],
            sk[idx],
        );
    }
    out_put.append(&mut ulbuf[35].to_be_bytes().to_vec());
    out_put.append(&mut ulbuf[34].to_be_bytes().to_vec());
    out_put.append(&mut ulbuf[33].to_be_bytes().to_vec());
    out_put.append(&mut ulbuf[32].to_be_bytes().to_vec());
    out_put
}

pub fn encrypt_ctr(input_data: &[u8], key: &[u8], iv: &[u8], pkcs7: bool) -> Vec<u8> {
    let sk = set_key(key, Mode::Sm4Encrypt);
    let mut counter_block = [0u8; 16];
    counter_block[..iv.len()].copy_from_slice(iv);
    let input_data = if pkcs7 {
        padding(input_data.to_vec())
    } else {
        input_data.to_vec()
    };
    let mut ciphertext = vec![0u8; input_data.len()];
    let block_size = 16;

    for (i, chunk) in input_data.chunks(block_size).enumerate() {
        let block_offset = i * block_size;

        // Encrypt the counter block to produce the keystream block
        let mut keystream_block = counter_block.to_vec();
        // sm4.encrypt_block(&mut keystream_block.into());
        keystream_block = one_round(sk.to_owned(), keystream_block);

        // XOR the plaintext with the keystream block to produce the ciphertext
        for j in 0..chunk.len() {
            ciphertext[block_offset + j] = chunk[j] ^ keystream_block[j];
        }

        // Increment the counter
        for k in (0..16).rev() {
            if counter_block[k] == 255 {
                counter_block[k] = 0;
            } else {
                counter_block[k] += 1;
                break;
            }
        }
    }

    ciphertext
}

pub fn encrypt_gcm(input_data: &[u8], key: &[u8], nonce: &[u8], aad: &[u8]) -> (Vec<u8>, Vec<u8>) {
    let sk = set_key(key, Mode::Sm4Encrypt);

    // Create GHASH instance
    let mut ghash_key: Array<u8, U16> = ghash::Key::default();
    let slice = one_round(sk.to_owned(), ghash_key.to_vec());
    ghash_key = Array::<u8, U16>::try_from_iter(slice).expect("slice with incorrect length");

    let mut ghash: GHash = GHash::new(&ghash_key);


    // Generate initial counter block (J0)
    let j0 = if nonce.len() == 12 {
        let mut block = ghash::Block::default();
        block[..12].copy_from_slice(nonce);
        block[15] = 1;
        block
    } else {
        let mut ghash = ghash.clone();
        ghash.update_padded(nonce);

        let mut block = ghash::Block::default();
        let nonce_bits = (nonce.len() as u64) * 8;
        block[8..].copy_from_slice(&nonce_bits.to_be_bytes());
        ghash.update(&[block]);
        ghash.finalize()
    };
    let mut ciphertext = vec![0u8; input_data.len()];
    let block_size = 16;
    let mut counter_block = j0.clone();

    // Compute GHASH for AAD
    ghash.update_padded(aad);
    for (i, chunk) in input_data.chunks(block_size).enumerate() {

        // Increment the counter
        for k in (0..16).rev() {
            if counter_block[k] == 255 {
                counter_block[k] = 0;
            } else {
                counter_block[k] += 1;
                break;
            }
        }
        let block_offset = i * block_size;

        // Encrypt the counter block to produce the keystream block
        let keystream_block = one_round(sk.to_owned(), counter_block.to_vec());

        // XOR the plaintext with the keystream block to produce the ciphertext
        for j in 0..chunk.len() {
            ciphertext[block_offset + j] = chunk[j] ^ keystream_block[j];
        }

        ghash.update_padded(&ciphertext[block_offset..(block_offset + chunk.len())]);
    }


    // Compute GHASH for length block
    let mut length_block = [0u8; 16];
    let aad_len_bits = (aad.len() as u64) * 8;
    let cipher_len_bits = (ciphertext.len() as u64) * 8;
    length_block[..8].copy_from_slice(&aad_len_bits.to_be_bytes());
    length_block[8..].copy_from_slice(&cipher_len_bits.to_be_bytes());
    ghash.update_padded(&length_block);

    // Final GHASH to produce the authentication tag
    let auth_tag = ghash.finalize().to_vec();
    // Encrypt the authentication tag
    let ctr_tag = encrypt_ctr(&auth_tag, key, &j0, false);

    (ciphertext, ctr_tag)
}

pub fn decrypt_gcm(input_data: &[u8], key: &[u8], nonce: &[u8], aad: &[u8], tag: &[u8]) -> Result<Vec<u8>, &'static str> {
    let sk = set_key(key, Mode::Sm4Encrypt);

    // Create GHASH instance
    let mut ghash_key: Array<u8, U16> = ghash::Key::default();
    let slice = one_round(sk.to_owned(), ghash_key.to_vec());
    ghash_key = Array::<u8, U16>::try_from_iter(slice).expect("slice with incorrect length");

    let mut ghash: GHash = GHash::new(&ghash_key);

    // Generate initial counter block (J0)
    let j0 = if nonce.len() == 12 {
        let mut block = ghash::Block::default();
        block[..12].copy_from_slice(nonce);
        block[15] = 1;
        block
    } else {
        let mut ghash = ghash.clone();
        ghash.update_padded(nonce);

        let mut block = ghash::Block::default();
        let nonce_bits = (nonce.len() as u64) * 8;
        block[8..].copy_from_slice(&nonce_bits.to_be_bytes());
        ghash.update(&[block]);
        ghash.finalize()
    };
    let mut plaintext = vec![0u8; input_data.len()];
    let block_size = 16;
    let mut counter_block = j0.clone();

    // Compute GHASH for AAD
    if aad.len() > 0 {
        ghash.update_padded(aad);
    }
    for (i, chunk) in input_data.chunks(block_size).enumerate() {

        // Increment the counter
        for k in (0..16).rev() {
            if counter_block[k] == 255 {
                counter_block[k] = 0;
            } else {
                counter_block[k] += 1;
                break;
            }
        }
        let block_offset = i * block_size;

        // Encrypt the counter block to produce the keystream block
        let keystream_block = one_round(sk.to_owned(), counter_block.to_vec());

        // XOR the plaintext with the keystream block to produce the ciphertext
        for j in 0..chunk.len() {
            plaintext[block_offset + j] = chunk[j] ^ keystream_block[j];
        }

        ghash.update_padded(&input_data[block_offset..(block_offset + chunk.len())]);
    }

    // Compute GHASH for length block
    let mut length_block = [0u8; 16];
    let aad_len_bits = (aad.len() as u64) * 8;
    let cipher_len_bits = (plaintext.len() as u64) * 8;
    length_block[..8].copy_from_slice(&aad_len_bits.to_be_bytes());
    length_block[8..].copy_from_slice(&cipher_len_bits.to_be_bytes());
    ghash.update_padded(&length_block);

    // Final GHASH to produce the authentication tag
    let auth_tag = ghash.finalize().to_vec();
    // Encrypt the authentication tag
    let ctr_tag = encrypt_ctr(&auth_tag, key, &j0, false);

    if ctr_tag != tag {
        return Err("Invalid authentication tag");
    }

    Ok(plaintext)
}

fn encrypt_ecb(input_data: &[u8], key: &[u8], pkcs7: bool) -> Vec<u8> {
    let sk = set_key(key, Mode::Sm4Encrypt);
    let input_data = if pkcs7 {
        padding(input_data.to_vec())
    } else {
        input_data.to_vec()
    };

    let mut length = input_data.len();
    let mut i = 0;
    let mut output_data: Vec<u8> = vec![];
    while length > 0 {
        output_data.append(&mut one_round(
            sk.to_owned(),
            input_data[i..(i + 16)].to_vec(),
        ));
        i += 16;
        length -= 16;
    }
    output_data
}

fn decrypt_ecb(input_data: &[u8], key: &[u8], pkcs7: bool) -> Vec<u8> {
    let sk = set_key(key, Mode::Sm4Decrypt);
    let mut length = input_data.len();
    let mut i = 0;
    let mut output_data: Vec<u8> = vec![];
    while length > 0 {
        output_data.append(&mut one_round(
            sk.to_owned(),
            input_data[i..(i + 16)].to_vec(),
        ));
        i += 16;
        length -= 16;
    }
    if pkcs7 {
        return unpadding(output_data);
    } else {
        return output_data;
    }
}

pub fn encrypt_cbc(input_data: &[u8], key: &[u8], iv: &[u8], pkcs7: bool) -> Vec<u8> {
    let sk = set_key(key, Mode::Sm4Encrypt);
    let mut i = 0;
    let mut output_data: Vec<u8> = vec![];
    let mut tmp_input: Vec<u8>;
    let mut iv = iv.to_vec();
    let input_data = if pkcs7 {
        padding(input_data.to_vec())
    } else {
        input_data.to_vec()
    };
    let mut length = input_data.len();
    while length > 0 {
        tmp_input = xor(&input_data[i..(i + 16)].to_vec(), &iv[0..16].to_vec());
        output_data.append(&mut one_round(sk.to_owned(), tmp_input[0..16].to_vec()));
        iv = output_data[i..(i + 16)].to_vec();
        i += 16;
        length -= 16;
    }
    output_data
}

pub fn decrypt_cbc(input_data: &[u8], key: &[u8], iv: &[u8], pkcs7: bool) -> Vec<u8> {
    let sk = set_key(key, Mode::Sm4Decrypt);
    let mut i = 0;
    let mut output_data: Vec<u8> = vec![];
    let mut iv = iv.to_vec();
    let mut length = input_data.len();
    while length > 0 {
        output_data.append(&mut one_round(
            sk.to_owned(),
            input_data[i..(i + 16)].to_vec(),
        ));
        let tmp_copy = xor(&output_data[i..(i + 16)].to_vec(), &iv[0..16].to_vec());
        let (_left1, right1) = output_data.split_at_mut(i);
        let (left2, _right2) = right1.split_at_mut(16);
        left2.copy_from_slice(&tmp_copy);
        iv = input_data[i..(i + 16)].to_vec();
        i += 16;
        length -= 16
    }
    if pkcs7 {
        return unpadding(output_data);
    } else {
        return output_data;
    }
}

pub struct CryptSM4ECB<'a> {
    pub key: &'a [u8],
}

impl<'a> CryptSM4ECB<'a> {
    pub fn new(key: &'a [u8]) -> Self {
        CryptSM4ECB { key: key }
    }

    pub fn encrypt_ecb(&self, input_data: &[u8], pkcs7: bool) -> Vec<u8> {
        encrypt_ecb(input_data, self.key, pkcs7)
    }

    pub fn decrypt_ecb(&self, input_data: &[u8], pkcs7: bool) -> Vec<u8> {
        decrypt_ecb(input_data, self.key, pkcs7)
    }
}

pub struct CryptSM4CBC<'a> {
    pub key: &'a [u8],
    pub iv: &'a [u8],
}

impl<'a> CryptSM4CBC<'a> {
    pub fn new(key: &'a [u8], iv: &'a [u8]) -> Self {
        CryptSM4CBC { key: key, iv: iv }
    }

    pub fn encrypt_cbc(&self, input_data: &[u8], pkcs7: bool) -> Vec<u8> {
        encrypt_cbc(input_data, self.key, self.iv, pkcs7)
    }

    pub fn decrypt_cbc(&self, input_data: &[u8], pkcs7: bool) -> Vec<u8> {
        decrypt_cbc(input_data, self.key, self.iv, pkcs7)
    }
}
