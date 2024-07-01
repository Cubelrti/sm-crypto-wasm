function inRange(a, b, c) {
  return b <= a && a <= c
}
function includes(a, b) {
  return a.indexOf(b) !== -1
}
var floor = Math.floor
function ToDictionary(o) {
  if (o === undefined) return {}
  if (o === Object(o)) return o
  throw TypeError('Could not convert argument to dictionary')
}
function stringToCodePoints(e) {
  var s = String(e)
  var n = s.length
  var i = 0
  var u = []
  while (i < n) {
    var c = s.charCodeAt(i)
    if (c < 0xd800 || c > 0xdfff) {
      u.push(c)
    } else if (0xdc00 <= c && c <= 0xdfff) {
      u.push(0xfffd)
    } else if (0xd800 <= c && c <= 0xdbff) {
      if (i === n - 1) {
        u.push(0xfffd)
      } else {
        var d = s.charCodeAt(i + 1)
        if (0xdc00 <= d && d <= 0xdfff) {
          var a = c & 0x3ff
          var b = d & 0x3ff
          u.push(0x10000 + (a << 10) + b)
          i += 1
        } else {
          u.push(0xfffd)
        }
      }
    }
    i += 1
  }
  return u
}
function codePointsToString(a) {
  var s = ''
  for (var i = 0; i < a.length; ++i) {
    var b = a[i]
    if (b <= 0xffff) {
      s += String.fromCharCode(b)
    } else {
      b -= 0x10000
      s += String.fromCharCode((b >> 10) + 0xd800, (b & 0x3ff) + 0xdc00)
    }
  }
  return s
}
function isASCIIByte(a) {
  return 0x00 <= a && a <= 0x7f
}
var isASCIICodePoint = isASCIIByte
var end_of_stream = -1
function Stream(a) {
  this.tokens = [].slice.call(a)
  this.tokens.reverse()
}
Stream.prototype = {
  endOfStream: function () {
    return !this.tokens.length
  },
  read: function () {
    if (!this.tokens.length) return end_of_stream
    return this.tokens.pop()
  },
  prepend: function (a) {
    if (Array.isArray(a)) {
      var b = a
      while (b.length) this.tokens.push(b.pop())
    } else {
      this.tokens.push(a)
    }
  },
  push: function (a) {
    if (Array.isArray(a)) {
      var b = a
      while (b.length) this.tokens.unshift(b.shift())
    } else {
      this.tokens.unshift(a)
    }
  },
}
var finished = -1
function decoderError(a, b) {
  if (a) throw TypeError('Decoder error')
  return b || 0xfffd
}
function encoderError(a) {
  throw TypeError('The code point ' + a + ' could not be encoded.')
}
function Decoder() { }
Decoder.prototype = { handler: function (a, b) { } }
function Encoder() { }
Encoder.prototype = { handler: function (a, b) { } }
function getEncoding(a) {
  a = String(a).trim().toLowerCase()
  if (Object.prototype.hasOwnProperty.call(label_to_encoding, a)) {
    return label_to_encoding[a]
  }
  return null
}
var encodings = [
  {
    encodings: [
      { labels: ['unicode-1-1-utf-8', 'utf-8', 'utf8'], name: 'UTF-8' },
    ],
    heading: 'The Encoding',
  },
]
var label_to_encoding = {}
encodings.forEach(function (c) {
  c.encodings.forEach(function (b) {
    b.labels.forEach(function (a) {
      label_to_encoding[a] = b
    })
  })
})
var encoders = {}
var decoders = {}
function indexCodePointFor(a, b) {
  if (!b) return null
  return b[a] || null
}
function indexPointerFor(a, b) {
  var c = b.indexOf(a)
  return c === -1 ? null : c
}
function index(a) {
  if (!('encoding-indexes' in global)) {
    throw Error(
      'Indexes missing.' +
      ' Did you forget to include encoding-indexes.js first?'
    )
  }
  return global['encoding-indexes'][a]
}
var DEFAULT_ENCODING = 'utf-8'
function TextDecoder(a, b) {
  if (!(this instanceof TextDecoder))
    throw TypeError("Called as a function. Did you forget 'new'?")
  a = a !== undefined ? String(a) : DEFAULT_ENCODING
  b = ToDictionary(b)
  this._encoding = null
  this._decoder = null
  this._ignoreBOM = false
  this._BOMseen = false
  this._error_mode = 'replacement'
  this._do_not_flush = false
  var c = getEncoding(a)
  if (c === null || c.name === 'replacement')
    throw RangeError('Unknown encoding: ' + a)
  if (!decoders[c.name]) {
    throw Error(
      'Decoder not present.' +
      ' Did you forget to include encoding-indexes.js first?'
    )
  }
  var d = this
  d._encoding = c
  if (Boolean(b['fatal'])) d._error_mode = 'fatal'
  if (Boolean(b['ignoreBOM'])) d._ignoreBOM = true
  if (!Object.defineProperty) {
    this.encoding = d._encoding.name.toLowerCase()
    this.fatal = d._error_mode === 'fatal'
    this.ignoreBOM = d._ignoreBOM
  }
  return d
}
if (Object.defineProperty) {
  Object.defineProperty(TextDecoder.prototype, 'encoding', {
    get: function () {
      return this._encoding.name.toLowerCase()
    },
  })
  Object.defineProperty(TextDecoder.prototype, 'fatal', {
    get: function () {
      return this._error_mode === 'fatal'
    },
  })
  Object.defineProperty(TextDecoder.prototype, 'ignoreBOM', {
    get: function () {
      return this._ignoreBOM
    },
  })
}
TextDecoder.prototype.decode = function decode(b, c) {
  var d
  if (typeof b === 'object' && b instanceof ArrayBuffer) {
    d = new Uint8Array(b)
  } else if (
    typeof b === 'object' &&
    'buffer' in b &&
    b.buffer instanceof ArrayBuffer
  ) {
    d = new Uint8Array(b.buffer, b.byteOffset, b.byteLength)
  } else {
    d = new Uint8Array(0)
  }
  c = ToDictionary(c)
  if (!this._do_not_flush) {
    this._decoder = decoders[this._encoding.name]({
      fatal: this._error_mode === 'fatal',
    })
    this._BOMseen = false
  }
  this._do_not_flush = Boolean(c['stream'])
  var e = new Stream(d)
  var f = []
  var g
  while (true) {
    var h = e.read()
    if (h === end_of_stream) break
    g = this._decoder.handler(e, h)
    if (g === finished) break
    if (g !== null) {
      if (Array.isArray(g)) f.push.apply(f, g)
      else f.push(g)
    }
  }
  if (!this._do_not_flush) {
    do {
      g = this._decoder.handler(e, e.read())
      if (g === finished) break
      if (g === null) continue
      if (Array.isArray(g)) f.push.apply(f, g)
      else f.push(g)
    } while (!e.endOfStream())
    this._decoder = null
  }
  function serializeStream(a) {
    if (
      includes(['UTF-8', 'UTF-16LE', 'UTF-16BE'], this._encoding.name) &&
      !this._ignoreBOM &&
      !this._BOMseen
    ) {
      if (a.length > 0 && a[0] === 0xfeff) {
        this._BOMseen = true
        a.shift()
      } else if (a.length > 0) {
        this._BOMseen = true
      } else {
      }
    }
    return codePointsToString(a)
  }
  return serializeStream.call(this, f)
}
function TextEncoder(a, b) {
  if (!(this instanceof TextEncoder))
    throw TypeError("Called as a function. Did you forget 'new'?")
  b = ToDictionary(b)
  this._encoding = null
  this._encoder = null
  this._do_not_flush = false
  this._fatal = Boolean(b['fatal']) ? 'fatal' : 'replacement'
  var c = this
  if (Boolean(b['NONSTANDARD_allowLegacyEncoding'])) {
    a = a !== undefined ? String(a) : DEFAULT_ENCODING
    var d = getEncoding(a)
    if (d === null || d.name === 'replacement')
      throw RangeError('Unknown encoding: ' + a)
    if (!encoders[d.name]) {
      throw Error(
        'Encoder not present.' +
        ' Did you forget to include encoding-indexes.js first?'
      )
    }
    c._encoding = d
  } else {
    c._encoding = getEncoding('utf-8')
  }
  if (!Object.defineProperty) this.encoding = c._encoding.name.toLowerCase()
  return c
}
if (Object.defineProperty) {
  Object.defineProperty(TextEncoder.prototype, 'encoding', {
    get: function () {
      return this._encoding.name.toLowerCase()
    },
  })
}
TextEncoder.prototype.encode = function encode(a, b) {
  a = a === undefined ? '' : String(a)
  b = ToDictionary(b)
  if (!this._do_not_flush)
    this._encoder = encoders[this._encoding.name]({
      fatal: this._fatal === 'fatal',
    })
  this._do_not_flush = Boolean(b['stream'])
  var c = new Stream(stringToCodePoints(a))
  var d = []
  var e
  while (true) {
    var f = c.read()
    if (f === end_of_stream) break
    e = this._encoder.handler(c, f)
    if (e === finished) break
    if (Array.isArray(e)) d.push.apply(d, e)
    else d.push(e)
  }
  if (!this._do_not_flush) {
    while (true) {
      e = this._encoder.handler(c, c.read())
      if (e === finished) break
      if (Array.isArray(e)) d.push.apply(d, e)
      else d.push(e)
    }
    this._encoder = null
  }
  return new Uint8Array(d)
}
function UTF8Decoder(d) {
  var e = d.fatal
  var f = 0,
    utf8_bytes_seen = 0,
    utf8_bytes_needed = 0,
    utf8_lower_boundary = 0x80,
    utf8_upper_boundary = 0xbf
  this.handler = function (a, b) {
    if (b === end_of_stream && utf8_bytes_needed !== 0) {
      utf8_bytes_needed = 0
      return decoderError(e)
    }
    if (b === end_of_stream) return finished
    if (utf8_bytes_needed === 0) {
      if (inRange(b, 0x00, 0x7f)) {
        return b
      } else if (inRange(b, 0xc2, 0xdf)) {
        utf8_bytes_needed = 1
        f = b & 0x1f
      } else if (inRange(b, 0xe0, 0xef)) {
        if (b === 0xe0) utf8_lower_boundary = 0xa0
        if (b === 0xed) utf8_upper_boundary = 0x9f
        utf8_bytes_needed = 2
        f = b & 0xf
      } else if (inRange(b, 0xf0, 0xf4)) {
        if (b === 0xf0) utf8_lower_boundary = 0x90
        if (b === 0xf4) utf8_upper_boundary = 0x8f
        utf8_bytes_needed = 3
        f = b & 0x7
      } else {
        return decoderError(e)
      }
      return null
    }
    if (!inRange(b, utf8_lower_boundary, utf8_upper_boundary)) {
      f = utf8_bytes_needed = utf8_bytes_seen = 0
      utf8_lower_boundary = 0x80
      utf8_upper_boundary = 0xbf
      a.prepend(b)
      return decoderError(e)
    }
    utf8_lower_boundary = 0x80
    utf8_upper_boundary = 0xbf
    f = (f << 6) | (b & 0x3f)
    utf8_bytes_seen += 1
    if (utf8_bytes_seen !== utf8_bytes_needed) return null
    var c = f
    f = utf8_bytes_needed = utf8_bytes_seen = 0
    return c
  }
}
function UTF8Encoder(f) {
  var g = f.fatal
  this.handler = function (a, b) {
    if (b === end_of_stream) return finished
    if (isASCIICodePoint(b)) return b
    var c, offset
    if (inRange(b, 0x0080, 0x07ff)) {
      c = 1
      offset = 0xc0
    } else if (inRange(b, 0x0800, 0xffff)) {
      c = 2
      offset = 0xe0
    } else if (inRange(b, 0x10000, 0x10ffff)) {
      c = 3
      offset = 0xf0
    }
    var d = [(b >> (6 * c)) + offset]
    while (c > 0) {
      var e = b >> (6 * (c - 1))
      d.push(0x80 | (e & 0x3f))
      c -= 1
    }
    return d
  }
}
encoders['UTF-8'] = function (a) {
  return new UTF8Encoder(a)
}
decoders['UTF-8'] = function (a) {
  return new UTF8Decoder(a)
}
var global = global || globalThis || {}
global.TextEncoder = typeof TextEncoder === 'undefined' ? TextEncoder : global.TextEncoder
global.TextDecoder = typeof TextDecoder === 'undefined' ? TextDecoder : global.TextDecoder