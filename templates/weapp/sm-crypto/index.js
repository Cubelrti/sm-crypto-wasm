"use strict";let e=null;function a(){const t="sm-crypto/workers/sm-crypto.js";return console.log("init smcrypto worker"),new Promise((r,n)=>{var c;try{e=wx.createWorker(t,{useExperimentalWorker:!0}),e.onMessage(({id:o,event:i})=>{o===-1&&i==="ready"&&(console.log("[sm-crypto] worker ready"),r())}),(c=e.onProcessKilled)==null||c.call(e,console.log)}catch(o){console.warn(o),e.terminate(),n(o)}})}let p=0;function l(t,...r){return new Promise((n,c)=>{const o=p++,i=Date.now();r=r.map(s=>s instanceof Uint8Array?s.buffer:s),e.postMessage({id:o,method:t,args:r}),e.onMessage(({id:s,result:m})=>{if(s===o){const u=Date.now();console.log(`[sm-crypto] perf: ${t} took ${u-i}ms`),n(m)}})})}function f(){return l("sm3")}function y(){return l("sm2_encrypt")}function w(t,r,n){return l("sm4_encrypt",t,r,n)}const d={initSMCrypto:a,sm2:y,sm3:f,sm4:w};module.exports=d;
