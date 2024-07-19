"use strict";function s(r){const t=[];for(let e=0;e<r.length;e+=2)t.push(parseInt(r.substr(e,2),16));return new Uint8Array(t)}function f(r){return Array.prototype.map.call(r,t=>("00"+t.toString(16)).slice(-2)).join("")}let i=null;function w(){const r="sm-crypto/workers/sm-crypto.js";return console.log("init smcrypto worker"),new Promise((t,e)=>{var a;try{i=my.createWorker(r,{useExperimentalWorker:!0}),i.onMessage(({id:c,event:u,message:d})=>{c===-1&&u==="ready"&&(console.log("[sm-crypto] worker ready"),t()),c===-1&&u==="log"&&console.log(d)}),(a=i.onProcessKilled)==null||a.call(i,c=>{console.warn("[sm-crypto] worker process killed",c)})}catch(c){console.warn(c),i.terminate(),e(c)}})}let b=0;function n(r){return(...t)=>new Promise((e,a)=>{const c=b++,u=Date.now();let d={};const g=t.length;d.len=t.length,d.method=r,d.id=c;for(let l=0;l<g;l++){let y=t[l];y instanceof Uint8Array?d[l]=Array.from(y):d[l]=y}console.log(`[sm-crypto] call method: ${r}, id: ${c}`);let o=setTimeout(()=>{a(new Error(`timeout for id: ${c}`))},1e3);i.onMessage(l=>{let{id:y,event:_,message:v,result:m,type:I}=l;if(y===-1&&_==="log"&&console.log(v),y===c){clearTimeout(o);const h=Date.now();console.log(`[sm-crypto] perf: ${r} took ${h-u}ms, id: ${c}`),Array.isArray(m)&&(m=new Uint8Array(m)),e(m)}}),i.postMessage(d)})}const p=n("sm2_generate_keypair"),k=n("compress_public_key_hex"),x=n("sm2_encrypt"),M=n("sm2_decrypt"),j=n("sm2_sign"),A=n("sm2_verify"),P=n("init_rng_pool"),O=n("sm3"),T=n("sm3_hmac"),$=n("sm4_encrypt"),S=n("sm4_decrypt"),H={initSMCrypto:w,sm2:{generateKeyPairHex:p,compressPublicKeyHex:k,async encrypt(r,t,e){e=Object.assign({cipherMode:1,asn1:!1,output:"array"},e),r=typeof r=="string"?s(r):r;const a=await x(t,r,{asn1:e.asn1,c1c2c3:e.cipherMode===0});return e.output==="string"?f(a):a},async decrypt(r,t,e){e=Object.assign({cipherMode:1,asn1:!1,output:"array"},e),r=typeof r=="string"?s(r):r;const a=await M(t,r,{asn1:e.asn1,c1c2c3:e.cipherMode===0});return e.output==="string"?f(a):a},doSignature(r,t,e){return r=typeof r=="string"?s(r):r,e=Object.assign({hash:!0,der:!0},e),j(t,r,e)},doVerifySignature(r,t,e,a){return r=typeof r=="string"?s(r):r,a=Object.assign({hash:!0,der:!0},a),A(t,r,e,a)},initRNGPool:P},sm3(r,t){r=typeof r=="string"?s(r):r;let e=t!=null&&t.key?typeof(t==null?void 0:t.key)=="string"?s(t.key):t.key:void 0;return e?T(e,r):O(r)},sm4:{async encrypt(r,t,e){e=Object.assign({mode:"cbc",padding:"pkcs7",output:"array"},e),e.iv=e.iv?typeof e.iv=="string"?s(e.iv):e.iv:void 0,e.aad=e.aad?typeof e.aad=="string"?s(e.aad):e.aad:void 0,t=typeof t=="string"?s(t):t;const a=await $(r,t,{mode:e.mode,padding:e.padding,iv:e.iv,aad:e.aad});return e.output==="string"?f(a):a},async decrypt(r,t,e){e=Object.assign({mode:"cbc",padding:"pkcs7",output:"array"},e),e.iv=e.iv?typeof e.iv=="string"?s(e.iv):e.iv:void 0,e.aad=e.aad?typeof e.aad=="string"?s(e.aad):e.aad:void 0,t=typeof t=="string"?s(t):t;const a=await S(r,t,{mode:e.mode,padding:e.padding,iv:e.iv,aad:e.aad});return e.output==="string"?f(a):a}}};module.exports=H;
