"use strict";let o=null;function u(){const r="sm-crypto/workers/sm-crypto.js";return new Promise((s,n)=>{try{o=wx.createWorker(r,{useExperimentalWorker:!0}),o.onMessage(({id:e,event:t})=>{e===-1&&t==="ready"&&(console.log("[sm-crypto] worker ready"),s())}),o.onProcessKilled(console.log)}catch(e){console.warn(e),n(e)}})}let p=0;function c(r,s){return new Promise((n,e)=>{const t=p++,i=Date.now();o.postMessage({id:t,method:r,args:s}),o.onMessage(({id:l,result:a})=>{if(l===t){const m=Date.now();console.log(`[sm-crypto] perf: ${r} took ${m-i}ms`),n(a)}})})}function w(){return c("sm3",[6666])}function y(){return c("sm2_encrypt",[6666])}module.exports={initSMCrypto:u,sm3:w,sm2:y};
