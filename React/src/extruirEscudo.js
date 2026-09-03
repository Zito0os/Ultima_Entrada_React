import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'

// Los colores del SVG vienen en sRGB. Sin esto three los trata como lineales y
// el azul marino de los logos sale como azul cielo.
THREE.ColorManagement.enabled = true

const TAMANO = 100
// Hasta este numero de trazos, cada trazo es su propia capa. Arriba se agrupan
// por color: los logos ilustrados traen 90 trazos y quedarian como una torre.
const NIVELES = 8
// Cuanto se abre el escudo al pedir CAPAS, en unidades del modelo
const RECORRIDO = 170

// Convierte un SVG en un grupo 3D de capas, respetando el orden de dibujo
export function extruirDesdeSVG(datos, opciones = {}) {
  const {
    profundidad = 16,
    bisel = 1.5,
    segmentos = 4,
    separacion = 6,
    color = null,
    metalico = 25,
    aspereza = 45,
  } = opciones

  const rellenos = datos.paths.filter((trazo) => trazo.userData?.style?.fill !== 'none')
  const porColor = rellenos.length > NIVELES

  // Se juntan primero para saber cuantas capas van a salir
  const orden = []
  const juntas = new Map()
  let trazos = 0

  rellenos.forEach((trazo, indice) => {
    const formas = SVGLoader.createShapes(trazo)
    if (!formas.length) {
      return
    }
    trazos += 1
    const clave = porColor ? (trazo.userData?.style?.fill || 'sin-color') : `trazo-${indice}`
    if (!juntas.has(clave)) {
      orden.push(clave)
      juntas.set(clave, { color: trazo.color, formas: [] })
    }
    juntas.get(clave).formas.push(...formas)
  })

  const grupo = new THREE.Group()
  const capas = []
  let triangulos = 0

  orden.forEach((clave, nivel) => {
    const junta = juntas.get(clave)
    const geometria = new THREE.ExtrudeGeometry(junta.formas, {
      depth: profundidad,
      curveSegments: segmentos,
      bevelEnabled: bisel > 0,
      bevelThickness: bisel,
      bevelSize: bisel,
      bevelSegments: Math.max(1, Math.round(segmentos / 3)),
    })
    triangulos += geometria.index ? geometria.index.count / 3 : geometria.attributes.position.count / 3

    const malla = new THREE.Mesh(geometria, new THREE.MeshStandardMaterial({
      color: color ? new THREE.Color(color) : (junta.color ?? new THREE.Color('#227AE6')),
      metalness: metalico / 100,
      roughness: aspereza / 100,
      side: THREE.DoubleSide,
    }))

    const capa = new THREE.Group()
    capa.position.z = nivel * separacion
    capa.add(malla)
    grupo.add(capa)
    capas.push(capa)
  })

  // El eje Y del SVG apunta al reves que el de three
  grupo.scale.set(1, -1, 1)

  // Centrar y llevar todos los logos al mismo tamano, sin importar su viewBox
  const caja = new THREE.Box3().setFromObject(grupo)
  const centro = caja.getCenter(new THREE.Vector3())
  const medida = caja.getSize(new THREE.Vector3())
  const mayor = Math.max(medida.x, medida.y) || 1

  const contenedor = new THREE.Group()
  grupo.position.sub(centro)
  contenedor.add(grupo)
  contenedor.scale.multiplyScalar(TAMANO / mayor)

  return {
    objeto: contenedor,
    capas,
    triangulos: Math.round(triangulos),
    trazos,
    agrupado: porColor,
  }
}

export function cargarSVG(url) {
  return new Promise((resolver, rechazar) => {
    new SVGLoader().load(url, resolver, undefined, rechazar)
  })
}

// Separa las capas en profundidad y las regresa, para que se vea que el
// escudo esta hecho de capas y no de una sola pieza.
export function crearExplosion(capas) {
  const base = capas.map((capa) => capa.position.z)
  const giroBase = capas.map((capa) => capa.rotation.z)
  // Se reparte un recorrido fijo entre las capas que haya, para que el hueco
  // entre dos siempre sea mas grande que el grosor de la extrusion
  const paso = RECORRIDO / Math.max(1, capas.length)
  let avance = 0
  let activa = false

  const colocar = (factor) => {
    capas.forEach((capa, indice) => {
      capa.position.z = base[indice] + paso * factor * (indice + 1)
      capa.rotation.z = giroBase[indice] + factor * 0.12 * (indice % 2 ? -1 : 1)
    })
  }

  return {
    get activa() {
      return activa
    },
    disparar() {
      if (activa) {
        return
      }
      activa = true
      avance = 0
    },
    animar() {
      if (!activa) {
        return
      }
      avance += 0.018
      if (avance >= 1) {
        activa = false
        colocar(0)
        return
      }
      // Sube y baja en un solo movimiento suave
      colocar(Math.sin(avance * Math.PI))
    },
  }
}
