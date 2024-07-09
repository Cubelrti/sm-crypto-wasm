"use strict";function O(e,n,t){return n<=e&&e<=t}function Y(e,n){return e.indexOf(n)!==-1}function F(e){if(e===void 0)return{};if(e===Object(e))return e;throw TypeError("Could not convert argument to dictionary")}function Z(e){for(var n=String(e),t=n.length,r=0,o=[];r<t;){var _=n.charCodeAt(r);if(_<55296||_>57343)o.push(_);else if(56320<=_&&_<=57343)o.push(65533);else if(55296<=_&&_<=56319)if(r===t-1)o.push(65533);else{var c=n.charCodeAt(r+1);if(56320<=c&&c<=57343){var a=_&1023,s=c&1023;o.push(65536+(a<<10)+s),r+=1}else o.push(65533)}r+=1}return o}function ee(e){for(var n="",t=0;t<e.length;++t){var r=e[t];r<=65535?n+=String.fromCharCode(r):(r-=65536,n+=String.fromCharCode((r>>10)+55296,(r&1023)+56320))}return n}function ne(e){return 0<=e&&e<=127}var te=ne,S=-1;function $(e){this.tokens=[].slice.call(e),this.tokens.reverse()}$.prototype={endOfStream:function(){return!this.tokens.length},read:function(){return this.tokens.length?this.tokens.pop():S},prepend:function(e){if(Array.isArray(e))for(var n=e;n.length;)this.tokens.push(n.pop());else this.tokens.push(e)},push:function(e){if(Array.isArray(e))for(var n=e;n.length;)this.tokens.unshift(n.shift());else this.tokens.unshift(e)}};var M=-1;function P(e,n){if(e)throw TypeError("Decoder error");return n||65533}function R(e){return e=String(e).trim().toLowerCase(),Object.prototype.hasOwnProperty.call(L,e)?L[e]:null}var re=[{encodings:[{labels:["unicode-1-1-utf-8","utf-8","utf8"],name:"UTF-8"}],heading:"The Encoding"}],L={};re.forEach(function(e){e.encodings.forEach(function(n){n.labels.forEach(function(t){L[t]=n})})});var V={},G={},q="utf-8";function y(e,n){if(!(this instanceof y))throw TypeError("Called as a function. Did you forget 'new'?");e=e!==void 0?String(e):q,n=F(n),this._encoding=null,this._decoder=null,this._ignoreBOM=!1,this._BOMseen=!1,this._error_mode="replacement",this._do_not_flush=!1;var t=R(e);if(t===null||t.name==="replacement")throw RangeError("Unknown encoding: "+e);if(!G[t.name])throw Error("Decoder not present. Did you forget to include encoding-indexes.js first?");var r=this;return r._encoding=t,n.fatal&&(r._error_mode="fatal"),n.ignoreBOM&&(r._ignoreBOM=!0),Object.defineProperty||(this.encoding=r._encoding.name.toLowerCase(),this.fatal=r._error_mode==="fatal",this.ignoreBOM=r._ignoreBOM),r}Object.defineProperty&&(Object.defineProperty(y.prototype,"encoding",{get:function(){return this._encoding.name.toLowerCase()}}),Object.defineProperty(y.prototype,"fatal",{get:function(){return this._error_mode==="fatal"}}),Object.defineProperty(y.prototype,"ignoreBOM",{get:function(){return this._ignoreBOM}}));y.prototype.decode=function(n,t){var r;typeof n=="object"&&n instanceof ArrayBuffer?r=new Uint8Array(n):typeof n=="object"&&"buffer"in n&&n.buffer instanceof ArrayBuffer?r=new Uint8Array(n.buffer,n.byteOffset,n.byteLength):r=new Uint8Array(0),t=F(t),this._do_not_flush||(this._decoder=G[this._encoding.name]({fatal:this._error_mode==="fatal"}),this._BOMseen=!1),this._do_not_flush=!!t.stream;for(var o=new $(r),_=[],c;;){var a=o.read();if(a===S||(c=this._decoder.handler(o,a),c===M))break;c!==null&&(Array.isArray(c)?_.push.apply(_,c):_.push(c))}if(!this._do_not_flush){do{if(c=this._decoder.handler(o,o.read()),c===M)break;c!==null&&(Array.isArray(c)?_.push.apply(_,c):_.push(c))}while(!o.endOfStream());this._decoder=null}function s(d){return Y(["UTF-8","UTF-16LE","UTF-16BE"],this._encoding.name)&&!this._ignoreBOM&&!this._BOMseen&&(d.length>0&&d[0]===65279?(this._BOMseen=!0,d.shift()):d.length>0&&(this._BOMseen=!0)),ee(d)}return s.call(this,_)};function D(e,n){if(!(this instanceof D))throw TypeError("Called as a function. Did you forget 'new'?");n=F(n),this._encoding=null,this._encoder=null,this._do_not_flush=!1,this._fatal=n.fatal?"fatal":"replacement";var t=this;if(n.NONSTANDARD_allowLegacyEncoding){e=e!==void 0?String(e):q;var r=R(e);if(r===null||r.name==="replacement")throw RangeError("Unknown encoding: "+e);if(!V[r.name])throw Error("Encoder not present. Did you forget to include encoding-indexes.js first?");t._encoding=r}else t._encoding=R("utf-8");return Object.defineProperty||(this.encoding=t._encoding.name.toLowerCase()),t}Object.defineProperty&&Object.defineProperty(D.prototype,"encoding",{get:function(){return this._encoding.name.toLowerCase()}});D.prototype.encode=function(n,t){n=n===void 0?"":String(n),t=F(t),this._do_not_flush||(this._encoder=V[this._encoding.name]({fatal:this._fatal==="fatal"})),this._do_not_flush=!!t.stream;for(var r=new $(Z(n)),o=[],_;;){var c=r.read();if(c===S||(_=this._encoder.handler(r,c),_===M))break;Array.isArray(_)?o.push.apply(o,_):o.push(_)}if(!this._do_not_flush){for(;_=this._encoder.handler(r,r.read()),_!==M;)Array.isArray(_)?o.push.apply(o,_):o.push(_);this._encoder=null}return new Uint8Array(o)};function oe(e){var n=e.fatal,t=0,r=0,o=0,_=128,c=191;this.handler=function(a,s){if(s===S&&o!==0)return o=0,P(n);if(s===S)return M;if(o===0){if(O(s,0,127))return s;if(O(s,194,223))o=1,t=s&31;else if(O(s,224,239))s===224&&(_=160),s===237&&(c=159),o=2,t=s&15;else if(O(s,240,244))s===240&&(_=144),s===244&&(c=143),o=3,t=s&7;else return P(n);return null}if(!O(s,_,c))return t=o=r=0,_=128,c=191,a.prepend(s),P(n);if(_=128,c=191,t=t<<6|s&63,r+=1,r!==o)return null;var d=t;return t=o=r=0,d}}function ie(e){e.fatal,this.handler=function(n,t){if(t===S)return M;if(te(t))return t;var r,o;O(t,128,2047)?(r=1,o=192):O(t,2048,65535)?(r=2,o=224):O(t,65536,1114111)&&(r=3,o=240);for(var _=[(t>>6*r)+o];r>0;){var c=t>>6*(r-1);_.push(128|c&63),r-=1}return _}}V["UTF-8"]=function(e){return new ie(e)};G["UTF-8"]=function(e){return new oe(e)};var B=B||globalThis||{};B.TextEncoder=typeof D>"u"?D:B.TextEncoder;B.TextDecoder=typeof y>"u"?y:B.TextDecoder;let i;const v=new Array(128).fill(void 0);v.push(void 0,null,!0,!1);function f(e){return v[e]}let l=0;function E(){return new Uint8Array(i.memory.buffer)}const U=typeof D<"u"?new D("utf-8"):{encode:()=>{throw Error("TextEncoder not available")}},_e=typeof U.encodeInto=="function"?function(e,n){return U.encodeInto(e,n)}:function(e,n){const t=U.encode(e);return n.set(t),{read:e.length,written:t.length}};function x(e,n,t){if(t===void 0){const a=U.encode(e),s=n(a.length,1)>>>0;return E().subarray(s,s+a.length).set(a),l=a.length,s}let r=e.length,o=n(r,1)>>>0;const _=E();let c=0;for(;c<r;c++){const a=e.charCodeAt(c);if(a>127)break;_[o+c]=a}if(c!==r){c!==0&&(e=e.slice(c)),o=t(o,r,r=c+e.length*3,1)>>>0;const a=E().subarray(o+c,o+r),s=_e(e,a);c+=s.written,o=t(o,r,c,1)>>>0}return l=c,o}function I(e){return e==null}function g(){return new Int32Array(i.memory.buffer)}const H=typeof y<"u"?new y("utf-8",{ignoreBOM:!0,fatal:!0}):{decode:()=>{throw Error("TextDecoder not available")}};typeof y<"u"&&H.decode();function k(e,n){return e=e>>>0,H.decode(E().subarray(e,e+n))}let C=v.length;function u(e){C===v.length&&v.push(v.length+1);const n=C;return C=v[n],v[n]=e,n}function ce(e){e<132||(v[e]=C,C=e)}function T(e){const n=f(e);return ce(e),n}function se(){return new Float64Array(i.memory.buffer)}function W(e){const n=typeof e;if(n=="number"||n=="boolean"||e==null)return`${e}`;if(n=="string")return`"${e}"`;if(n=="symbol"){const o=e.description;return o==null?"Symbol":`Symbol(${o})`}if(n=="function"){const o=e.name;return typeof o=="string"&&o.length>0?`Function(${o})`:"Function"}if(Array.isArray(e)){const o=e.length;let _="[";o>0&&(_+=W(e[0]));for(let c=1;c<o;c++)_+=", "+W(e[c]);return _+="]",_}const t=/\[object ([^\]]+)\]/.exec(toString.call(e));let r;if(t.length>1)r=t[1];else return toString.call(e);if(r=="Object")try{return"Object("+JSON.stringify(e)+")"}catch{return"Object"}return e instanceof Error?`${e.name}: ${e.message}
${e.stack}`:r}function p(e,n){const t=n(e.length*1,1)>>>0;return E().set(e,t/1),l=e.length,t}function ae(e){const n=p(e,i.__wbindgen_malloc),t=l;i.init_rng_pool(n,t)}function j(e,n){return e=e>>>0,E().subarray(e/1,e/1+n)}function fe(e){const n=Date.now();try{const _=i.__wbindgen_add_to_stack_pointer(-16),c=p(e,i.__wbindgen_malloc),a=l;i.sm3(_,c,a);var t=g()[_/4+0],r=g()[_/4+1],o=j(t,r).slice();return i.__wbindgen_free(t,r*1,1),console.log("sm3 took",Date.now()-n,"ms"),o}finally{i.__wbindgen_add_to_stack_pointer(16)}}function ue(e,n,t){const r=Date.now();try{const a=i.__wbindgen_add_to_stack_pointer(-16),s=x(e,i.__wbindgen_malloc,i.__wbindgen_realloc),d=l,w=p(n,i.__wbindgen_malloc),b=l;i.sm2_encrypt(a,s,d,w,b,u(t));var o=g()[a/4+0],_=g()[a/4+1],c=j(o,_).slice();return i.__wbindgen_free(o,_*1,1),console.log("sm2_encrypt took",Date.now()-r,"ms"),c}finally{i.__wbindgen_add_to_stack_pointer(16)}}function de(e,n,t){const r=Date.now();let o,_;try{const s=i.__wbindgen_add_to_stack_pointer(-16),d=x(e,i.__wbindgen_malloc,i.__wbindgen_realloc),w=l,b=p(n,i.__wbindgen_malloc),h=l;i.sm2_encrypt_hex(s,d,w,b,h,u(t));var c=g()[s/4+0],a=g()[s/4+1];return o=c,_=a,console.log("sm2_encrypt_hex took",Date.now()-r,"ms"),k(c,a)}finally{i.__wbindgen_add_to_stack_pointer(16),i.__wbindgen_free(o,_,1)}}function le(e,n,t){const r=Date.now();try{const a=i.__wbindgen_add_to_stack_pointer(-16),s=x(e,i.__wbindgen_malloc,i.__wbindgen_realloc),d=l,w=p(n,i.__wbindgen_malloc),b=l;i.sm2_decrypt(a,s,d,w,b,u(t));var o=g()[a/4+0],_=g()[a/4+1],c=j(o,_).slice();return i.__wbindgen_free(o,_*1,1),console.log("sm2_decrypt took",Date.now()-r,"ms"),c}finally{i.__wbindgen_add_to_stack_pointer(16)}}function ge(e,n,t){const r=Date.now();let o,_;try{const s=i.__wbindgen_add_to_stack_pointer(-16),d=x(e,i.__wbindgen_malloc,i.__wbindgen_realloc),w=l,b=p(n,i.__wbindgen_malloc),h=l;i.sm2_decrypt_hex(s,d,w,b,h,u(t));var c=g()[s/4+0],a=g()[s/4+1];return o=c,_=a,console.log("sm2_decrypt_hex took",Date.now()-r,"ms"),k(c,a)}finally{i.__wbindgen_add_to_stack_pointer(16),i.__wbindgen_free(o,_,1)}}function we(e,n,t){const r=Date.now();let o,_;try{const s=i.__wbindgen_add_to_stack_pointer(-16),d=x(e,i.__wbindgen_malloc,i.__wbindgen_realloc),w=l,b=p(n,i.__wbindgen_malloc),h=l;i.sm2_sign(s,d,w,b,h,u(t));var c=g()[s/4+0],a=g()[s/4+1];return o=c,_=a,console.log("sm2_sign took",Date.now()-r,"ms"),k(c,a)}finally{i.__wbindgen_add_to_stack_pointer(16),i.__wbindgen_free(o,_,1)}}function be(e,n,t,r){const o=Date.now(),_=x(e,i.__wbindgen_malloc,i.__wbindgen_realloc),c=l,a=p(n,i.__wbindgen_malloc),s=l,d=x(t,i.__wbindgen_malloc,i.__wbindgen_realloc),w=l,b=i.sm2_verify(_,c,a,s,d,w,u(r));return console.log("sm2_verify took",Date.now()-o,"ms"),b!==0}function pe(){const e=Date.now(),n=i.sm2_generate_keypair();return console.log("sm2_generate_keypair took",Date.now()-e,"ms"),T(n)}function he(e){const n=Date.now();let t,r;try{const w=i.__wbindgen_add_to_stack_pointer(-16),b=x(e,i.__wbindgen_malloc,i.__wbindgen_realloc),h=l;i.compress_public_key_hex(w,b,h);var o=g()[w/4+0],_=g()[w/4+1],c=g()[w/4+2],a=g()[w/4+3],s=o,d=_;if(a)throw s=0,d=0,T(c);return t=s,r=d,console.log("compress_public_key_hex took",Date.now()-n,"ms"),k(s,d)}finally{i.__wbindgen_add_to_stack_pointer(16),i.__wbindgen_free(t,r,1)}}function me(e,n){const t=Date.now();try{const c=i.__wbindgen_add_to_stack_pointer(-16),a=p(e,i.__wbindgen_malloc),s=l,d=p(n,i.__wbindgen_malloc),w=l;i.sm3_hmac(c,a,s,d,w);var r=g()[c/4+0],o=g()[c/4+1],_=j(r,o).slice();return i.__wbindgen_free(r,o*1,1),console.log("sm3_hmac took",Date.now()-t,"ms"),_}finally{i.__wbindgen_add_to_stack_pointer(16)}}function ye(e,n,t){const r=Date.now();try{const a=i.__wbindgen_add_to_stack_pointer(-16),s=p(e,i.__wbindgen_malloc),d=l,w=p(n,i.__wbindgen_malloc),b=l;i.sm4_encrypt(a,s,d,w,b,u(t));var o=g()[a/4+0],_=g()[a/4+1],c=j(o,_).slice();return i.__wbindgen_free(o,_*1,1),console.log("sm4_encrypt took",Date.now()-r,"ms"),c}finally{i.__wbindgen_add_to_stack_pointer(16)}}function xe(e,n,t,r){const o=Date.now();try{const s=i.__wbindgen_add_to_stack_pointer(-16),d=p(e,i.__wbindgen_malloc),w=l,b=p(n,i.__wbindgen_malloc),h=l,X=p(t,i.__wbindgen_malloc),J=l,K=p(r,i.__wbindgen_malloc),Q=l;i.sm4_encrypt_gcm(s,d,w,b,h,X,J,K,Q);var _=g()[s/4+0],c=g()[s/4+1],a=j(_,c).slice();return i.__wbindgen_free(_,c*1,1),console.log("sm4_encrypt_gcm took",Date.now()-o,"ms"),a}finally{i.__wbindgen_add_to_stack_pointer(16)}}function ve(e,n,t){const r=Date.now();let o,_;try{const s=i.__wbindgen_add_to_stack_pointer(-16),d=p(e,i.__wbindgen_malloc),w=l,b=p(n,i.__wbindgen_malloc),h=l;i.sm4_encrypt_hex(s,d,w,b,h,u(t));var c=g()[s/4+0],a=g()[s/4+1];return o=c,_=a,console.log("sm4_encrypt_hex took",Date.now()-r,"ms"),k(c,a)}finally{i.__wbindgen_add_to_stack_pointer(16),i.__wbindgen_free(o,_,1)}}function ke(e,n,t){const r=Date.now();try{const a=i.__wbindgen_add_to_stack_pointer(-16),s=p(e,i.__wbindgen_malloc),d=l,w=p(n,i.__wbindgen_malloc),b=l;i.sm4_decrypt(a,s,d,w,b,u(t));var o=g()[a/4+0],_=g()[a/4+1],c=j(o,_).slice();return i.__wbindgen_free(o,_*1,1),console.log("sm4_decrypt took",Date.now()-r,"ms"),c}finally{i.__wbindgen_add_to_stack_pointer(16)}}function m(e,n){try{return e.apply(this,n)}catch(t){i.__wbindgen_exn_store(u(t))}}async function Ae(e,n){const t=await WXWebAssembly.instantiate(e,n);return t instanceof WXWebAssembly.Instance?{instance:t,module:e}:t}function Oe(){const e={};return e.wbg={},e.wbg.__wbindgen_is_undefined=function(n){return f(n)===void 0},e.wbg.__wbindgen_in=function(n,t){return f(n)in f(t)},e.wbg.__wbindgen_is_object=function(n){const t=f(n);return typeof t=="object"&&t!==null},e.wbg.__wbg_getwithrefkey_edc2c8960f0f1191=function(n,t){const r=f(n)[f(t)];return u(r)},e.wbg.__wbg_isArray_2ab64d95e09ea0ae=function(n){return Array.isArray(f(n))},e.wbg.__wbg_length_cd7af8117672b8b8=function(n){return f(n).length},e.wbg.__wbg_get_bd8e338fbd5f5cc8=function(n,t){const r=f(n)[t>>>0];return u(r)},e.wbg.__wbg_iterator_2cee6dadfd956dfa=function(){return u(Symbol.iterator)},e.wbg.__wbg_get_e3c254076557e348=function(){return m(function(n,t){const r=Reflect.get(f(n),f(t));return u(r)},arguments)},e.wbg.__wbg_next_40fc327bfc8770e6=function(n){const t=f(n).next;return u(t)},e.wbg.__wbg_next_196c84450b364254=function(){return m(function(n){const t=f(n).next();return u(t)},arguments)},e.wbg.__wbg_done_298b57d23c0fc80c=function(n){return f(n).done},e.wbg.__wbg_value_d93c65011f51a456=function(n){const t=f(n).value;return u(t)},e.wbg.__wbindgen_string_get=function(n,t){const r=f(t),o=typeof r=="string"?r:void 0;var _=I(o)?0:x(o,i.__wbindgen_malloc,i.__wbindgen_realloc),c=l;g()[n/4+1]=c,g()[n/4+0]=_},e.wbg.__wbindgen_boolean_get=function(n){const t=f(n);return typeof t=="boolean"?t?1:0:2},e.wbg.__wbg_isSafeInteger_f7b04ef02296c4d2=function(n){return Number.isSafeInteger(f(n))},e.wbg.__wbindgen_as_number=function(n){return+f(n)},e.wbg.__wbindgen_string_new=function(n,t){const r=k(n,t);return u(r)},e.wbg.__wbg_set_f975102236d3c502=function(n,t,r){f(n)[T(t)]=T(r)},e.wbg.__wbg_log_5bb5f88f245d7762=function(n){console.log(f(n))},e.wbg.__wbg_new_72fb9a18b5ae2624=function(){const n=new Object;return u(n)},e.wbg.__wbindgen_error_new=function(n,t){const r=new Error(k(n,t));return u(r)},e.wbg.__wbindgen_object_drop_ref=function(n){T(n)},e.wbg.__wbindgen_object_clone_ref=function(n){const t=f(n);return u(t)},e.wbg.__wbg_crypto_1d1f22824a6a080c=function(n){return u({getRandomValues:function(r){console.warn("[Warning] sm-crypto-wasm: It is dangerous to use non-cryptographically secure random number generator in production. Please populate RNG seed first from a secure source using 'smCrypto.initRNGPool()' API.");for(let o=0,_=r.length;o<_;o++)r[o]=Math.floor(Math.random()*256);return r}})},e.wbg.__wbg_process_4a72847cc503995b=function(n){const t=f(n).process;return u(t)},e.wbg.__wbg_versions_f686565e586dd935=function(n){const t=f(n).versions;return u(t)},e.wbg.__wbg_node_104a2ff8d6ea03a2=function(n){const t=f(n).node;return u(t)},e.wbg.__wbindgen_is_string=function(n){return typeof f(n)=="string"},e.wbg.__wbg_require_cca90b1a94a0255b=function(){return m(function(){const n=module.require;return u(n)},arguments)},e.wbg.__wbg_call_b3ca7c6051f9bec1=function(){return m(function(n,t,r){const o=f(n).call(f(t),f(r));return u(o)},arguments)},e.wbg.__wbg_msCrypto_eb05e62b530a1508=function(n){const t=f(n).msCrypto;return u(t)},e.wbg.__wbg_newwithlength_e9b4878cebadb3d3=function(n){const t=new Uint8Array(n>>>0);return u(t)},e.wbg.__wbindgen_is_function=function(n){return typeof f(n)=="function"},e.wbg.__wbg_call_27c0f87801dedf93=function(){return m(function(n,t){const r=f(n).call(f(t));return u(r)},arguments)},e.wbg.__wbg_self_ce0dbfc45cf2f5be=function(){return m(function(){const n=self.self;return u(n)},arguments)},e.wbg.__wbg_window_c6fb939a7f436783=function(){return m(function(){const n=window.window;return u(n)},arguments)},e.wbg.__wbg_globalThis_d1e6af4856ba331b=function(){return m(function(){const n=globalThis.globalThis;return u(n)},arguments)},e.wbg.__wbg_global_207b558942527489=function(){return m(function(){const n=B.global;return u(n)},arguments)},e.wbg.__wbg_newnoargs_e258087cd0daa0ea=function(n,t){const r=new Function(k(n,t));return u(r)},e.wbg.__wbindgen_memory=function(){const n=i.memory;return u(n)},e.wbg.__wbg_buffer_12d079cc21e14bdb=function(n){const t=f(n).buffer;return u(t)},e.wbg.__wbg_new_63b92bc8671ed464=function(n){const t=new Uint8Array(f(n));return u(t)},e.wbg.__wbg_set_a47bac70306a19a7=function(n,t,r){f(n).set(f(t),r>>>0)},e.wbg.__wbg_length_c20a40f15020d68a=function(n){return f(n).length},e.wbg.__wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb=function(n,t,r){const o=new Uint8Array(f(n),t>>>0,r>>>0);return u(o)},e.wbg.__wbg_randomFillSync_5c9c955aa56b6049=function(){return m(function(n,t){f(n).randomFillSync(T(t))},arguments)},e.wbg.__wbg_subarray_a1f73cd4b5b42fe1=function(n,t,r){const o=f(n).subarray(t>>>0,r>>>0);return u(o)},e.wbg.__wbg_getRandomValues_3aa56aa6edec874c=function(){return m(function(n,t){f(n).getRandomValues(f(t))},arguments)},e.wbg.__wbindgen_jsval_loose_eq=function(n,t){return f(n)==f(t)},e.wbg.__wbindgen_number_get=function(n,t){const r=f(t),o=typeof r=="number"?r:void 0;se()[n/8+1]=I(o)?0:o,g()[n/4+0]=!I(o)},e.wbg.__wbg_instanceof_Uint8Array_2b3bbecd033d19f6=function(n){let t;try{t=f(n)instanceof Uint8Array}catch{t=!1}return t},e.wbg.__wbg_instanceof_ArrayBuffer_836825be07d4c9d2=function(n){let t;try{t=f(n)instanceof ArrayBuffer}catch{t=!1}return t},e.wbg.__wbindgen_debug_string=function(n,t){const r=W(f(t)),o=x(r,i.__wbindgen_malloc,i.__wbindgen_realloc),_=l;g()[n/4+1]=_,g()[n/4+0]=o},e.wbg.__wbindgen_throw=function(n,t){throw new Error(k(n,t))},e}function De(e,n){return i=e.exports,z.__wbindgen_wasm_module=n,i.__wbindgen_start(),i}async function z(e){if(i!==void 0)return i;const n=Oe(),{instance:t,module:r}=await Ae(await e,n);return De(t,r)}function A(e){const n=[];for(let t=0;t<e.length;t+=2)n.push(parseInt(e.substr(t,2),16));return new Uint8Array(n)}let N=null;async function je(){if(!N)try{const e=await z("/sm-crypto/crypto.wasm");console.log("init sm-crypto-wasm direct success",e),N=e}catch(e){console.log("init sm-crypto-wasm direct failed",e),N=null}}const Te={initSMCrypto:je,sm2:{generateKeyPairHex:pe,compressPublicKeyHex:he,encrypt(e,n,t){return t=Object.assign({cipherMode:1,asn1:!1,output:"array"},t),e=typeof e=="string"?A(e):e,t.output==="string"?de(n,e,{asn1:t.asn1,c1c2c3:t.cipherMode===0}):ue(n,e,{asn1:t.asn1,c1c2c3:t.cipherMode===0})},decrypt(e,n,t){return t=Object.assign({cipherMode:1,asn1:!1,output:"array"},t),e=typeof e=="string"?A(e):e,t.output==="string"?ge(n,e,{asn1:t.asn1,c1c2c3:t.cipherMode===0}):le(n,e,{asn1:t.asn1,c1c2c3:t.cipherMode===0})},doSignature(e,n,t){return e=typeof e=="string"?A(e):e,t=Object.assign({hash:!0,der:!0},t),we(n,e,t)},doVerifySignature(e,n,t,r){return e=typeof e=="string"?A(e):e,r=Object.assign({hash:!0,der:!0},r),be(n,e,t,r)},initRNGPool:ae},sm3:fe,hmac:me,sm4:{encrypt(e,n,t){return t=Object.assign({mode:"cbc",padding:"pkcs7",output:"array"},t),t.iv=t.iv?typeof t.iv=="string"?A(t.iv):t.iv:void 0,n=typeof n=="string"?A(n):n,t.output==="string"?ve(e,n,{mode:t.mode,padding:t.padding,iv:t.iv}):ye(e,n,{mode:t.mode,padding:t.padding,iv:t.iv})},decrypt(e,n,t){return t=Object.assign({mode:"cbc",padding:"pkcs7",output:"array"},t),t.iv=t.iv?typeof t.iv=="string"?A(t.iv):t.iv:void 0,n=typeof n=="string"?A(n):n,ke(e,n,{mode:t.mode,padding:t.padding,iv:t.iv})},gcm:xe}};module.exports=Te;
