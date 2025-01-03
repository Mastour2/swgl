function panic(message) {
  throw new Error(message)
}

// Creates a WebGL2 rendering context and a canvas.
export function createGL(w, h) {
  const cx = document.createElement("canvas").getContext("webgl2")
  
  if (!cx) panic("Your browser not supports WebGL")
  
  configCanvas(cx.canvas, w, h) 

  document.body.appendChild(cx.canvas)  
  return cx
}

// Starts a render loop with frame timing.
export function frame(callback) {
  let prevTime = performance.now()
  
  const frameCallback = () => {
    const now = performance.now()
    const dealt = (now - prevTime) / 1000

    callback(dealt)
  
    prevTime = now
    requestAnimationFrame(frameCallback)
  }
  requestAnimationFrame(frameCallback)
}

// Creates a program from vertex and fragment shaders, and extracts uniform and attribute locations.
export function createPrograms(gl, shaders) {
  const prog = program(gl, { vertex: shaders.vertex, fragment: shaders.fragment})
  const uniforms = detectedUniforms(gl, prog)
  const attributes = detectedAttributes(gl, prog)

  return {
    program: prog, attributes, uniforms
  }
}

// Creates and links a WebGL program.
export function program(gl, {vertex, fragment}) {
  const pro = gl.createProgram()
  const v = createShader(gl, { src: vertex, type: gl.VERTEX_SHADER })
  const f = createShader(gl, { src: fragment, type: gl.FRAGMENT_SHADER })

  gl.attachShader(pro, v)
  gl.attachShader(pro, f)
  gl.linkProgram(pro)

  const status = gl.getProgramParameter(pro, gl.LINK_STATUS)

  if(!status) {
    const log = gl.getProgramInfoLog(pro)
    panic(`Cannot link program \nInfo log:\n ${log}`)
  }

  return pro
}

// Creates a WebGL buffer and uploads data to it.
// Create the buffer object in the driver and does not allocate any space in the GPU memory.
// Activate the buffer object
// Transfer the data from the main memory to the GPU memory. Memory allocation
export function createBuffer(gl, {target = gl.ARRAY_BUFFER, data = null, usage = gl.STATIC_DRAW}) {
  const buf = gl.createBuffer()
  gl.bindBuffer(target, buf)
  gl.bufferData(target, data, usage)

  return {buffer: buf, data}
}

// Configures a vertex attribute pointer.
export function setVertexAttrib(gl, {location, count = 2, type = gl.FLOAT, normalized = false, stride = 0, offset = 0, divisor = 0}) {
  if(location == -1) {
    console.warn("Attribute location not found.")
    return
  }

  gl.vertexAttribPointer(location, count, type, normalized, stride, offset)
  gl.enableVertexAttribArray(location)
      gl.vertexAttribDivisor(location, divisor);
}

// Releases WebGL resources.
export function cleanup(gl, { program = null, buffers = [], textures = [] }) {
  if (program) gl.deleteProgram(program)
  buffers.forEach(buffer => gl.deleteBuffer(buffer))
  textures.forEach(texture => gl.deleteTexture(texture))
}

// Creates and configures a texture.
export function createTexture(gl, { target = gl.TEXTURE_2D, unit, level = 0, internalformat = gl.RGBA, border = 0, format = gl.RGBA, type = gl.UNSIGNED_BYTE, data, image, offset, minFilter = gl.LINEAR, magFilter = gl.LINEAR, wrapS = gl.CLAMP_TO_EDGE, wrapT = gl.CLAMP_TO_EDGE, mip = true, flipY = false, flipX = false}) {
  const tex = gl.createTexture()
  
  if(unit != null) {
    gl.activeTexture(gl.TEXTURE0 + unit)
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY)
  // gl.pixelStorei(gl.UNPACK_FLIP_X_WEBGL, flipX)
  
  gl.bindTexture(target, tex)
  gl.texImage2D(target, level, internalformat, data.width || 1, data.height || 1, border, format, type, data)

  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(target, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE)

  if(mip) gl.generateMipmap(target)

  return tex
}

// Loads an image asynchronously.
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

// Creates a Uint8Array representing an RGBA color.
export function color(r = 255, g = 255, b = 255) {
  return new Uint8Array([r, g, b, 255])
}

// Detects and retrieves uniform locations.
export function detectedUniforms(gl, program) {
  const uniforms = {}
  const activeUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)

  for (let i = 0; i < activeUniforms; i++) {
      const info = gl.getActiveUniform(program, i)
      uniforms[info.name] = gl.getUniformLocation(program, info.name)
  }

  return uniforms
}

// Detects and retrieves attribute locations.
export function detectedAttributes(gl, program) {
  const attributes = {}
  const activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)

  for (let i = 0; i < activeAttributes; i++) {
      const info = gl.getActiveAttrib(program, i)
      attributes[info.name] = gl.getAttribLocation(program, info.name)
  }

  return attributes
}

export function defaultConfigureScene(gl) {
  viewport(gl, {x: 0, y: 0})
  clearColor(gl, { r: 170, g: 170, b: 170 })
}

// Sets the WebGL viewport.
export function viewport(gl, { x = 0, y = 0, w = gl.drawingBufferWidth, h = gl.drawingBufferHeight }) {
  gl.viewport(x, y, w, h)
}

// Sets the clear color and clears the canvas.
export function clearColor(gl, {r = 0, g = 0, b = 0, a = 1}) {
    r /= 255, g /= 255, b /= 255
    gl.clearColor(r, g, b, a)
    clean(gl)
}

// Clears the color and depth buffers.
function clean(gl) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

// Creates and compiles a shader.
function createShader(gl, {src, type}) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)

  const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

  if(!status) {
    const log = gl.getShaderInfoLog(shader)
    panic(`Cannot compile shader\nInfo log:\n ${log}`)
  }

  return shader
}

// Configures canvas dimensions and styling.
function configCanvas(cv, w, h) {
  const dpi = devicePixelRatio || 1
  cv.width = w * dpi
  cv.height = h * dpi
  
  cv.style.display = "block"
  cv.style.width = `${w}px`
  cv.style.height = `${h}px`
}


