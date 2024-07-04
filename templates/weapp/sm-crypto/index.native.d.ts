declare function initSMCrypto(): Promise<void>;
declare function sm3(): Promise<string>;
declare function sm2(): Promise<string>;
declare function sm4(input: string, key: Uint8Array, iv: Uint8Array): Promise<string>;
declare const _default: {
    initSMCrypto: typeof initSMCrypto;
    sm2: typeof sm2;
    sm3: typeof sm3;
    sm4: typeof sm4;
};
export default _default;
