import smCrypto from './index.native';
import { bytesToHex, bytesToUtf8, hexToBytes, utf8ToBytes } from './utils'

import '/assets/style.css'
document.querySelector('#app').innerHTML = `
  <div class="sidebar">
        <button id="sm2">SM2</button>
        <button id="sm3">SM3</button>
        <button id="sm4">SM4</button>
    </div>
    <div class="content">
        <div class="header">
            <h1>sm-crypto-wasm Playground</h1>
        </div>
        <div class="playground">
            <div class="settings">
                <h2>Input</h2>
                <label for="operation">Operation</label>
                <select id="operation">
                    <option value="">Select Algorithm First</option>
                </select>
                <div id="settings"></div>
                <h2>Messages</h2>
                <label for="encoding">Encoding</label>
                <select id="encoding">
                    <option value="utf8">UTF-8</option>
                    <option value="hex">Hex</option>
                </select>
                <textarea id="content" rows="4" placeholder="Input data"></textarea>
                <button id="run">Run</button>
            </div>
            <div class="output">
                <h2>Output</h2>
                <p id="output">Your output will be displayed here.</p>
            </div>
        </div>
    </div>
`
smCrypto.initSMCrypto().then(console.log)

// setup event listeners
document.getElementById('sm2').addEventListener('click', async () => {
    const select = document.getElementById('operation') as HTMLSelectElement
    // clear options
    select.innerHTML = ''
    // populate options
    Object.keys(smCrypto.sm2).forEach((keys) => {
        const option = document.createElement('option')
        option.value = keys
        option.text = keys
        select.appendChild(option)
    })
    // settings
    // sm2 public key input
    const publicKey = document.createElement('textarea')
    publicKey.placeholder = 'Public Key (hex)'
    publicKey.id = 'public-key'

    // sm2 private key input
    const privateKey = document.createElement('textarea')
    privateKey.placeholder = 'Private Key (hex)'
    privateKey.id = 'private-key'

    // sm2 signature input
    const signature = document.createElement('textarea')
    signature.placeholder = 'Signature (hex)'
    signature.id = 'signature'

    // der(asn1) toggle
    const der = document.createElement('input')
    der.type = 'checkbox'
    der.id = 'der'
    der.checked = true
    const derLabel = document.createElement('label')
    derLabel.htmlFor = 'der'
    derLabel.textContent = 'ASN.1 Encoding?'

    // hash toggle
    const hash = document.createElement('input')
    hash.type = 'checkbox'
    hash.id = 'hash'
    hash.checked = true
    const hashLabel = document.createElement('label')
    hashLabel.htmlFor = 'hash'
    hashLabel.textContent = 'Hash before signing?'
    
    const settingsContainer = document.getElementById('settings')
    settingsContainer.innerHTML = ''
    settingsContainer.appendChild(publicKey)
    settingsContainer.appendChild(privateKey)
    settingsContainer.appendChild(signature)
    settingsContainer.appendChild(derLabel)
    settingsContainer.appendChild(der)
    settingsContainer.appendChild(hashLabel)
    settingsContainer.appendChild(hash)


    // set default value
    select.value = 'generateKeyPairHex'
    const content = document.getElementById('content') as HTMLTextAreaElement
    const encoding = document.getElementById('encoding') as HTMLSelectElement

    // run button
    document.getElementById('run').addEventListener('click', async () => {
        const operation = select.value
        const output = document.getElementById('output')
        output.innerHTML = ''
        let input: any = content.value
        switch (operation) {
            case 'encrypt':
            case 'decrypt':
                if (encoding.value === 'hex') {
                    input = hexToBytes(input)
                } else {
                    input = utf8ToBytes(input)
                }
                try {
                    let result = smCrypto.sm2[operation](input, operation === 'encrypt' ? publicKey.value : privateKey.value, {
                        output: 'array',
                    }) as Uint8Array
                    const data: Record<string, string> = {
                        hex: bytesToHex(result),
                    }
                    if (operation === 'decrypt') {
                        data.utf8 = bytesToUtf8(result)
                    }
                    output.innerHTML = `<p>${JSON.stringify(data, null, 2)}</p>`
                } catch (error) {
                    console.error(error)
                    output.innerHTML = `<p>${error.toString()}</p>`
                }
                break
            case 'generateKeyPairHex':
                try {
                    const result = smCrypto.sm2[operation]()
                    output.innerHTML = `<p>${JSON.stringify(result, null, 2)}</p>`
                    // write to input fields
                    publicKey.value = result.publicKey
                    privateKey.value = result.privateKey
                } catch (error) {
                    console.error(error)
                    output.innerHTML = `<p>${error}</p>`
                }
                break
            case 'doSignature':
                if (encoding.value === 'hex') {
                    input = hexToBytes(input)
                } else {
                    input = utf8ToBytes(input)
                }
                try {
                    let result = smCrypto.sm2.doSignature(input, privateKey.value, {
                        der: der.checked,
                        hash: hash.checked,
                    })
                    output.innerHTML = `<p>${JSON.stringify(result, null, 2)}</p>`
                    signature.value = result
                } catch (error) {
                    console.error(error)
                    output.innerHTML = `<p>${error.toString()}</p>`
                }
                break
            case 'doVerifySignature':
                if (encoding.value === 'hex') {
                    input = hexToBytes(input)
                } else {
                    input = utf8ToBytes(input)
                }
                try {
                    let result = smCrypto.sm2.doVerifySignature(input, publicKey.value, signature.value, {
                        der: der.checked,
                        hash: hash.checked,
                    })
                    output.innerHTML = `<p>${JSON.stringify(result, null, 2)}</p>`
                } catch (error) {
                    console.error(error)
                    output.innerHTML = `<p>${error.toString()}</p>`
                }
                break
            case 'compressPublicKeyHex':
                try {
                    let result = smCrypto.sm2.compressPublicKeyHex(publicKey.value)
                    output.innerHTML = `<p>${JSON.stringify(result, null, 2)}</p>`
                    publicKey.value = result
                } catch (error) {
                    console.error(error)
                    output.innerHTML = `<p>${error.toString()}</p>`
                }
                break
            default:
                output.innerHTML = `<p>Operation ${operation} is not available for playground.</p>`
        }

    })
})

