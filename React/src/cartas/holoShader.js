import { DISENO, PROPORCION, rutaMapaFoil } from './diseno'
import { RUTA_DORSO, rutaCarta } from './cartasData'

const VERTICES = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vVista;

void main() {
  vUv = uv;
  vec4 posicion = modelViewMatrix * vec4(position, 1.0);
  vVista = -posicion.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * posicion;
}
`

const FRAGMENTOS = /* glsl */ `
uniform sampler2D uFrente;
uniform sampler2D uDorso;
uniform sampler2D uMapa;
uniform float uTiempo;
uniform float uChispas;
uniform float uProporcion;
uniform float uRadio;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vVista;

vec3 tono(float h) {
  return clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
}

float azar(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Distancia al borde del rectangulo redondeado: las esquinas salen sin geometria
float esquinas(vec2 uv) {
  vec2 p = (uv - 0.5) * vec2(1.0, uProporcion);
  vec2 q = abs(p) - vec2(0.5, 0.5 * uProporcion) + uRadio;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadio;
}

void main() {
  float borde = esquinas(vUv);
  if (borde > 0.0) discard;
  float alfa = 1.0 - smoothstep(-0.004, 0.0, borde);

  if (!gl_FrontFacing) {
    gl_FragColor = vec4(texture2D(uDorso, vec2(1.0 - vUv.x, vUv.y)).rgb, alfa);
    return;
  }

  vec3 vista = normalize(vVista);
  vec3 normal = normalize(vNormal);
  vec3 base = texture2D(uFrente, vUv).rgb;

  // Lo que mueve el brillo es el angulo entre la carta y la mirada
  vec2 angulo = vista.xy - normal.xy;
  vec3 mapa = texture2D(uMapa, vUv).rgb;
  float fuerzaFoil = mapa.r;

  float posicion = vUv.x * 0.6 + (1.0 - vUv.y) * 0.4;
  float brillo;
  if (mapa.b > 0.0) {
    // Faceta: prende cuando su angulo coincide con el de la luz, como el mosaico
    float faceta = mapa.b * 6.2832;
    float anguloLuz = atan(angulo.y, angulo.x);
    float alcance = min(1.0, length(angulo) * 3.0);
    brillo = 0.22 + pow(max(0.0, cos(faceta - anguloLuz)), 5.0) * alcance * 1.5;
  } else {
    // Zona lisa: una franja de luz que recorre la carta al inclinarla
    float centro = 0.5 + angulo.x * 1.4 + angulo.y * 0.9;
    float d = (posicion - centro) * 5.0;
    brillo = 0.2 + exp(-d * d) * 1.25;
  }

  // El verde del mapa trae el tono: menos de 0.5 es oro, de ahi arcoiris
  vec3 arcoiris = tono(fract((mapa.g - 0.5) / 0.47 + posicion * 1.5 + angulo.x * 1.5 + angulo.y + uTiempo * 0.02));
  vec3 dorado = vec3(1.0, 0.84 - (mapa.g / 0.47) * 0.14, 0.5 + (mapa.g / 0.47) * 0.12);
  vec3 tinte = mapa.g < 0.5 ? dorado : arcoiris;

  float fuerza = fuerzaFoil * brillo;
  // Parecido al color-dodge de la version CSS, para que las dos se vean igual
  vec3 esquivado = base / max(vec3(1.0) - tinte * 0.6, vec3(0.08));
  vec3 color = mix(base, esquivado, min(1.0, fuerza * 0.8)) + tinte * fuerza * 0.2;

  vec2 celda = floor(vUv * vec2(210.0, 294.0));
  float semilla = azar(celda);
  float destello = step(0.982, semilla) * pow(max(0.0, sin(semilla * 60.0 + angulo.x * 40.0 + angulo.y * 30.0 + uTiempo * 1.5)), 12.0);
  color += destello * fuerzaFoil * uChispas * 1.4;

  vec3 luz = normalize(vec3(-0.35, 0.55, 1.0));
  float especular = pow(max(dot(normal, normalize(luz + vista)), 0.0), 36.0);
  color += especular * (0.18 + 0.3 * fuerzaFoil);

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), alfa);
}
`

// Las texturas se dejan en lineal y el sombreador no convierte la salida: asi
// el color llega igual que en el webp, con o sin sRGB en el renderer
export function cargarTexturas(THREE, renderer, carta) {
  const cargador = new THREE.TextureLoader()
  const cargar = (url) => new Promise((resolver, rechazar) => cargador.load(url, (textura) => {
    textura.anisotropy = renderer.capabilities.getMaxAnisotropy()
    resolver(textura)
  }, undefined, () => rechazar(new Error(`No cargo ${url}`))))
  return Promise.all([cargar(rutaCarta(carta.id)), cargar(RUTA_DORSO), cargar(rutaMapaFoil(carta.id))])
    .then(([frente, dorso, mapa]) => ({ frente, dorso, mapa }))
}

export function crearCartaHolo(THREE, { frente, dorso, mapa, rareza, ancho = 1 }) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uFrente: { value: frente },
      uDorso: { value: dorso },
      uMapa: { value: mapa },
      uTiempo: { value: 0 },
      uChispas: { value: rareza === 'holo' ? 1 : 0 },
      uProporcion: { value: PROPORCION },
      uRadio: { value: DISENO.radio },
    },
    vertexShader: VERTICES,
    fragmentShader: FRAGMENTOS,
    side: THREE.DoubleSide,
    transparent: true,
  })
  const geometria = new THREE.PlaneGeometry(ancho, ancho * PROPORCION)
  const malla = new THREE.Mesh(geometria, material)

  return {
    malla,
    animar(segundos) {
      material.uniforms.uTiempo.value = segundos
    },
    liberar() {
      geometria.dispose()
      material.dispose()
      frente.dispose()
      dorso.dispose()
      mapa.dispose()
    },
  }
}
