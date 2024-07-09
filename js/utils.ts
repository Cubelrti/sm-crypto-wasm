export function hexToBytes(str: string) {
  const bytes = []
  for (let i = 0; i < str.length; i += 2) {
    bytes.push(parseInt(str.substr(i, 2), 16))
  }
  return new Uint8Array(bytes)
}

export function bytesToHex(bytes: Uint8Array) {
  return Array.prototype.map.call(bytes, x => ('00' + x.toString(16)).slice(-2)).join('')
}