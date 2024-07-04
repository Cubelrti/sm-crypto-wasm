"use strict";function w(e,n,t){return n<=e&&e<=t}function H(e,n){return e.indexOf(n)!==-1}function S(e){if(e===void 0)return{};if(e===Object(e))return e;throw TypeError("Could not convert argument to dictionary")}function J(e){for(var n=String(e),t=n.length,r=0,o=[];r<t;){var i=n.charCodeAt(r);if(i<55296||i>57343)o.push(i);else if(56320<=i&&i<=57343)o.push(65533);else if(55296<=i&&i<=56319)if(r===t-1)o.push(65533);else{var f=n.charCodeAt(r+1);if(56320<=f&&f<=57343){var _=i&1023,s=f&1023;o.push(65536+(_<<10)+s),r+=1}else o.push(65533)}r+=1}return o}function K(e){for(var n="",t=0;t<e.length;++t){var r=e[t];r<=65535?n+=String.fromCharCode(r):(r-=65536,n+=String.fromCharCode((r>>10)+55296,(r&1023)+56320))}return n}function Q(e){return 0<=e&&e<=127}var Y=Q,m=-1;function U(e){this.tokens=[].slice.call(e),this.tokens.reverse()}U.prototype={endOfStream:function(){return!this.tokens.length},read:function(){return this.tokens.length?this.tokens.pop():m},prepend:function(e){if(Array.isArray(e))for(var n=e;n.length;)this.tokens.push(n.pop());else this.tokens.push(e)},push:function(e){if(Array.isArray(e))for(var n=e;n.length;)this.tokens.unshift(n.shift());else this.tokens.unshift(e)}};var x=-1;function j(e,n){if(e)throw TypeError("Decoder error");return n||65533}function B(e){return e=String(e).trim().toLowerCase(),Object.prototype.hasOwnProperty.call(C,e)?C[e]:null}var Z=[{encodings:[{labels:["unicode-1-1-utf-8","utf-8","utf8"],name:"UTF-8"}],heading:"The Encoding"}],C={};Z.forEach(function(e){e.encodings.forEach(function(n){n.labels.forEach(function(t){C[t]=n})})});var W={},D={},L="utf-8";function d(e,n){if(!(this instanceof d))throw TypeError("Called as a function. Did you forget 'new'?");e=e!==void 0?String(e):L,n=S(n),this._encoding=null,this._decoder=null,this._ignoreBOM=!1,this._BOMseen=!1,this._error_mode="replacement",this._do_not_flush=!1;var t=B(e);if(t===null||t.name==="replacement")throw RangeError("Unknown encoding: "+e);if(!D[t.name])throw Error("Decoder not present. Did you forget to include encoding-indexes.js first?");var r=this;return r._encoding=t,n.fatal&&(r._error_mode="fatal"),n.ignoreBOM&&(r._ignoreBOM=!0),Object.defineProperty||(this.encoding=r._encoding.name.toLowerCase(),this.fatal=r._error_mode==="fatal",this.ignoreBOM=r._ignoreBOM),r}Object.defineProperty&&(Object.defineProperty(d.prototype,"encoding",{get:function(){return this._encoding.name.toLowerCase()}}),Object.defineProperty(d.prototype,"fatal",{get:function(){return this._error_mode==="fatal"}}),Object.defineProperty(d.prototype,"ignoreBOM",{get:function(){return this._ignoreBOM}}));d.prototype.decode=function(n,t){var r;typeof n=="object"&&n instanceof ArrayBuffer?r=new Uint8Array(n):typeof n=="object"&&"buffer"in n&&n.buffer instanceof ArrayBuffer?r=new Uint8Array(n.buffer,n.byteOffset,n.byteLength):r=new Uint8Array(0),t=S(t),this._do_not_flush||(this._decoder=D[this._encoding.name]({fatal:this._error_mode==="fatal"}),this._BOMseen=!1),this._do_not_flush=!!t.stream;for(var o=new U(r),i=[],f;;){var _=o.read();if(_===m||(f=this._decoder.handler(o,_),f===x))break;f!==null&&(Array.isArray(f)?i.push.apply(i,f):i.push(f))}if(!this._do_not_flush){do{if(f=this._decoder.handler(o,o.read()),f===x)break;f!==null&&(Array.isArray(f)?i.push.apply(i,f):i.push(f))}while(!o.endOfStream());this._decoder=null}function s(l){return H(["UTF-8","UTF-16LE","UTF-16BE"],this._encoding.name)&&!this._ignoreBOM&&!this._BOMseen&&(l.length>0&&l[0]===65279?(this._BOMseen=!0,l.shift()):l.length>0&&(this._BOMseen=!0)),K(l)}return s.call(this,i)};function b(e,n){if(!(this instanceof b))throw TypeError("Called as a function. Did you forget 'new'?");n=S(n),this._encoding=null,this._encoder=null,this._do_not_flush=!1,this._fatal=n.fatal?"fatal":"replacement";var t=this;if(n.NONSTANDARD_allowLegacyEncoding){e=e!==void 0?String(e):L;var r=B(e);if(r===null||r.name==="replacement")throw RangeError("Unknown encoding: "+e);if(!W[r.name])throw Error("Encoder not present. Did you forget to include encoding-indexes.js first?");t._encoding=r}else t._encoding=B("utf-8");return Object.defineProperty||(this.encoding=t._encoding.name.toLowerCase()),t}Object.defineProperty&&Object.defineProperty(b.prototype,"encoding",{get:function(){return this._encoding.name.toLowerCase()}});b.prototype.encode=function(n,t){n=n===void 0?"":String(n),t=S(t),this._do_not_flush||(this._encoder=W[this._encoding.name]({fatal:this._fatal==="fatal"})),this._do_not_flush=!!t.stream;for(var r=new U(J(n)),o=[],i;;){var f=r.read();if(f===m||(i=this._encoder.handler(r,f),i===x))break;Array.isArray(i)?o.push.apply(o,i):o.push(i)}if(!this._do_not_flush){for(;i=this._encoder.handler(r,r.read()),i!==x;)Array.isArray(i)?o.push.apply(o,i):o.push(i);this._encoder=null}return new Uint8Array(o)};function $(e){var n=e.fatal,t=0,r=0,o=0,i=128,f=191;this.handler=function(_,s){if(s===m&&o!==0)return o=0,j(n);if(s===m)return x;if(o===0){if(w(s,0,127))return s;if(w(s,194,223))o=1,t=s&31;else if(w(s,224,239))s===224&&(i=160),s===237&&(f=159),o=2,t=s&15;else if(w(s,240,244))s===240&&(i=144),s===244&&(f=143),o=3,t=s&7;else return j(n);return null}if(!w(s,i,f))return t=o=r=0,i=128,f=191,_.prepend(s),j(n);if(i=128,f=191,t=t<<6|s&63,r+=1,r!==o)return null;var l=t;return t=o=r=0,l}}function ee(e){e.fatal,this.handler=function(n,t){if(t===m)return x;if(Y(t))return t;var r,o;w(t,128,2047)?(r=1,o=192):w(t,2048,65535)?(r=2,o=224):w(t,65536,1114111)&&(r=3,o=240);for(var i=[(t>>6*r)+o];r>0;){var f=t>>6*(r-1);i.push(128|f&63),r-=1}return i}}W["UTF-8"]=function(e){return new ee(e)};D["UTF-8"]=function(e){return new $(e)};var v=v||globalThis||{};v.TextEncoder=typeof b>"u"?b:v.TextEncoder;v.TextDecoder=typeof d>"u"?d:v.TextDecoder;let c;const h=new Array(128).fill(void 0);h.push(void 0,null,!0,!1);function a(e){return h[e]}let E=h.length;function ne(e){e<132||(h[e]=E,E=e)}function I(e){const n=a(e);return ne(e),n}const R=typeof d<"u"?new d("utf-8",{ignoreBOM:!0,fatal:!0}):{decode:()=>{throw Error("TextDecoder not available")}};typeof d<"u"&&R.decode();let O=null;function k(){return(O===null||O.byteLength===0)&&(O=new Uint8Array(c.memory.buffer)),O}function y(e,n){return e=e>>>0,R.decode(k().subarray(e,e+n))}function u(e){E===h.length&&h.push(h.length+1);const n=E;return E=h[n],h[n]=e,n}let T=null;function A(){return(T===null||T.byteLength===0)&&(T=new Int32Array(c.memory.buffer)),T}function te(){let e,n;try{const o=c.__wbindgen_add_to_stack_pointer(-16);c.sm3(o);var t=A()[o/4+0],r=A()[o/4+1];return e=t,n=r,y(t,r)}finally{c.__wbindgen_add_to_stack_pointer(16),c.__wbindgen_free(e,n,1)}}function re(){let e,n;try{const o=c.__wbindgen_add_to_stack_pointer(-16);c.sm2_encrypt(o);var t=A()[o/4+0],r=A()[o/4+1];return e=t,n=r,y(t,r)}finally{c.__wbindgen_add_to_stack_pointer(16),c.__wbindgen_free(e,n,1)}}let p=0;const M=typeof b<"u"?new b("utf-8"):{encode:()=>{throw Error("TextEncoder not available")}},oe=typeof M.encodeInto=="function"?function(e,n){return M.encodeInto(e,n)}:function(e,n){const t=M.encode(e);return n.set(t),{read:e.length,written:t.length}};function ie(e,n,t){if(t===void 0){const _=M.encode(e),s=n(_.length,1)>>>0;return k().subarray(s,s+_.length).set(_),p=_.length,s}let r=e.length,o=n(r,1)>>>0;const i=k();let f=0;for(;f<r;f++){const _=e.charCodeAt(f);if(_>127)break;i[o+f]=_}if(f!==r){f!==0&&(e=e.slice(f)),o=t(o,r,r=f+e.length*3,1)>>>0;const _=k().subarray(o+f,o+r),s=oe(e,_);f+=s.written,o=t(o,r,f,1)>>>0}return p=f,o}function P(e,n){const t=n(e.length*1,1)>>>0;return k().set(e,t/1),p=e.length,t}function fe(e,n,t){let r,o;try{const _=c.__wbindgen_add_to_stack_pointer(-16),s=ie(e,c.__wbindgen_malloc,c.__wbindgen_realloc),l=p,V=P(n,c.__wbindgen_malloc),z=p,q=P(t,c.__wbindgen_malloc),G=p;c.sm4_encrypt(_,s,l,V,z,q,G);var i=A()[_/4+0],f=A()[_/4+1];return r=i,o=f,y(i,f)}finally{c.__wbindgen_add_to_stack_pointer(16),c.__wbindgen_free(r,o,1)}}function se(){c.main_js()}function g(e,n){try{return e.apply(this,n)}catch(t){c.__wbindgen_exn_store(u(t))}}async function ce(e,n){if(typeof Response=="function"&&e instanceof Response){if(typeof WXWebAssembly.instantiateStreaming=="function")try{return await WXWebAssembly.instantiateStreaming(e,n)}catch(r){if(e.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",r);else throw r}const t=await e.arrayBuffer();return await WXWebAssembly.instantiate(t,n)}else{const t=await WXWebAssembly.instantiate(e,n);return t instanceof WXWebAssembly.Instance?{instance:t,module:e}:t}}function X(){const e={};return e.wbg={},e.wbg.__wbindgen_object_drop_ref=function(n){I(n)},e.wbg.__wbindgen_string_new=function(n,t){const r=y(n,t);return u(r)},e.wbg.__wbg_log_5bb5f88f245d7762=function(n){console.log(a(n))},e.wbg.__wbindgen_is_object=function(n){const t=a(n);return typeof t=="object"&&t!==null},e.wbg.__wbindgen_object_clone_ref=function(n){const t=a(n);return u(t)},e.wbg.__wbg_crypto_1d1f22824a6a080c=function(n){return u({getRandomValues:function(r){for(let o=0,i=r.length;o<i;o++)r[o]=Math.floor(Math.random()*256);return r}})},e.wbg.__wbg_process_4a72847cc503995b=function(n){const t=a(n).process;return u(t)},e.wbg.__wbg_versions_f686565e586dd935=function(n){const t=a(n).versions;return u(t)},e.wbg.__wbg_node_104a2ff8d6ea03a2=function(n){const t=a(n).node;return u(t)},e.wbg.__wbindgen_is_string=function(n){return typeof a(n)=="string"},e.wbg.__wbg_require_cca90b1a94a0255b=function(){return g(function(){const n=module.require;return u(n)},arguments)},e.wbg.__wbindgen_is_function=function(n){return typeof a(n)=="function"},e.wbg.__wbg_call_b3ca7c6051f9bec1=function(){return g(function(n,t,r){const o=a(n).call(a(t),a(r));return u(o)},arguments)},e.wbg.__wbg_msCrypto_eb05e62b530a1508=function(n){const t=a(n).msCrypto;return u(t)},e.wbg.__wbg_newwithlength_e9b4878cebadb3d3=function(n){const t=new Uint8Array(n>>>0);return u(t)},e.wbg.__wbg_self_ce0dbfc45cf2f5be=function(){return g(function(){const n=self.self;return u(n)},arguments)},e.wbg.__wbg_window_c6fb939a7f436783=function(){return g(function(){const n=window.window;return u(n)},arguments)},e.wbg.__wbg_globalThis_d1e6af4856ba331b=function(){return g(function(){const n=globalThis.globalThis;return u(n)},arguments)},e.wbg.__wbg_global_207b558942527489=function(){return g(function(){const n=v.global;return u(n)},arguments)},e.wbg.__wbindgen_is_undefined=function(n){return a(n)===void 0},e.wbg.__wbg_newnoargs_e258087cd0daa0ea=function(n,t){const r=new Function(y(n,t));return u(r)},e.wbg.__wbg_call_27c0f87801dedf93=function(){return g(function(n,t){const r=a(n).call(a(t));return u(r)},arguments)},e.wbg.__wbindgen_memory=function(){const n=c.memory;return u(n)},e.wbg.__wbg_buffer_12d079cc21e14bdb=function(n){const t=a(n).buffer;return u(t)},e.wbg.__wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb=function(n,t,r){const o=new Uint8Array(a(n),t>>>0,r>>>0);return u(o)},e.wbg.__wbg_randomFillSync_5c9c955aa56b6049=function(){return g(function(n,t){a(n).randomFillSync(I(t))},arguments)},e.wbg.__wbg_subarray_a1f73cd4b5b42fe1=function(n,t,r){const o=a(n).subarray(t>>>0,r>>>0);return u(o)},e.wbg.__wbg_getRandomValues_3aa56aa6edec874c=function(){return g(function(n,t){a(n).getRandomValues(a(t))},arguments)},e.wbg.__wbg_new_63b92bc8671ed464=function(n){const t=new Uint8Array(a(n));return u(t)},e.wbg.__wbg_set_a47bac70306a19a7=function(n,t,r){a(n).set(a(t),r>>>0)},e.wbg.__wbindgen_throw=function(n,t){throw new Error(y(n,t))},e}function N(e,n){return c=e.exports,F.__wbindgen_wasm_module=n,T=null,O=null,c.__wbindgen_start(),c}function ae(e){if(c!==void 0)return c;const n=X();e instanceof WXWebAssembly.Module||(e=new WXWebAssembly.Module(e));const t=new WXWebAssembly.Instance(e,n);return N(t,e)}async function F(e){if(c!==void 0)return c;const n=X(),{instance:t,module:r}=await ce(await e,n);return N(t,r)}const ue=Object.freeze(Object.defineProperty({__proto__:null,default:F,initSync:ae,main_js:se,sm2_encrypt:re,sm3:te,sm4_encrypt:fe},Symbol.toStringTag,{value:"Module"}));console.log("worker-index: init wasm");worker.onMessage(function(e){console.log("received worker operation",e);const{method:n,args:t,id:r}=e;for(let i=0;i<t.length;i++)t[i]instanceof ArrayBuffer&&(t[i]=new Uint8Array(t[i]));const o=ue[n](...t);worker.postMessage({id:r,result:o})});F("sm-crypto/crypto.wasm").then(e=>{console.log("module loaded successfully",e),worker.postMessage({id:-1,event:"ready"})}).catch(e=>{console.error("failed to load module",e)});
