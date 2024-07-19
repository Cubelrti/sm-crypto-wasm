declare const _default: {
    initSMCrypto: typeof initSMCrypto;
    sm2: {
        generateKeyPairHex: () => Promise<any>;
        compressPublicKeyHex: (s: string) => Promise<string>;
        encrypt(msg: Uint8Array | string, publicKey: string, options: SM2EncryptionOptions): Promise<any>;
        decrypt(msg: Uint8Array | string, privateKey: string, options: SM2EncryptionOptions): Promise<any>;
        doSignature(msg: Uint8Array | string, privateKey: string, options: SM2SignatureOptions): Promise<string>;
        doVerifySignature(msg: Uint8Array | string, publicKey: string, signature: string, options: SM2SignatureOptions): Promise<boolean>;
        initRNGPool: (seed: Uint8Array) => Promise<void>;
    };
    sm3(input: string | Uint8Array, options?: {
        key?: string | Uint8Array;
    }): Promise<Uint8Array>;
    sm4: {
        encrypt(data: Uint8Array, key: Uint8Array | string, options: SM4EncryptionOptions): Promise<any>;
        decrypt(data: Uint8Array, key: Uint8Array | string, options: SM4EncryptionOptions): Promise<any>;
    };
};
export default _default;

declare function initSMCrypto(): Promise<void>;

declare interface SM2EncryptionOptions {
    cipherMode?: 1 | 0;
    asn1?: boolean;
    output?: 'array' | 'string';
}

declare interface SM2SignatureOptions {
    hash?: boolean;
    der?: boolean;
    userId?: string;
}

declare interface SM4EncryptionOptions {
    mode?: 'cbc' | 'ecb' | 'ctr' | 'gcm';
    padding?: 'pkcs7' | 'none';
    iv?: string | Uint8Array;
    output?: 'array' | 'string';
    aad?: string | Uint8Array;
}

export { }
