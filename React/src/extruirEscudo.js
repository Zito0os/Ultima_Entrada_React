import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'

const TAMANO = 100
// Los logos detallados traen 100 trazos; sin este tope el escudo se estiraria
// cientos de unidades hacia el frente y la explosion mandaria las piezas fuera.
const NIVELES = 8

// Convierte un SVG en un grupo 3D: cada trazo se extruye con su color y se
// reparte en niveles de profundidad respetando el orden de dibujo del SVG.
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
  const grupo = new THREE.Group()
  const capas = []
  let triangulos = 0
  let trazos = 0

  // separacion es el grosor total del sandwich, no el salto entre dos capas:
  // asi un logo de 2 trazos y uno de 90 quedan igual de gruesos
  const usados = Math.min(rellenos.length, NIVELES)
  const salto = usados > 1 ? separacion / (usados - 1) : 0

  const capaDe = (indice) => {
    const nivel = rellenos.length <= NIVELES ? indice : Math.floor((indice * NIVELES) / rellenos.length)
    if (!capas[nivel]) {
      const capa = new THREE.Group()
      capa.position.z = nivel * salto
      capas[nivel] = capa
      grupo.add(capa)
    }
    return capas[nivel]
  }

  rellenos.forEach((trazo, indice) => {
    const formas = SVGLoader.createShapes(trazo)
    if (!formas.length) {
      return
    }

    const geometria = new THREE.ExtrudeGeometry(formas, {
      depth: profundidad,
      curveSegments: segmentos,
      bevelEnabled: bisel > 0,
      bevelThickness: bisel,
      bevelSize: bisel,
      bevelSegments: Math.max(1, Math.round(segmentos / 3)),
    })
    triangulos += geometria.index ? geometria.index.count / 3 : geometria.attributes.position.count / 3

    const malla = new THREE.Mesh(geometria, new THREE.MeshStandardMaterial({
      color: color ? new THREE.Color(color) : (trazo.color ?? new THREE.Color('#227AE6')),
      metalness: metalico / 100,
      roughness: aspereza / 100,
      side: THREE.DoubleSide,
    }))
    capaDe(indice).add(malla)
    trazos += 1
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
    capas: capas.filter(Boolean),
    triangulos: Math.round(triangulos),
    trazos,
  }
}

export function cargarSVG(url) {
  return new Promise((resolver, rechazar) => {
    new SVGLoader().load(url, resolver, undefined, rechazar)
  })
}

// Separa las capas en profundidad y las regresa, para que se vea que el
// escudo esta hecho de capas y no de una sola pieza.
export function crearExplosion(capas, separacion = 6) {
  const base = capas.map((capa) => capa.position.z)
  const giroBase = capas.map((capa) => capa.rotation.z)
  const recorrido = Math.max(separacion, 6) * 7
  let avance = 0
  let activa = false

  const colocar = (factor) => {
    capas.forEach((capa, indice) => {
      capa.position.z = base[indice] + recorrido * factor * ((indice + 1) / capas.length)
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
