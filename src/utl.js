export function createCanvas(w, h) {
  const cx = document.createElement("canvas").getContext("webgl2")
  configCanvas(cx.canvas, w, h) 

  document.body.appendChild(cx.canvas)  
  return cx
}

export function loop(callback) {
  let start = performance.now()
  
  const lo = () => {
    const now = performance.now()
    const dealt = (now - start) / 1000

    callback(dealt)
  
    start = now
    requestAnimationFrame(lo)
  }
  requestAnimationFrame(lo)
}

export function program(gl, {vertex, fragment}) {
  const pro = gl.createProgram()
  const v = createShader(gl, { src: vertex, type: gl.VERTEX_SHADER })
  const f = createShader(gl, { src: fragment, type: gl.FRAGMENT_SHADER })

  gl.attachShader(pro, v)
  gl.attachShader(pro, f)
  gl.linkProgram(pro)

  const status = gl.getProgramParameter(pro, gl.LINK_STATUS)

  if(!status) {
    const log = gl.getProgramInfoLog(shader)
    throw new Error(`Cannot link program \nInfo log:\n ${log}`);
  }

  return pro
}

export function createBuffer(gl, {target = gl.ARRAY_BUFFER, size, usage = gl.STATIC_DRAW}) {
  const buf = gl.createBuffer()
  gl.bindBuffer(target, buf)
  gl.bufferData(target, size, usage)

  return buf
}

export function createTexture(gl, {target, level, internalformat, w, h, border, format, type, data, srcOffset}) {
  const tex = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0)
  // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, px)


  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  gl.generateMipmap(gl.TEXTURE_2D)


  return tex
}


export function color(r = 255, g = 255, b = 255) {
  return new Uint8Array([r, g, b, 255])
}


function createShader(gl, {src, type}) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)

  const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

  if(!status) {
    const log = gl.getShaderInfoLog(shader)
    throw new Error(`Cannot compile shader\nInfo log:\n ${log}`);
  }

  return shader
}


function configCanvas(cv, w, h) {
  const dpi = devicePixelRatio || 1
  cv.width = w * dpi
  cv.height = h * dpi
  
  cv.style.display = "block"
  cv.style.width = `${w}px`
  cv.style.height = `${h}px`
}

