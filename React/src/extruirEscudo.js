import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'

import { CAPA_BASE } from './configEscudos'

// Los colores del SVG vienen en sRGB. Sin esto three los trata como lineales y
// el azul marino de los logos sale como azul cielo.
THREE.ColorManagement.enabled = true

const TAMANO = 100
// Hasta este numero de trazos, cada trazo es su propia capa. Arriba se agrupan
// por color: los logos ilustrados traen 90 trazos y quedarian como una torre.
const NIVELES = 8
// Cuanto se abre el escudo al pedir CAPAS, en unidades del modelo
const RECORRIDO = 170

// El acabado metalico se ve por lo que refleja. Sin entorno, subir METALICO solo
// apaga el color base y el modelo queda gris en vez de brillante.
export function crearEntorno(renderer) {
  const generador = new THREE.PMREMGenerator(renderer)
  const entorno = generador.fromScene(new RoomEnvironment(), 0.04).texture
  generador.dispose()
  return entorno
}

// El orden guardado tiene que ser una permutacion exacta de las capas que hay.
// Si el SVG cambio de trazos, se ignora y se vuelve al orden de dibujo.
function ordenValido(guardado, total) {
  const natural = Array.from({ length: total }, (_, indice) => indice)
  if (!Array.isArray(guardado) || guardado.length !== total) {
    return natural
  }
  const enteros = guardado.every((valor) => Number.isInteger(valor) && valor >= 0 && valor < total)
  if (!enteros || new Set(guardado).size !== total) {
    return natural
  }
  return guardado
}

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
    reflejo = 60,
    emision = 0,
    facetado = 0,
    orden: ordenGuardado = [],
    capas: ajustes = {},
  } = opciones

  const rellenos = datos.paths.filter((trazo) => trazo.userData?.style?.fill !== 'none')
  const porColor = rellenos.length > NIVELES

  // Se juntan primero para saber cuantas capas van a salir
  const claves = []
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
      claves.push(clave)
      juntas.set(clave, { color: trazo.color, formas: [], trazos: 0 })
    }
    const junta = juntas.get(clave)
    junta.formas.push(...formas)
    junta.trazos += 1
  })

  const secuencia = ordenValido(ordenGuardado, claves.length)
  const grupo = new THREE.Group()
  const capas = []
  let triangulos = 0

  secuencia.forEach((original, nivel) => {
    const junta = juntas.get(claves[original])
    const ajuste = { ...CAPA_BASE, ...(ajustes[original] || {}) }
    const grosor = Math.max(1, (profundidad * ajuste.grosor) / 100)

    const geometria = new THREE.ExtrudeGeometry(junta.formas, {
      depth: grosor,
      curveSegments: segmentos,
      bevelEnabled: bisel > 0,
      bevelThickness: bisel,
      bevelSize: bisel,
      bevelSegments: Math.max(1, Math.round(segmentos / 3)),
    })
    const propios = geometria.index ? geometria.index.count / 3 : geometria.attributes.position.count / 3
    if (ajuste.visible) {
      triangulos += propios
    }

    const tinte = ajuste.color || color
    const tono = tinte ? new THREE.Color(tinte) : (junta.color ?? new THREE.Color('#227AE6'))
    const malla = new THREE.Mesh(geometria, new THREE.MeshStandardMaterial({
      color: tono,
      metalness: metalico / 100,
      roughness: aspereza / 100,
      envMapIntensity: reflejo / 50,
      emissive: tono,
      emissiveIntensity: emision / 100,
      flatShading: facetado === 1,
      side: THREE.DoubleSide,
    }))
    malla.visible = Boolean(ajuste.visible)

    const capa = new THREE.Group()
    capa.position.z = nivel * separacion
    // El grupo se voltea en Y mas abajo, asi que aqui el signo va invertido
    capa.position.x = ajuste.x
    capa.position.y = -ajuste.y
    capa.add(malla)
    grupo.add(capa)
    capas.push(capa)
  })

  // El eje Y del SVG apunta al reves que el de three
  grupo.scale.set(1, -1, 1)

  // Centrar y llevar todos los logos al mismo tamano, sin importar su viewBox.
  // La caja incluye las capas ocultas para que el modelo no salte al apagarlas.
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
    secuencia,
    // Las capas en su orden original, para pintar el selector del personalizador
    info: claves.map((clave, indice) => {
      const junta = juntas.get(clave)
      return {
        indice,
        color: `#${(junta.color ?? new THREE.Color('#227AE6')).getHexString()}`,
        trazos: junta.trazos,
      }
    }),
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
