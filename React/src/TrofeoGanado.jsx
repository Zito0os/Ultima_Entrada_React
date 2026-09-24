import { useEffect, useRef, useState } from 'react'

import { sonar } from './sonidos'
import { montarEscenario } from './trofeo/escenario'
import { crearTrofeo, formaDe } from './trofeo/trofeo'

export default function TrofeoGanado({ trofeo, onCerrar, kicker = 'TROFEO NUEVO', conSonido = true }) {
  const { nombre, pista, placa } = trofeo
  const forma = formaDe(trofeo)
  const equipo = trofeo.equipo
  const contenedor = useRef(null)
  const [listo, setListo] = useState(false)
  const [fallo, setFallo] = useState(false)

  useEffect(() => {
    if (conSonido) {
      sonar('acierto')
    }
  }, [conSonido])

  useEffect(() => {
    let vivo = true
    let limpiar = null
    montarEscenario(contenedor.current, (THREE) => crearTrofeo(THREE, { nombre, subtitulo: placa, forma, equipo }), () => vivo)
      .then((desmontar) => {
        if (!vivo) {
          desmontar?.()
          return
        }
        limpiar = desmontar
        setListo(Boolean(desmontar))
      })
      // Si WebGL no arranca, queda el trofeo plano en vez de un hueco
      .catch(() => setFallo(true))

    return () => {
      vivo = false
      limpiar?.()
    }
  }, [nombre, placa, forma, equipo])

  return (
    <div className="trofeo3d" role="dialog" aria-modal="true" aria-label={`Trofeo ganado: ${nombre}`}>
      <p className="trofeo3d__kicker">{kicker}</p>
      {fallo ? (
        <svg className="trofeo3d__plano" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M20 8h24v14a12 12 0 0 1-24 0Z" fill="currentColor" />
          <path d="M20 12h-6a8 8 0 0 0 8 8M44 12h6a8 8 0 0 1-8 8" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M29 34h6v8h-6zM22 46h20v6H22z" fill="currentColor" />
        </svg>
      ) : (
        <div className={listo ? 'trofeo3d__escena es-listo' : 'trofeo3d__escena'} ref={contenedor} />
      )}
      {!fallo && <p className="trofeo3d__ayuda">GIRA CON UN DEDO · SUBE O BAJA CON DOS</p>}
      <strong className="trofeo3d__nombre">{nombre}</strong>
      {pista && <span className="trofeo3d__pista">{pista}</span>}
      <button className="next-question-button" type="button" onClick={onCerrar}>CONTINUAR</button>
    </div>
  )
}
