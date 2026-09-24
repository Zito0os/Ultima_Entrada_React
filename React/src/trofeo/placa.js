import { ORO_CEPILLADO, crearMaterial } from './materiales'

// Base de trofeo en dos escalones de negro piano, filete dorado y una placa
// grabada al frente. Medidas en cm: ancho y fondo son iguales porque el trofeo gira.
export const BASE = {
  zocalo: { lado: 22, alto: 5, radio: 0.5 },
  filete: { lado: 19.4, alto: 0.4 },
  cuerpo: { lado: 18, alto: 3.6, radio: 0.4 },
  soporte: { radio: 5, alto: 0.6 },
  placa: { ancho: 15, alto: 3.4, grueso: 0.12 },
}

// Con el reflejo completo el cuarto claro lo vuelve gris
const NEGRO_PIANO = { color: 0x010101, roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.3 }
const FUENTE = '"IBM Plex Sans", "Arial Black", sans-serif'

// La cara de la placa: oro cepillado con el texto grabado en oscuro
async function grabar(THREE, titulo, subtitulo) {
  await document.fonts?.load(`700 80px ${FUENTE}`).catch(() => {})
  const lienzo = document.createElement('canvas')
  lienzo.width = 1024
  lienzo.height = Math.round((1024 * BASE.placa.alto) / BASE.placa.ancho)
  const { width: w, height: h } = lienzo
  const ctx = lienzo.getContext('2d')

  ctx.fillStyle = '#F2C45A'
  ctx.fillRect(0, 0, w, h)
  for (let y = 0; y < h; y += 1) {
    ctx.fillStyle = `rgba(${Math.random() < 0.5 ? '255,255,255' : '120,80,20'}, ${Math.random() * 0.12})`
    ctx.fillRect(0, y, w, 1)
  }

  const tinta = '#3E2C0C'
  ctx.strokeStyle = tinta
  ctx.lineWidth = 4
  ctx.strokeRect(18, 18, w - 36, h - 36)
  ctx.lineWidth = 1.5
  ctx.strokeRect(28, 28, w - 56, h - 56)

  ctx.fillStyle = tinta
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `600 26px ${FUENTE}`
  ctx.letterSpacing = '10px'
  ctx.fillText(subtitulo, w / 2, h * 0.3)
  let tam = 84
  ctx.letterSpacing = '4px'
  do {
    ctx.font = `700 ${tam}px ${FUENTE}`
    tam -= 2
  } while (ctx.measureText(titulo).width > w * 0.84 && tam > 20)
  ctx.fillText(titulo, w / 2, h * 0.64)

  const textura = new THREE.CanvasTexture(lienzo)
  textura.encoding = THREE.sRGBEncoding
  textura.anisotropy = 4
  return textura
}

export async function crearPlaca(THREE, { titulo = 'CAMPEÓN', subtitulo = 'ÚLTIMA ENTRADA' } = {}) {
  // Import dinamico: estatico metia three entero en el paquete principal
  const { RoundedBoxGeometry } = await import('three/examples/jsm/geometries/RoundedBoxGeometry.js')
  const { zocalo, filete, cuerpo, soporte, placa } = BASE
  const grupo = new THREE.Group()
  grupo.name = 'placa'
  const negro = crearMaterial(THREE, NEGRO_PIANO, THREE.MeshPhysicalMaterial)
  const oro = crearMaterial(THREE, ORO_CEPILLADO)

  const poner = (malla, y) => {
    malla.position.y = y
    malla.castShadow = true
    malla.receiveShadow = true
    grupo.add(malla)
    return malla
  }

  let y = 0
  poner(new THREE.Mesh(new RoundedBoxGeometry(zocalo.lado, zocalo.alto, zocalo.lado, 4, zocalo.radio), negro), y + zocalo.alto / 2)
  y += zocalo.alto
  poner(new THREE.Mesh(new THREE.BoxGeometry(filete.lado, filete.alto, filete.lado), oro), y + filete.alto / 2)
  y += filete.alto
  poner(new THREE.Mesh(new RoundedBoxGeometry(cuerpo.lado, cuerpo.alto, cuerpo.lado, 4, cuerpo.radio), negro), y + cuerpo.alto / 2)
  y += cuerpo.alto
  poner(new THREE.Mesh(new THREE.CylinderGeometry(soporte.radio, soporte.radio * 1.08, soporte.alto, 64), oro), y + soporte.alto / 2)
  y += soporte.alto

  // Solo la cara del frente lleva el grabado; las demas son oro liso
  const grabado = crearMaterial(THREE, { ...ORO_CEPILLADO, color: 0xffffff, map: await grabar(THREE, titulo, subtitulo) })
  const caras = [oro, oro, oro, oro, grabado, oro]
  const frente = poner(new THREE.Mesh(new THREE.BoxGeometry(placa.ancho, placa.alto, placa.grueso), caras), zocalo.alto / 2)
  frente.position.z = zocalo.lado / 2 + placa.grueso / 2

  // Donde se monta lo de arriba
  grupo.userData.arriba = y
  return grupo
}
