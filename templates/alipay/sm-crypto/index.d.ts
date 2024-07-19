declare const _default: {
    initSMCrypto: typeof initSMCrypto;
    sm2: {
        generateKeyPairHex: () => Promise<any>;
        compressPublicKeyHex: (s: string) => Promise<string>;
        encrypt(msg: Uint8Array, publicKey: string, options: SM2Options): Promise<string> | Promise<Uint8Array>;
        decrypt(msg: Uint8Array, privateKey: string, options: SM2Options): Promise<string> | Promise<Uint8Array>;
        initRNGPool: (seed: Uint8Array) => Promise<void>;
    };
    sm3: (input: Uint8Array) => Promise<Uint8Array>;
    hmac: (key: Uint8Array, msg: Uint8Array) => Promise<Uint8Array>;
    sm4: (input: Uint8Array, key: Uint8Array, iv: Uint8Array) => Promise<Uint8Array>;
};
export default _default;

declare function initSMCrypto(): Promise<void>;

declare interface SM2Options {
    cipherMode: 1 | 0;
    asn1: boolean;
    output: 'array' | 'string';
}

export { }
