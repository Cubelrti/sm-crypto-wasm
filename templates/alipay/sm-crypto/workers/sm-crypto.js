"use strict";function x(e,n,t){return n<=e&&e<=t}function J(e,n){return e.indexOf(n)!==-1}function U(e){if(e===void 0)return{};if(e===Object(e))return e;throw TypeError("Could not convert argument to dictionary")}function H(e){for(var n=String(e),t=n.length,r=0,o=[];r<t;){var i=n.charCodeAt(r);if(i<55296||i>57343)o.push(i);else if(56320<=i&&i<=57343)o.push(65533);else if(55296<=i&&i<=56319)if(r===t-1)o.push(65533);else{var c=n.charCodeAt(r+1);if(56320<=c&&c<=57343){var a=i&1023,f=c&1023;o.push(65536+(a<<10)+f),r+=1}else o.push(65533)}r+=1}return o}function K(e){for(var n="",t=0;t<e.length;++t){var r=e[t];r<=65535?n+=String.fromCharCode(r):(r-=65536,n+=String.fromCharCode((r>>10)+55296,(r&1023)+56320))}return n}function Q(e){return 0<=e&&e<=127}var X=Q,D=-1;function R(e){this.tokens=[].slice.call(e),this.tokens.reverse()}R.prototype={endOfStream:function(){return!this.tokens.length},read:function(){return this.tokens.length?this.tokens.pop():D},prepend:function(e){if(Array.isArray(e))for(var n=e;n.length;)this.tokens.push(n.pop());else this.tokens.push(e)},push:function(e){if(Array.isArray(e))for(var n=e;n.length;)this.tokens.unshift(n.shift());else this.tokens.unshift(e)}};var S=-1;function F(e,n){if(e)throw TypeError("Decoder error");return n||65533}function P(e){return e=String(e).trim().toLowerCase(),Object.prototype.hasOwnProperty.call(N,e)?N[e]:null}var Z=[{encodings:[{labels:["unicode-1-1-utf-8","utf-8","utf8"],name:"UTF-8"}],heading:"The Encoding"}],N={};Z.forEach(function(e){e.encodings.forEach(function(n){n.labels.forEach(function(t){N[t]=n})})});var W={},$={},V="utf-8";function y(e,n){if(!(this instanceof y))throw TypeError("Called as a function. Did you forget 'new'?");e=e!==void 0?String(e):V,n=U(n),this._encoding=null,this._decoder=null,this._ignoreBOM=!1,this._BOMseen=!1,this._error_mode="replacement",this._do_not_flush=!1;var t=P(e);if(t===null||t.name==="replacement")throw RangeError("Unknown encoding: "+e);if(!$[t.name])throw Error("Decoder not present. Did you forget to include encoding-indexes.js first?");var r=this;return r._encoding=t,n.fatal&&(r._error_mode="fatal"),n.ignoreBOM&&(r._ignoreBOM=!0),Object.defineProperty||(this.encoding=r._encoding.name.toLowerCase(),this.fatal=r._error_mode==="fatal",this.ignoreBOM=r._ignoreBOM),r}Object.defineProperty&&(Object.defineProperty(y.prototype,"encoding",{get:function(){return this._encoding.name.toLowerCase()}}),Object.defineProperty(y.prototype,"fatal",{get:function(){return this._error_mode==="fatal"}}),Object.defineProperty(y.prototype,"ignoreBOM",{get:function(){return this._ignoreBOM}}));y.prototype.decode=function(n,t){var r;typeof n=="object"&&n instanceof ArrayBuffer?r=new Uint8Array(n):typeof n=="object"&&"buffer"in n&&n.buffer instanceof ArrayBuffer?r=new Uint8Array(n.buffer,n.byteOffset,n.byteLength):r=new Uint8Array(0),t=U(t),this._do_not_flush||(this._decoder=$[this._encoding.name]({fatal:this._error_mode==="fatal"}),this._BOMseen=!1),this._do_not_flush=!!t.stream;for(var o=new R(r),i=[],c;;){var a=o.read();if(a===D||(c=this._decoder.handler(o,a),c===S))break;c!==null&&(Array.isArray(c)?i.push.apply(i,c):i.push(c))}if(!this._do_not_flush){do{if(c=this._decoder.handler(o,o.read()),c===S)break;c!==null&&(Array.isArray(c)?i.push.apply(i,c):i.push(c))}while(!o.endOfStream());this._decoder=null}function f(l){return J(["UTF-8","UTF-16LE","UTF-16BE"],this._encoding.name)&&!this._ignoreBOM&&!this._BOMseen&&(l.length>0&&l[0]===65279?(this._BOMseen=!0,l.shift()):l.length>0&&(this._BOMseen=!0)),K(l)}return f.call(this,i)};function k(e,n){if(!(this instanceof k))throw TypeError("Called as a function. Did you forget 'new'?");n=U(n),this._encoding=null,this._encoder=null,this._do_not_flush=!1,this._fatal=n.fatal?"fatal":"replacement";var t=this;if(n.NONSTANDARD_allowLegacyEncoding){e=e!==void 0?String(e):V;var r=P(e);if(r===null||r.name==="replacement")throw RangeError("Unknown encoding: "+e);if(!W[r.name])throw Error("Encoder not present. Did you forget to include encoding-indexes.js first?");t._encoding=r}else t._encoding=P("utf-8");return Object.defineProperty||(this.encoding=t._encoding.name.toLowerCase()),t}Object.defineProperty&&Object.defineProperty(k.prototype,"encoding",{get:function(){return this._encoding.name.toLowerCase()}});k.prototype.encode=function(n,t){n=n===void 0?"":String(n),t=U(t),this._do_not_flush||(this._encoder=W[this._encoding.name]({fatal:this._fatal==="fatal"})),this._do_not_flush=!!t.stream;for(var r=new R(H(n)),o=[],i;;){var c=r.read();if(c===D||(i=this._encoder.handler(r,c),i===S))break;Array.isArray(i)?o.push.apply(o,i):o.push(i)}if(!this._do_not_flush){for(;i=this._encoder.handler(r,r.read()),i!==S;)Array.isArray(i)?o.push.apply(o,i):o.push(i);this._encoder=null}return new Uint8Array(o)};function ee(e){var n=e.fatal,t=0,r=0,o=0,i=128,c=191;this.handler=function(a,f){if(f===D&&o!==0)return o=0,F(n);if(f===D)return S;if(o===0){if(x(f,0,127))return f;if(x(f,194,223))o=1,t=f&31;else if(x(f,224,239))f===224&&(i=160),f===237&&(c=159),o=2,t=f&15;else if(x(f,240,244))f===240&&(i=144),f===244&&(c=143),o=3,t=f&7;else return F(n);return null}if(!x(f,i,c))return t=o=r=0,i=128,c=191,a.prepend(f),F(n);if(i=128,c=191,t=t<<6|f&63,r+=1,r!==o)return null;var l=t;return t=o=r=0,l}}function ne(e){e.fatal,this.handler=function(n,t){if(t===D)return S;if(X(t))return t;var r,o;x(t,128,2047)?(r=1,o=192):x(t,2048,65535)?(r=2,o=224):x(t,65536,1114111)&&(r=3,o=240);for(var i=[(t>>6*r)+o];r>0;){var c=t>>6*(r-1);i.push(128|c&63),r-=1}return i}}W["UTF-8"]=function(e){return new ne(e)};$["UTF-8"]=function(e){return new ee(e)};var T=T||globalThis||{};T.TextEncoder=typeof k>"u"?k:T.TextEncoder;T.TextDecoder=typeof y>"u"?y:T.TextDecoder;let _;const m=new Array(128).fill(void 0);m.push(void 0,null,!0,!1);function s(e){return m[e]}let g=0;function j(){return new Uint8Array(_.memory.buffer)}const B=typeof k<"u"?new k("utf-8"):{encode:()=>{throw Error("TextEncoder not available")}},te=typeof B.encodeInto=="function"?function(e,n){return B.encodeInto(e,n)}:function(e,n){const t=B.encode(e);return n.set(t),{read:e.length,written:t.length}};function v(e,n,t){if(t===void 0){const a=B.encode(e),f=n(a.length,1)>>>0;return j().subarray(f,f+a.length).set(a),g=a.length,f}let r=e.length,o=n(r,1)>>>0;const i=j();let c=0;for(;c<r;c++){const a=e.charCodeAt(c);if(a>127)break;i[o+c]=a}if(c!==r){c!==0&&(e=e.slice(c)),o=t(o,r,r=c+e.length*3,1)>>>0;const a=j().subarray(o+c,o+r),f=te(e,a);c+=f.written,o=t(o,r,c,1)>>>0}return g=c,o}function I(e){return e==null}function d(){return new Int32Array(_.memory.buffer)}const q=typeof y<"u"?new y("utf-8",{ignoreBOM:!0,fatal:!0}):{decode:()=>{throw Error("TextDecoder not available")}};typeof y<"u"&&q.decode();function A(e,n){return e=e>>>0,q.decode(j().subarray(e,e+n))}let M=m.length;function u(e){M===m.length&&m.push(m.length+1);const n=M;return M=m[n],m[n]=e,n}function re(e){e<132||(m[e]=M,M=e)}function O(e){const n=s(e);return re(e),n}function oe(){return new Float64Array(_.memory.buffer)}function L(e){const n=typeof e;if(n=="number"||n=="boolean"||e==null)return`${e}`;if(n=="string")return`"${e}"`;if(n=="symbol"){const o=e.description;return o==null?"Symbol":`Symbol(${o})`}if(n=="function"){const o=e.name;return typeof o=="string"&&o.length>0?`Function(${o})`:"Function"}if(Array.isArray(e)){const o=e.length;let i="[";o>0&&(i+=L(e[0]));for(let c=1;c<o;c++)i+=", "+L(e[c]);return i+="]",i}const t=/\[object ([^\]]+)\]/.exec(toString.call(e));let r;if(t.length>1)r=t[1];else return toString.call(e);if(r=="Object")try{return"Object("+JSON.stringify(e)+")"}catch{return"Object"}return e instanceof Error?`${e.name}: ${e.message}
${e.stack}`:r}function p(e,n){const t=n(e.length*1,1)>>>0;return j().set(e,t/1),g=e.length,t}function ie(e){const n=p(e,_.__wbindgen_malloc),t=g;_.init_rng_pool(n,t)}function E(e,n){return e=e>>>0,j().subarray(e/1,e/1+n)}function ce(e){const n=Date.now();try{const i=_.__wbindgen_add_to_stack_pointer(-16),c=p(e,_.__wbindgen_malloc),a=g;_.sm3(i,c,a);var t=d()[i/4+0],r=d()[i/4+1],o=E(t,r).slice();return _.__wbindgen_free(t,r*1,1),console.log("sm3 took",Date.now()-n,"ms"),o}finally{_.__wbindgen_add_to_stack_pointer(16)}}function _e(e,n,t){const r=Date.now();try{const a=_.__wbindgen_add_to_stack_pointer(-16),f=v(e,_.__wbindgen_malloc,_.__wbindgen_realloc),l=g,w=p(n,_.__wbindgen_malloc),b=g;_.sm2_encrypt(a,f,l,w,b,u(t));var o=d()[a/4+0],i=d()[a/4+1],c=E(o,i).slice();return _.__wbindgen_free(o,i*1,1),console.log("sm2_encrypt took",Date.now()-r,"ms"),c}finally{_.__wbindgen_add_to_stack_pointer(16)}}function se(e,n,t){const r=Date.now();try{const a=_.__wbindgen_add_to_stack_pointer(-16),f=v(e,_.__wbindgen_malloc,_.__wbindgen_realloc),l=g,w=p(n,_.__wbindgen_malloc),b=g;_.sm2_decrypt(a,f,l,w,b,u(t));var o=d()[a/4+0],i=d()[a/4+1],c=E(o,i).slice();return _.__wbindgen_free(o,i*1,1),console.log("sm2_decrypt took",Date.now()-r,"ms"),c}finally{_.__wbindgen_add_to_stack_pointer(16)}}function fe(e,n,t){const r=Date.now();let o,i;try{const f=_.__wbindgen_add_to_stack_pointer(-16),l=v(e,_.__wbindgen_malloc,_.__wbindgen_realloc),w=g,b=p(n,_.__wbindgen_malloc),C=g;_.sm2_sign(f,l,w,b,C,u(t));var c=d()[f/4+0],a=d()[f/4+1];return o=c,i=a,console.log("sm2_sign took",Date.now()-r,"ms"),A(c,a)}finally{_.__wbindgen_add_to_stack_pointer(16),_.__wbindgen_free(o,i,1)}}function ae(e,n,t,r){const o=Date.now(),i=v(e,_.__wbindgen_malloc,_.__wbindgen_realloc),c=g,a=p(n,_.__wbindgen_malloc),f=g,l=v(t,_.__wbindgen_malloc,_.__wbindgen_realloc),w=g,b=_.sm2_verify(i,c,a,f,l,w,u(r));return console.log("sm2_verify took",Date.now()-o,"ms"),b!==0}function ue(){const e=Date.now(),n=_.sm2_generate_keypair();return console.log("sm2_generate_keypair took",Date.now()-e,"ms"),O(n)}function le(e){const n=Date.now();let t,r;try{const w=_.__wbindgen_add_to_stack_pointer(-16),b=v(e,_.__wbindgen_malloc,_.__wbindgen_realloc),C=g;_.compress_public_key_hex(w,b,C);var o=d()[w/4+0],i=d()[w/4+1],c=d()[w/4+2],a=d()[w/4+3],f=o,l=i;if(a)throw f=0,l=0,O(c);return t=f,r=l,console.log("compress_public_key_hex took",Date.now()-n,"ms"),A(f,l)}finally{_.__wbindgen_add_to_stack_pointer(16),_.__wbindgen_free(t,r,1)}}function de(e,n){const t=Date.now();try{const c=_.__wbindgen_add_to_stack_pointer(-16),a=p(e,_.__wbindgen_malloc),f=g,l=p(n,_.__wbindgen_malloc),w=g;_.sm3_hmac(c,a,f,l,w);var r=d()[c/4+0],o=d()[c/4+1],i=E(r,o).slice();return _.__wbindgen_free(r,o*1,1),console.log("sm3_hmac took",Date.now()-t,"ms"),i}finally{_.__wbindgen_add_to_stack_pointer(16)}}function ge(e,n,t){const r=Date.now();try{const a=_.__wbindgen_add_to_stack_pointer(-16),f=p(e,_.__wbindgen_malloc),l=g,w=p(n,_.__wbindgen_malloc),b=g;_.sm4_encrypt(a,f,l,w,b,u(t));var o=d()[a/4+0],i=d()[a/4+1],c=E(o,i).slice();return _.__wbindgen_free(o,i*1,1),console.log("sm4_encrypt took",Date.now()-r,"ms"),c}finally{_.__wbindgen_add_to_stack_pointer(16)}}function we(e,n,t){const r=Date.now();try{const a=_.__wbindgen_add_to_stack_pointer(-16),f=p(e,_.__wbindgen_malloc),l=g,w=p(n,_.__wbindgen_malloc),b=g;_.sm4_decrypt(a,f,l,w,b,u(t));var o=d()[a/4+0],i=d()[a/4+1],c=E(o,i).slice();return _.__wbindgen_free(o,i*1,1),console.log("sm4_decrypt took",Date.now()-r,"ms"),c}finally{_.__wbindgen_add_to_stack_pointer(16)}}function be(){_.main_js()}function h(e,n){try{return e.apply(this,n)}catch(t){_.__wbindgen_exn_store(u(t))}}async function pe(e,n){const t=await MYWebAssembly.instantiate(e,n);return t instanceof MYWebAssembly.Instance?{instance:t,module:e}:t}function z(){const e={};return e.wbg={},e.wbg.__wbindgen_is_undefined=function(n){return s(n)===void 0},e.wbg.__wbindgen_in=function(n,t){return s(n)in s(t)},e.wbg.__wbindgen_is_object=function(n){const t=s(n);return typeof t=="object"&&t!==null},e.wbg.__wbg_getwithrefkey_edc2c8960f0f1191=function(n,t){const r=s(n)[s(t)];return u(r)},e.wbg.__wbindgen_string_get=function(n,t){const r=s(t),o=typeof r=="string"?r:void 0;var i=I(o)?0:v(o,_.__wbindgen_malloc,_.__wbindgen_realloc),c=g;d()[n/4+1]=c,d()[n/4+0]=i},e.wbg.__wbindgen_boolean_get=function(n){const t=s(n);return typeof t=="boolean"?t?1:0:2},e.wbg.__wbg_isArray_2ab64d95e09ea0ae=function(n){return Array.isArray(s(n))},e.wbg.__wbg_length_cd7af8117672b8b8=function(n){return s(n).length},e.wbg.__wbg_get_bd8e338fbd5f5cc8=function(n,t){const r=s(n)[t>>>0];return u(r)},e.wbg.__wbg_iterator_2cee6dadfd956dfa=function(){return u(Symbol.iterator)},e.wbg.__wbg_get_e3c254076557e348=function(){return h(function(n,t){const r=Reflect.get(s(n),s(t));return u(r)},arguments)},e.wbg.__wbg_next_40fc327bfc8770e6=function(n){const t=s(n).next;return u(t)},e.wbg.__wbg_next_196c84450b364254=function(){return h(function(n){const t=s(n).next();return u(t)},arguments)},e.wbg.__wbg_done_298b57d23c0fc80c=function(n){return s(n).done},e.wbg.__wbg_value_d93c65011f51a456=function(n){const t=s(n).value;return u(t)},e.wbg.__wbg_isSafeInteger_f7b04ef02296c4d2=function(n){return Number.isSafeInteger(s(n))},e.wbg.__wbindgen_as_number=function(n){return+s(n)},e.wbg.__wbindgen_string_new=function(n,t){const r=A(n,t);return u(r)},e.wbg.__wbg_set_f975102236d3c502=function(n,t,r){s(n)[O(t)]=O(r)},e.wbg.__wbg_log_5bb5f88f245d7762=function(n){console.log(s(n))},e.wbg.__wbg_new_72fb9a18b5ae2624=function(){const n=new Object;return u(n)},e.wbg.__wbindgen_error_new=function(n,t){const r=new Error(A(n,t));return u(r)},e.wbg.__wbindgen_object_clone_ref=function(n){const t=s(n);return u(t)},e.wbg.__wbg_crypto_1d1f22824a6a080c=function(n){return u({getRandomValues:function(r){console.warn("[Warning] sm-crypto-wasm: It is dangerous to use non-cryptographically secure random number generator in production. Please populate RNG seed first from a secure source using 'smCrypto.initRNGPool()' API.");for(let o=0,i=r.length;o<i;o++)r[o]=Math.floor(Math.random()*256);return r}})},e.wbg.__wbg_process_4a72847cc503995b=function(n){const t=s(n).process;return u(t)},e.wbg.__wbg_versions_f686565e586dd935=function(n){const t=s(n).versions;return u(t)},e.wbg.__wbg_node_104a2ff8d6ea03a2=function(n){const t=s(n).node;return u(t)},e.wbg.__wbindgen_is_string=function(n){return typeof s(n)=="string"},e.wbg.__wbg_require_cca90b1a94a0255b=function(){return h(function(){const n=module.require;return u(n)},arguments)},e.wbg.__wbg_call_b3ca7c6051f9bec1=function(){return h(function(n,t,r){const o=s(n).call(s(t),s(r));return u(o)},arguments)},e.wbg.__wbg_msCrypto_eb05e62b530a1508=function(n){const t=s(n).msCrypto;return u(t)},e.wbg.__wbg_newwithlength_e9b4878cebadb3d3=function(n){const t=new Uint8Array(n>>>0);return u(t)},e.wbg.__wbindgen_is_function=function(n){return typeof s(n)=="function"},e.wbg.__wbg_call_27c0f87801dedf93=function(){return h(function(n,t){const r=s(n).call(s(t));return u(r)},arguments)},e.wbg.__wbg_self_ce0dbfc45cf2f5be=function(){return h(function(){const n=self.self;return u(n)},arguments)},e.wbg.__wbg_window_c6fb939a7f436783=function(){return h(function(){const n=window.window;return u(n)},arguments)},e.wbg.__wbg_globalThis_d1e6af4856ba331b=function(){return h(function(){const n=globalThis.globalThis;return u(n)},arguments)},e.wbg.__wbg_global_207b558942527489=function(){return h(function(){const n=T.global;return u(n)},arguments)},e.wbg.__wbg_newnoargs_e258087cd0daa0ea=function(n,t){const r=new Function(A(n,t));return u(r)},e.wbg.__wbindgen_memory=function(){const n=_.memory;return u(n)},e.wbg.__wbg_buffer_12d079cc21e14bdb=function(n){const t=s(n).buffer;return u(t)},e.wbg.__wbg_new_63b92bc8671ed464=function(n){const t=new Uint8Array(s(n));return u(t)},e.wbg.__wbg_set_a47bac70306a19a7=function(n,t,r){s(n).set(s(t),r>>>0)},e.wbg.__wbg_length_c20a40f15020d68a=function(n){return s(n).length},e.wbg.__wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb=function(n,t,r){const o=new Uint8Array(s(n),t>>>0,r>>>0);return u(o)},e.wbg.__wbg_randomFillSync_5c9c955aa56b6049=function(){return h(function(n,t){s(n).randomFillSync(O(t))},arguments)},e.wbg.__wbg_subarray_a1f73cd4b5b42fe1=function(n,t,r){const o=s(n).subarray(t>>>0,r>>>0);return u(o)},e.wbg.__wbg_getRandomValues_3aa56aa6edec874c=function(){return h(function(n,t){s(n).getRandomValues(s(t))},arguments)},e.wbg.__wbindgen_object_drop_ref=function(n){O(n)},e.wbg.__wbindgen_jsval_loose_eq=function(n,t){return s(n)==s(t)},e.wbg.__wbindgen_number_get=function(n,t){const r=s(t),o=typeof r=="number"?r:void 0;oe()[n/8+1]=I(o)?0:o,d()[n/4+0]=!I(o)},e.wbg.__wbg_instanceof_Uint8Array_2b3bbecd033d19f6=function(n){let t;try{t=s(n)instanceof Uint8Array}catch{t=!1}return t},e.wbg.__wbg_instanceof_ArrayBuffer_836825be07d4c9d2=function(n){let t;try{t=s(n)instanceof ArrayBuffer}catch{t=!1}return t},e.wbg.__wbindgen_debug_string=function(n,t){const r=L(s(t)),o=v(r,_.__wbindgen_malloc,_.__wbindgen_realloc),i=g;d()[n/4+1]=i,d()[n/4+0]=o},e.wbg.__wbindgen_throw=function(n,t){throw new Error(A(n,t))},e}function G(e,n){return _=e.exports,Y.__wbindgen_wasm_module=n,_.__wbindgen_start(),_}function he(e){if(_!==void 0)return _;const n=z();e instanceof MYWebAssembly.Module||(e=new MYWebAssembly.Module(e));const t=new MYWebAssembly.Instance(e,n);return G(t,e)}async function Y(e){if(_!==void 0)return _;const n=z(),{instance:t,module:r}=await pe(await e,n);return G(t,r)}const ye=Object.freeze(Object.defineProperty({__proto__:null,compress_public_key_hex:le,default:Y,initSync:he,init_rng_pool:ie,main_js:be,sm2_decrypt:se,sm2_encrypt:_e,sm2_generate_keypair:ue,sm2_sign:fe,sm2_verify:ae,sm3:ce,sm3_hmac:de,sm4_decrypt:we,sm4_encrypt:ge},Symbol.toStringTag,{value:"Module"}));console.log("worker-index: init wasm");worker.onMessage(function(e){console.log(`received worker operation ${e.id}`);const{method:n,id:t,len:r}=e;let o=[];for(let c=0;c<r;c++)console.log(`message[${c}] is type ${Object.prototype.toString.call(e[c])} ${JSON.stringify(e[c])}`),Array.isArray(e[c])?o.push(Uint8Array.from(e[c])):o.push(e[c]);let i=ye[n](...o);i instanceof Uint8Array&&(i=Array.from(i)),worker.postMessage({id:t,result:i,type:Object.prototype.toString.call(i)})});console.log=function(...e){worker.postMessage({id:-1,event:"log",message:e.filter(n=>typeof n=="string"||typeof n=="number").join(" ")})};Y("sm-crypto/crypto.wasm").then(e=>{console.log("module loaded successfully",e),worker.postMessage({id:-1,event:"ready"})}).catch(e=>{console.error("failed to load module",e)});
