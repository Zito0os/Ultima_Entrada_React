import { configDe } from '../configEscudos'
import { buscarEscudo } from '../escudosData'
import { ORO, ORO_VIEJO, crearMaterial } from './materiales'

// Escudo del equipo extruido del mismo SVG que usa el AR, todo en oro. Sale a
// 100 unidades de ancho o alto; quien lo monte lo escala.
export async function crearEscudoDorado(THREE, equipoId) {
  const { cargarSVG, extruirDesdeSVG } = await import('../extruirEscudo')
  const escudo = buscarEscudo(equipoId)
  const datos = await cargarSVG(`${import.meta.env.BASE_URL}${escudo.svg}`)
  const { objeto, capas } = extruirDesdeSVG(datos, configDe({}, escudo.id, escudo.config))

  // Las capas alternan oro pulido y oro viejo para que se lean los detalles del logo
  const materiales = [ORO, ORO_VIEJO].map((ajustes) => crearMaterial(THREE, { ...ajustes, side: THREE.DoubleSide }))
  capas.forEach((capa, nivel) => {
    capa.traverse((malla) => {
      if (malla.isMesh) {
        malla.material.dispose()
        malla.material = materiales[nivel % 2]
        malla.castShadow = true
        malla.receiveShadow = true
      }
    })
  })
  objeto.name = 'escudo'
  return objeto
}
