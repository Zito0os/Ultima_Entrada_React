// Los seis filtros escritos como sombreadores. Cada uno define aplicar() y
// comparte el mismo vertex shader y el mismo cierre, que mezcla el resultado
// con la imagen original segun la intensidad.

const VERTICE = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`

const CABECERA = `
precision mediump float;
uniform sampler2D u_tex;
uniform float u_intensidad;
uniform float u_param;
uniform vec2 u_res;
varying vec2 v_uv;
float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
`

const CIERRE = `
void main() {
  vec3 base = texture2D(u_tex, v_uv).rgb;
  gl_FragColor = vec4(mix(base, aplicar(), u_intensidad), 1.0);
}`

// El parametro de cada filtro llega en u_param con la escala de su etiqueta
const CUERPOS = {
  original: `vec3 aplicar() { return texture2D(u_tex, v_uv).rgb; }`,

  desenfoque: `
vec3 aplicar() {
  vec2 paso = vec2(u_param) / u_res;
  vec3 suma = vec3(0.0);
  float total = 0.0;
  for (int y = -2; y <= 2; y++) {
    for (int x = -2; x <= 2; x++) {
      vec2 d = vec2(float(x), float(y));
      float peso = max(1.0 - length(d) / 3.5, 0.0);
      suma += texture2D(u_tex, v_uv + d * paso).rgb * peso;
      total += peso;
    }
  }
  return suma / total;
}`,

  pixelado: `
vec3 aplicar() {
  vec2 bloque = vec2(max(u_param, 1.0)) / u_res;
  vec2 uv = (floor(v_uv / bloque) + 0.5) * bloque;
  return texture2D(u_tex, uv).rgb;
}`,

  // Rampa de color por temperatura. No es escala de grises: la luminancia solo
  // escoge el punto de la rampa.
  termica: `
vec3 aplicar() {
  float t = clamp(luma(texture2D(u_tex, v_uv).rgb) * (0.5 + u_param / 100.0), 0.0, 1.0);
  vec3 c = mix(vec3(0.0, 0.05, 0.40), vec3(0.0, 0.75, 0.45), smoothstep(0.0, 0.40, t));
  c = mix(c, vec3(1.0, 0.85, 0.0), smoothstep(0.35, 0.70, t));
  return mix(c, vec3(1.0, 0.15, 0.0), smoothstep(0.65, 1.0, t));
}`,

  color: `
vec3 aplicar() {
  vec3 c = texture2D(u_tex, v_uv).rgb;
  return mix(vec3(luma(c)), c, u_param / 100.0);
}`,

  suavizado: `
vec3 aplicar() {
  vec2 paso = vec2(1.0 + u_param / 40.0) / u_res;
  vec3 suma = vec3(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      suma += texture2D(u_tex, v_uv + vec2(float(x), float(y)) * paso).rgb;
    }
  }
  vec3 s = suma / 9.0;
  return ((s - 0.5) * 0.88 + 0.5) * 1.05;
}`,

  pastel: `
vec3 aplicar() {
  vec3 c = texture2D(u_tex, v_uv).rgb;
  vec3 s = mix(c, vec3(luma(c)), 0.45) * (u_param / 100.0);
  return clamp((s - 0.5) * 0.88 + 0.5, 0.0, 1.0);
}`,
}

function compilar(gl, tipo, fuente) {
  const sombreador = gl.createShader(tipo)
  gl.shaderSource(sombreador, fuente)
  gl.compileShader(sombreador)
  if (!gl.getShaderParameter(sombreador, gl.COMPILE_STATUS)) {
    const fallo = gl.getShaderInfoLog(sombreador)
    gl.deleteShader(sombreador)
    throw new Error(`No compilo el sombreador: ${fallo}`)
  }
  return sombreador
}

function crearPrograma(gl, cuerpo) {
  const vs = compilar(gl, gl.VERTEX_SHADER, VERTICE)
  const fs = compilar(gl, gl.FRAGMENT_SHADER, CABECERA + cuerpo + CIERRE)
  const programa = gl.createProgram()
  gl.attachShader(programa, vs)
  gl.attachShader(programa, fs)
  gl.linkProgram(programa)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) {
    throw new Error(`No enlazo el programa: ${gl.getProgramInfoLog(programa)}`)
  }
  return {
    programa,
    tex: gl.getUniformLocation(programa, 'u_tex'),
    intensidad: gl.getUniformLocation(programa, 'u_intensidad'),
    param: gl.getUniformLocation(programa, 'u_param'),
    res: gl.getUniformLocation(programa, 'u_res'),
  }
}

// Monta WebGL sobre el lienzo y deja listo un programa por filtro
export function crearMotorGL(lienzo) {
  const gl = lienzo.getContext('webgl', { preserveDrawingBuffer: true, alpha: false })
  if (!gl) {
    return null
  }

  const programas = {}
  Object.entries(CUERPOS).forEach(([id, cuerpo]) => {
    programas[id] = crearPrograma(gl, cuerpo)
  })

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

  const textura = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, textura)
  // El video viene con el origen arriba y WebGL lo espera abajo
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  // CLAMP y LINEAR para que funcione con medidas que no son potencia de dos
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  return {
    // fuente puede ser un video, una imagen o un lienzo
    dibujar(fuente, filtroId, intensidad, valor) {
      const activo = programas[filtroId] || programas.original
      const ancho = fuente.videoWidth || fuente.naturalWidth || fuente.width
      const alto = fuente.videoHeight || fuente.naturalHeight || fuente.height
      if (!ancho || !alto) {
        return false
      }
      if (lienzo.width !== ancho || lienzo.height !== alto) {
        lienzo.width = ancho
        lienzo.height = alto
      }

      gl.bindTexture(gl.TEXTURE_2D, textura)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, fuente)

      gl.viewport(0, 0, ancho, alto)
      gl.useProgram(activo.programa)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      const posicion = gl.getAttribLocation(activo.programa, 'a_pos')
      gl.enableVertexAttribArray(posicion)
      gl.vertexAttribPointer(posicion, 2, gl.FLOAT, false, 0, 0)

      gl.uniform1i(activo.tex, 0)
      gl.uniform1f(activo.intensidad, filtroId === 'original' ? 0 : intensidad / 100)
      gl.uniform1f(activo.param, valor)
      gl.uniform2f(activo.res, ancho, alto)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      return true
    },

    // Sin perder el contexto a proposito: React en modo estricto desmonta y
    // vuelve a montar, y el segundo montaje reusa el mismo lienzo
    destruir() {
      Object.values(programas).forEach((p) => gl.deleteProgram(p.programa))
      gl.deleteBuffer(buffer)
      gl.deleteTexture(textura)
    },
  }
}
