import { ORO, crearMaterial } from './materiales'

// Bate de madera profesional: 86 cm, barril de 6.6 cm y mango de 2.4 cm.
// Perfil en cm como [radio, altura], desde la perilla hasta la punta.
export const PERFIL_BATE = [
  [0, 0], [1.9, 0], [2.25, 0.25], [2.35, 0.7], [2.2, 1.2], [1.7, 1.7], [1.35, 2.3], [1.2, 3.2],
  [1.2, 10], [1.25, 20], [1.35, 28],
  [1.6, 36], [2.1, 44], [2.7, 51], [3.1, 57], [3.3, 63],
  [3.33, 72], [3.33, 80], [3.3, 83.5],
  [3.15, 84.8], [2.8, 85.6], [2.1, 86.1], [1, 86.35], [0, 86.4],
]

export function crearBate(THREE, material = crearMaterial(THREE, ORO)) {
  // centripetal no se pasa de largo en las curvas cerradas de la perilla
  const guia = new THREE.CatmullRomCurve3(PERFIL_BATE.map(([r, y]) => new THREE.Vector3(r, y, 0)), false, 'centripetal')
  const perfil = guia.getPoints(320).map((punto) => new THREE.Vector2(Math.max(0, punto.x), punto.y))
  const bate = new THREE.Mesh(new THREE.LatheGeometry(perfil, 72), material)
  bate.name = 'bate'
  bate.castShadow = true
  bate.receiveShadow = true
  return bate
}
