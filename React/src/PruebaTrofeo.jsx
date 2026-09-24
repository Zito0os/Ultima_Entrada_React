import { useEffect, useMemo, useRef, useState } from 'react'

import PageHeader from './PageHeader'
import { crearBate } from './trofeo/bate'
import { montarEscenario } from './trofeo/escenario'
import { crearGuante } from './trofeo/guante'
import { crearPelota } from './trofeo/pelota'
import { crearPlaca } from './trofeo/placa'
import { crearTrofeo, formaDe } from './trofeo/trofeo'
import { buscarTrofeo } from './trofeosData'
import { teams } from './teamsData'
import { epocasDe } from './triviaData'
import './cartas/album.css'

const PIEZAS = [
  { id: 'pelota', nombre: 'PELOTA', crear: (THREE) => crearPelota(THREE) },
  { id: 'bate', nombre: 'BATE', crear: (THREE) => crearBate(THREE) },
  { id: 'guante', nombre: 'GUANTE', crear: (THREE) => crearGuante(THREE) },
  { id: 'placa', nombre: 'PLACA', crear: (THREE) => crearPlaca(THREE, { titulo: 'SERIE 1975' }) },
  { id: 'epoca', nombre: 'ÉPOCA', crear: (THREE) => armar(THREE, buscarTrofeo(`trivia-yankees-${epocasDe('yankees')[0].id}`)) },
  { id: 'final', nombre: 'FINAL', crear: (THREE) => armar(THREE, buscarTrofeo('final-1975')) },
  { id: 'equipo', nombre: 'EQUIPO' },
]

// Igual que en TrofeoGanado
function armar(THREE, trofeo) {
  return crearTrofeo(THREE, { nombre: trofeo.nombre, subtitulo: trofeo.placa, forma: formaDe(trofeo), equipo: trofeo.equipo })
}

function Visor({ crear }) {
  const nodo = useRef(null)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    let vivo = true
    let limpiar = null
    montarEscenario(nodo.current, crear, () => vivo).then((desmontar) => {
      if (!vivo) {
        desmontar?.()
        return
      }
      limpiar = desmontar
      setListo(true)
    })
    return () => {
      vivo = false
      limpiar?.()
    }
  }, [crear])

  return <div className={listo ? 'trofeo3d__escena es-listo' : 'trofeo3d__escena'} ref={nodo} />
}

// Pagina de prueba: cada pieza por separado y los tres trofeos armados, el de equipo con los 15 escudos
export default function PruebaTrofeo() {
  const [pieza, setPieza] = useState(PIEZAS[0])
  const [equipo, setEquipo] = useState(teams[0].id)
  const crear = useMemo(
    () => pieza.crear ?? ((THREE) => armar(THREE, buscarTrofeo(`trivia-${equipo}`))),
    [pieza, equipo],
  )

  return (
    <main className="prueba-shell">
      <PageHeader title="Prueba del trofeo" backTo="/perfil" />
      <section className="prueba-content prueba-trofeo">
        <div className="album__filtros" role="tablist" aria-label="Pieza del trofeo">
          {PIEZAS.map((item) => (
            <button
              className={pieza.id === item.id ? 'album__filtro is-activo' : 'album__filtro'}
              type="button"
              role="tab"
              aria-selected={pieza.id === item.id}
              onClick={() => setPieza(item)}
              key={item.id}
            >
              {item.nombre}
            </button>
          ))}
        </div>
        {pieza.id === 'equipo' && (
          <div className="album__filtros" role="tablist" aria-label="Equipo">
            {teams.map((team) => (
              <button className={equipo === team.id ? 'album__filtro is-activo' : 'album__filtro'} type="button" role="tab" aria-selected={equipo === team.id} onClick={() => setEquipo(team.id)} key={team.id}>
                {team.name}
              </button>
            ))}
          </div>
        )}
        <Visor crear={crear} key={`${pieza.id}-${equipo}`} />
      </section>
    </main>
  )
}
