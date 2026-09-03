import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'

const TAMANO = 100

// Convierte un SVG en un grupo 3D: cada trazo se extruye con su color y su capa
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

  const grupo = new THREE.Group()
  let triangulos = 0
  let capa = 0

  datos.paths.forEach((trazo) => {
    if (trazo.userData?.style?.fill === 'none') {
      return
    }

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
    malla.position.z = capa * separacion
    grupo.add(malla)
    capa += 1
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
    capas: grupo.children,
    triangulos: Math.round(triangulos),
    trazos: grupo.children.length,
  }
}

export function cargarSVG(url) {
  return new Promise((resolver, rechazar) => {
    new SVGLoader().load(url, resolver, undefined, rechazar)
  })
}

// Separa los trazos en profundidad y los regresa, para que se vea que el
// escudo esta hecho de capas y no de una sola pieza.
export function crearExplosion(capas, separacion = 6) {
  const base = capas.map((malla) => malla.position.z)
  const giroBase = capas.map((malla) => malla.rotation.z)
  const recorrido = Math.max(separacion, 6) * 7
  let avance = 0
  let activa = false

  const colocar = (factor) => {
    capas.forEach((malla, indice) => {
      malla.position.z = base[indice] + recorrido * factor * (indice + 1)
      malla.rotation.z = giroBase[indice] + factor * 0.12 * (indice % 2 ? -1 : 1)
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
