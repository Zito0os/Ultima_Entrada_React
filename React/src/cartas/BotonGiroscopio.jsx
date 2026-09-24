import { pedirGiroscopio, useGiroscopio } from './useInclinacion'

const AVISOS = {
  'requiere-https': 'El movimiento del teléfono solo funciona con conexión segura. Mueve la carta con el dedo.',
  denegado: 'Sin permiso de movimiento. Mueve la carta con el dedo.',
}

export default function BotonGiroscopio() {
  const estado = useGiroscopio()
  if (estado === 'requiere-permiso') {
    return <button className="boton-giroscopio" type="button" onClick={pedirGiroscopio}>ACTIVAR MOVIMIENTO</button>
  }
  if (AVISOS[estado]) {
    return <p className="aviso-giroscopio">{AVISOS[estado]}</p>
  }
  return null
}
