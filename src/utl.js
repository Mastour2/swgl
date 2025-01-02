export function createGL(w, h) {
  const cx = document.createElement("canvas").getContext("webgl2")
  configCanvas(cx.canvas, w, h) 

  document.body.appendChild(cx.canvas)  
  return cx
}

export function loop(callback) {
  let start = performance.now()
  
  const lop = () => {
    const now = performance.now()
    const dealt = (now - start) / 1000

    callback(dealt)
  
    start = now
    requestAnimationFrame(lop)
  }
  requestAnimationFrame(lop)
}

export function createProgram(gl, vertex, fragment) {
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


export function setVertexAttrib(gl, {location, size = 2, type = gl.FLOAT, normalized = false, stride = 0, offset = 0}) {
  gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
  gl.enableVertexAttribArray(location)
}

export function createTexture(gl, {target = gl.TEXTURE_2D, level = 0, internalformat = gl.RGBA, border = 0, format = gl.RGBA, type = gl.UNSIGNED_BYTE, data, offset}) {
  const tex = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0)
  // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  
  gl.bindTexture(target, tex)
  gl.texImage2D(target, level, internalformat, data.width || 1, data.height || 1, border, format, type, data)

  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  gl.generateMipmap(target)

  return tex
}

export async function loadImage(src) {
  return new Promise((res, rej) => {
    const image = new Image()
    image.src = src
  
    image.onload = () => {
      res(image)
    }

    image.onerror = error => {
      rej(error)
    }
  })
}


export function color(r = 255, g = 255, b = 255) {
  return new Uint8Array([r, g, b, 255])
}

export function detectedUniforms(gl, program) {
  const uniforms = {}
  const activeUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)

  for (let i = 0; i < activeUniforms; i++) {
      const info = gl.getActiveUniform(program, i)
      uniforms[info.name] = gl.getUniformLocation(program, info.name)
  }

  return uniforms
}

export function detectedAttributes(gl, program) {
  const attributes = {}
  const activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)

  for (let i = 0; i < activeAttributes; i++) {
      const info = gl.getActiveAttrib(program, i)
      attributes[info.name] = gl.getAttribLocation(program, info.name)
  }

  return attributes
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

