"use strict";let e=null;function a(){const r="sm-crypto/workers/sm-crypto.js";return console.log("init smcrypto worker"),new Promise((t,n)=>{var c;try{e=wx.createWorker(r,{useExperimentalWorker:!0}),e.onMessage(({id:o,event:i})=>{o===-1&&i==="ready"&&(console.log("[sm-crypto] worker ready"),t())}),(c=e.onProcessKilled)==null||c.call(e,console.log)}catch(o){console.warn(o),e.terminate(),n(o)}})}let p=0;function l(r,...t){return new Promise((n,c)=>{const o=p++,i=Date.now();t=t.map(s=>s instanceof Uint8Array?s.buffer:s),e.postMessage({id:o,method:r,args:t}),e.onMessage(({id:s,result:m})=>{if(s===o){const u=Date.now();console.log(`[sm-crypto] perf: ${r} took ${u-i}ms`),n(m)}})})}function f(){return l("sm3")}function y(){return l("sm2_encrypt")}function d(r,t,n){return l("sm4_encrypt",r,t,n)}const w={initSMCrypto:a,sm2:y,sm3:f,sm4:d};module.exports=w;
