export interface SM2EncryptionOptions {
  cipherMode?: 1 | 0
  asn1?: boolean
  output?: 'array' | 'string'
}

export interface SM2SignatureOptions {
  hash?: boolean
  der?: boolean
  userId?: string
}

export interface SM2KeyPair {
  privateKey: string
  publicKey: string
}

export interface SM4EncryptionOptions {
  mode?: 'cbc' | 'ecb' | 'ctr' | 'gcm'
  padding?: 'pkcs7' | 'none'
  iv?: string | Uint8Array
  output?: 'array' | 'string'
}
