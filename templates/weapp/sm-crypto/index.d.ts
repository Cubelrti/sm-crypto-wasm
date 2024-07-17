/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {InitInput | Promise<InitInput>} module_or_path
 *
 * @returns {Promise<InitOutput>}
 */
declare function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;

/**
 * @param {string} s
 * @returns {string}
 */
declare function compress_public_key_hex(s: string): string;

declare const _default: {
    initSMCrypto: typeof initSMCrypto;
    sm2: {
        generateKeyPairHex: typeof sm2_generate_keypair;
        compressPublicKeyHex: typeof compress_public_key_hex;
        encrypt(msg: Uint8Array | string, publicKey: string, options: SM2EncryptionOptions): any;
        decrypt(msg: Uint8Array | string, privateKey: string, options: SM2EncryptionOptions): any;
        doSignature(msg: Uint8Array | string, privateKey: string, options: SM2SignatureOptions): string;
        doVerifySignature(msg: Uint8Array | string, publicKey: string, signature: string, options: SM2SignatureOptions): boolean;
        initRNGPool: typeof init_rng_pool;
    };
    sm3(input: string | Uint8Array, options?: {
        key?: string | Uint8Array;
    }): Uint8Array;
    sm4: {
        encrypt(data: Uint8Array, key: Uint8Array | string, options: SM4EncryptionOptions): any;
        decrypt(data: Uint8Array, key: Uint8Array | string, options: SM4EncryptionOptions): any;
    };
};
export default _default;

/**
 * @param {Uint8Array} seed
 */
declare function init_rng_pool(seed: Uint8Array): void;

declare type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

declare interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly init_rng_pool: (a: number, b: number) => void;
    readonly sm3: (a: number, b: number, c: number) => void;
    readonly sm2_encrypt: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly sm2_decrypt: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly sm2_sign: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly sm2_verify: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
    readonly sm2_generate_keypair: () => number;
    readonly compress_public_key_hex: (a: number, b: number, c: number) => void;
    readonly sm3_hmac: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly sm4_encrypt: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly sm4_decrypt: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly main_js: () => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

declare function initSMCrypto(): Promise<void>;

export declare type Mod = typeof __wbg_init;

/**
 * @returns {any}
 */
declare function sm2_generate_keypair(): any;

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