document.getElementById('sm3').addEventListener('click', async () => {
    const select = document.getElementById('operation') as HTMLSelectElement
    // clear options
    select.innerHTML = ''
    // populate options
    const option = document.createElement('option')
    option.value = "hash"
    option.text = "hash"
    select.appendChild(option)
    // settings
    const settingsContainer = document.getElementById('settings')
    settingsContainer.innerHTML = ''

    // hmac input
    const hmac = document.createElement('textarea')
    hmac.placeholder = 'HMAC Key (hex), optional'
    hmac.id = 'hmac'

    settingsContainer.appendChild(hmac)

    // set default value
    select.value = 'hash'
    const content = document.getElementById('content') as HTMLTextAreaElement
    const encoding = document.getElementById('encoding') as HTMLSelectElement

    // run button
    document.getElementById('run').addEventListener('click', async () => {
        const operation = select.value
        const output = document.getElementById('output')
        output.innerHTML = ''
        let input: any = content.value
        if (encoding.value === 'hex') {
            input = hexToBytes(input)
        } else {
            input = utf8ToBytes(input)
        }
        try {
            let result = smCrypto.sm3(input, {
                key: hmac.value ? hexToBytes(hmac.value) : undefined,
            })
            const data: Record<string, string> = {
                hex: bytesToHex(result),
            }
            output.innerHTML = `<p>${JSON.stringify(data, null, 2)}</p>`
        } catch (error) {
            console.error(error)
            output.innerHTML = `<p>${error.toString()}</p>`
        }
    })
})

document.getElementById('sm4').addEventListener('click', async () => {
    const select = document.getElementById('operation') as HTMLSelectElement
    // clear options
    select.innerHTML = ''
    // populate options
    Object.keys(smCrypto.sm4).forEach((keys) => {
        const option = document.createElement('option')
        option.value = keys
        option.text = keys
        select.appendChild(option)
    })
    // settings
    // sm4 key input
    const key = document.createElement('textarea')
    key.placeholder = 'Key (hex), 16 bytes, required'
    key.id = 'key'

    // sm4 iv input
    const iv = document.createElement('textarea')
    iv.placeholder = 'IV (hex), 12 bytes for gcm, 16 bytes for others, required for cbc, ctr, gcm'
    iv.id = 'iv'

    // sm4 mode input
    const mode = document.createElement('select')
    mode.id = 'mode'
    const modeOptions = ['cbc', 'ecb', 'ctr', 'gcm']
    modeOptions.forEach((option) => {
        const opt = document.createElement('option')
        opt.value = option
        opt.text = option
        mode.appendChild(opt)
    })

    // gcm aad input
    const aad = document.createElement('textarea')
    aad.placeholder = 'AAD for GCM (hex)'
    aad.id = 'aad'

    // padding toggle
    const padding = document.createElement('input')
    padding.type = 'checkbox'
    padding.id = 'padding'
    padding.checked = true
    const paddingLabel = document.createElement('label')
    paddingLabel.htmlFor = 'padding'
    paddingLabel.textContent = 'PKCS7?'


    const settingsContainer = document.getElementById('settings')
    settingsContainer.innerHTML = ''
    settingsContainer.appendChild(key)
    settingsContainer.appendChild(iv)
    settingsContainer.appendChild(mode)
    settingsContainer.appendChild(aad)
    settingsContainer.appendChild(paddingLabel)
    settingsContainer.appendChild(padding)

    // set default value
    select.value = 'encrypt'
    const content = document.getElementById('content') as HTMLTextAreaElement
    const encoding = document.getElementById('encoding') as HTMLSelectElement

    encoding.value = 'hex'
    // run button
    document.getElementById('run').addEventListener('click', async () => {
        const operation = select.value
        const output = document.getElementById('output')
        output.innerHTML = ''
        let input: any = content.value
        if (encoding.value === 'hex') {
            input = hexToBytes(input)
        } else {
            input = utf8ToBytes(input)
        }
        try {
            let result = smCrypto.sm4[operation](input, hexToBytes(key.value), {
                iv: hexToBytes(iv.value),
                output: 'array',
                mode: mode.value,
                aad: hexToBytes(aad.value),
                padding: padding.checked ? 'pkcs7' : 'none',
            }) as Uint8Array
            const data: Record<string, string> = {
                hex: bytesToHex(result),
            }
            if (operation === 'decrypt') {
                data.utf8 = bytesToUtf8(result)
            }
            output.innerHTML = `<p>${JSON.stringify(data, null, 2)}</p>`
        } catch (error) {
            console.error(error)
            output.innerHTML = `<p>${error.toString()}</p>`
        }
    })
})