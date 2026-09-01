import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'

const TAMANO = 100

// Convierte un SVG en un grupo 3D: cada trazo se extruye con su color y su capa
export function extruirDesdeSVG(datos, { profundidad = 16, bisel = 1.5, segmentos = 4, separacion = 6, color = null } = {}) {
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
      metalness: 0.25,
      roughness: 0.45,
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

  return { objeto: contenedor, triangulos: Math.round(triangulos), trazos: grupo.children.length }
}

export function cargarSVG(url) {
  return new Promise((resolver, rechazar) => {
    new SVGLoader().load(url, resolver, undefined, rechazar)
  })
}
