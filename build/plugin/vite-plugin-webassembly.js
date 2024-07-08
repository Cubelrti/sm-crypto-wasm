import { readFileSync } from "fs";
import { parseModule, generateCode } from "magicast";

export default function webAssemblyPlugin(options) {
  return {
    name: 'webassembly-transform-plugin',
    async transform(code, id) {
      // Process only pkg/index.js
      if (!id.endsWith('pkg/index.js')) {
        return;
      }
      const mod = parseModule(code);
      // add TextEncoder and TextDecoder shim
      // TT iOS and Alipay Android need shim inside Worker, global polyfill is not working
      const shim = readFileSync('js/shim-encoding.js', 'utf-8');
      const shimAst = parseModule(shim);
      mod.$ast.body = shimAst.$ast.body.concat(mod.$ast.body);
      // Traverse and modify the AST
      mod.$ast.body.forEach(node => {
        const traverseNode = (n, p, k) => {
          // Check if the node is an Identifier and its name is 'WebAssembly'
          if (n.type === 'Identifier' && n.name === 'WebAssembly') {
            // console.log(`converting WebAssembly of ${n.start}-${n.end} to ${options.name}`)
            n.name = options.name;
          }
          // remove the following line:
          // input = new URL('pyramid_bg.wasm', import.meta.url);
          // input = fetch(input)
          if (n.type === 'ExpressionStatement' && n.expression.type === 'AssignmentExpression' && n.expression.left.type === 'Identifier' && n.expression.left.name === 'input') {
            // console.log(`removing input assignment from ${n.start}-${n.end}`)
            p[k] = null;
          }
          // simplify the if statement in __wbg_load function
          // to avoid loading wasm file by streaming
          if (n.type === 'FunctionDeclaration' && n.id.type === 'Identifier' && n.id.name === '__wbg_load') {
            const ifStatement = n.body.body.find(n => n.type === 'IfStatement');
            if (ifStatement) {
              // console.log(ifStatement)
              console.log(`removing if statement from ${n.start}-${n.end}`)
              n.body.body = ifStatement.alternate.body;
              // console.log(n)
            }

          }

          // shim Web Crypto API for Toutiao Mini Program or WeChat Mini Program in WebAssembly Mode
          // replace the following line:
          // const ret = getObject(arg0).crypto
          if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier' && n.id.name === 'ret' && n.init.type === 'MemberExpression' && n.init.object.type === 'CallExpression' && n.init.object.callee.type === 'Identifier' && n.init.object.callee.name === 'getObject' && n.init.object.arguments[0].type === 'Identifier' && n.init.object.arguments[0].name === 'arg0' && n.init.property.type === 'Identifier' && n.init.property.name === 'crypto') {
            console.log(`shimming Web Crypto API`)
            const code = `const ret = {
              getRandomValues: function(array) {
                console.warn("[Warning] sm-crypto-wasm: It is dangerous to use non-cryptographically secure random number generator in production. Please populate RNG seed first from a secure source using 'smCrypto.initRNGPool()' API.")
                for (let i = 0, l = array.length; i < l; i++) {
                    array[i] = Math.floor(Math.random() * 256);
                }
                return array;
            }
          }`;
            n.init = parseModule(code).$ast.body[0].declarations[0].init;
          }

          // add a timer call for all exported functions like export function sm2() {}
          if (n.type === 'ExportNamedDeclaration' && n.declaration?.type === 'FunctionDeclaration' && !n.$$hasTimer) {
            n.$$hasTimer = true;
            const code = `const timer = Date.now();`;
            n.declaration.body.body.unshift(parseModule(code).$ast.body[0]);
            const returnStatement = n.declaration.body.body.find(n => {
              // recursively find the return statement
              if (n.type === 'ReturnStatement') {
                return true;
              }
              // maybe inside a try block
              if (n.type === 'TryStatement') {
                return n.block.body.some(n => n.type === 'ReturnStatement');
              }
            });
            console.log(n.declaration.body.body.length)
            const code2 = `console.log('${n.declaration?.id.name} took', Date.now() - timer, 'ms');`;
            if (returnStatement) {
              console.log('???', n.declaration?.id.name)
              // insert before the return statement
              // find the index of the return statement
              // in a try block, insert before the return statement
              if (returnStatement.type === 'TryStatement') {
                const index2 = returnStatement.block.body.indexOf(returnStatement.block.body.find(n => n.type === 'ReturnStatement'));
                returnStatement.block.body.splice(index2, 0, parseModule(code2).$ast.body[0]);
              } else {
                const index = n.declaration.body.body.indexOf(returnStatement);
                n.declaration.body.body.splice(index, 0, parseModule(code2).$ast.body[0]);  
              }
            }
          }
          // debug only
          // add a console.log to all functions like
          // imports.wbg.__wbindgen_memory = function() {
          //   const ret = wasm.memory;
          //   return addHeapObject(ret);
          // };          
          // into 
          // imports.wbg.__wbindgen_memory = function() {
          //   console.log('calling __wbindgen_memory');
          //   const ret = wasm.memory;
          //   return addHeapObject(ret);
          // };

          // if (n.type === 'ExpressionStatement' && n.expression.type === 'AssignmentExpression'
          //   && n.expression.left.property?.name?.startsWith('__wb')
          //   && n.expression.right.type === 'FunctionExpression'
          //   && !n.$$hasConsoleLog
          // ) {
          //   n.$$hasConsoleLog = true;
          //   const code = `console.log('calling ${n.expression.left.property.name}');`;
          //   n.expression.right.body.body.unshift(parseModule(code).$ast.body[0]);
          // }

          // Recursively traverse nested nodes
          for (const key in n) {
            if (n[key] && typeof n[key] === 'object' && n[key].type) {
              traverseNode(n[key], n, key);
            }
            if (Array.isArray(n[key])) {
              n[key].forEach(() => traverseNode(n[key], n, key));
            }
          }
        };
        traverseNode(node);
      });
      return generateCode(mod);
    }
  };
}
