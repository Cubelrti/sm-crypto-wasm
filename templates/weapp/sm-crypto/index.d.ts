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
        encrypt: typeof sm2_encrypt;
    };
    sm3: typeof sm3;
    sm4: typeof sm4_encrypt;
};
export default _default;

declare type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

declare interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly sm3: (a: number) => void;
    readonly sm2_encrypt: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly sm2_generate_keypair: () => number;
    readonly compress_public_key_hex: (a: number, b: number, c: number) => void;
    readonly sm4_encrypt: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
    readonly main_js: () => void;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

declare function initSMCrypto(): Promise<void>;

export declare type Mod = typeof __wbg_init;

/**
 * @param {string} pk
 * @param {Uint8Array} data
 * @returns {string}
 */
declare function sm2_encrypt(pk: string, data: Uint8Array): string;

/**
 * @returns {any}
 */
declare function sm2_generate_keypair(): any;

/**
 * @returns {string}
 */
declare function sm3(): string;

/**
 * @param {string} input
 * @param {Uint8Array} key
 * @param {Uint8Array} iv
 * @returns {string}
 */
declare function sm4_encrypt(input: string, key: Uint8Array, iv: Uint8Array): string;

export { }
