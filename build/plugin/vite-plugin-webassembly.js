import { parseModule, generateCode } from "magicast";

export default function webassemblyRenamePlugin(options) {
  return {
    name: 'webassembly-transform-plugin',
    async transform(code, id) {
      // Process only pkg/index.js
      if (!id.endsWith('pkg/index.js')) {
        return;
      }
      const mod = parseModule(code);
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
