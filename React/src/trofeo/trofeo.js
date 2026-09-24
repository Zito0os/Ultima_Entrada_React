import { PERFIL_BATE, crearBate } from './bate'
import { crearEscudoDorado } from './escudo'
import { cargarGuante } from './guante'
import { ORO, crearMaterial } from './materiales'
import { PELOTA, crearPelota } from './pelota'
import { crearPlaca } from './placa'

// Como se juntan las piezas. Los bates van en miniatura y la pelota a tamano real,
// como en los trofeos de verdad. `abertura` es el angulo de cada bate contra la vertical.
export const ARMADO = {
  escalaBate: 0.45,
  abertura: Math.PI / 7.5,
  // Cuanto se separan al frente y atras para tocarse en el cruce sin atravesarse
  separacion: 0.95,
  // Trofeo de equipo: ancho mayor del escudo y alto del poste que lo levanta, en cm
  anchoEscudo: 17,
  poste: { radio: 1.2, alto: 3 },
  // Trofeo de final: el guante va a 60% y echado hacia atras para lucir la bolsa.
  // La pelota se agranda para que se lea a esa escala; adelante va en cm hacia la placa
  escalaGuante: 0.6,
  inclinacionGuante: -0.35,
  escalaPelotaGuante: 1.35,
  adelanteGuante: 2,
}

function montarBates(THREE, grupo, arriba) {
  const s = ARMADO.escalaBate
  const largo = PERFIL_BATE.at(-1)[1] * s
  const barril = Math.max(...PERFIL_BATE.map(([r]) => r)) * s
  const theta = ARMADO.abertura
  // El cruce queda a media altura de los bates, con las perillas sobre la base
  const centro = arriba + (largo / 2) * Math.cos(theta)

  for (const lado of [-1, 1]) {
    const bate = crearBate(THREE)
    bate.scale.setScalar(s)
    bate.position.y = -largo / 2
    const brazo = new THREE.Group()
    brazo.add(bate)
    brazo.position.set(0, centro, lado * ARMADO.separacion)
    brazo.rotation.z = lado * theta
    grupo.add(brazo)
  }

  // La pelota descansa entre los dos barriles
  const pelota = crearPelota(THREE)
  pelota.position.y = centro + (PELOTA.radio + barril) / Math.sin(theta)
  pelota.rotation.set(0.4, 0.6, 0)
  grupo.add(pelota)
}

async function montarEscudo(THREE, grupo, arriba, equipo) {
  const { poste } = ARMADO
  const columna = new THREE.Mesh(new THREE.CylinderGeometry(poste.radio, poste.radio, poste.alto, 32), crearMaterial(THREE, ORO))
  columna.position.y = arriba + poste.alto / 2
  columna.castShadow = true
  grupo.add(columna)

  const escudo = await crearEscudoDorado(THREE, equipo)
  escudo.scale.multiplyScalar(ARMADO.anchoEscudo / 100)
  const caja = new THREE.Box3().setFromObject(escudo)
  escudo.position.y = arriba + poste.alto - caja.min.y
  grupo.add(escudo)
}

async function montarGuante(THREE, grupo, arriba) {
  const guante = await cargarGuante(THREE)
  // La misma pelota del trofeo de bates, dentro de la bolsa y a la escala del guante
  const { bolsa } = guante.userData
  if (bolsa) {
    // Asentada en el fondo de la bolsa; con 0.3 cm de mas no roza los costados
    const pelota = crearPelota(THREE)
    pelota.scale.setScalar(ARMADO.escalaPelotaGuante)
    pelota.position.copy(bolsa.punto).addScaledVector(bolsa.normal, PELOTA.radio * ARMADO.escalaPelotaGuante + 0.3)
    pelota.rotation.set(0.4, 0.6, 0)
    guante.add(pelota)
  }
  guante.scale.setScalar(ARMADO.escalaGuante)
  guante.rotation.x = ARMADO.inclinacionGuante
  const soporte = new THREE.Group()
  soporte.add(guante)
  // El talon se asienta en el disco dorado, centrado sobre la base y corrido al frente
  const caja = new THREE.Box3().setFromObject(soporte)
  const centro = caja.getCenter(new THREE.Vector3())
  guante.position.set(-centro.x, arriba - caja.min.y - 0.3, ARMADO.adelanteGuante - centro.z)
  grupo.add(soporte)
}

// Las finales llevan el guante, las tres epocas de un equipo su escudo y lo demas bates y pelota
export function formaDe(trofeo) {
  if (trofeo.tipo === 'final') {
    return 'guante'
  }
  return trofeo.tipo === 'trivia-equipo' ? 'escudo' : 'bates'
}

export async function crearTrofeo(THREE, { nombre, subtitulo, forma = 'bates', equipo } = {}) {
  const grupo = new THREE.Group()
  const placa = await crearPlaca(THREE, { titulo: nombre, subtitulo })
  grupo.add(placa)
  const arriba = placa.userData.arriba
  if (forma === 'escudo') {
    await montarEscudo(THREE, grupo, arriba, equipo)
  } else if (forma === 'guante') {
    await montarGuante(THREE, grupo, arriba)
  } else {
    montarBates(THREE, grupo, arriba)
  }
  return grupo
}
