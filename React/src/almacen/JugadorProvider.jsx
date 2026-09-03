import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { INVITADO, almacen } from './index'
import { JugadorContexto } from './JugadorContexto'
import { CARTAS_TOTAL, PERFIL_BASE, hoy, normalizar } from './esquema'

const CLAVE_SESION = 'ue_sesion'

function leerSesion() {
  try {
    return localStorage.getItem(CLAVE_SESION) || INVITADO
  } catch {
    return INVITADO
  }
}

function guardarSesion(usuarioId) {
  try {
    localStorage.setItem(CLAVE_SESION, usuarioId)
  } catch {
    // sin almacenamiento la sesion dura lo que dure la pestana
  }
}

export function JugadorProvider({ children }) {
  const [usuarioId, setUsuarioId] = useState(leerSesion)
  const [perfil, setPerfil] = useState(null)
  const guardando = useRef(null)
  // Las acciones que necesitan consultar el saldo no pueden esperar al render
  const ultimo = useRef(null)

  useEffect(() => {
    ultimo.current = perfil
  }, [perfil])

  useEffect(() => {
    let vivo = true
    almacen.leer(usuarioId).then((guardado) => {
      if (vivo) {
        setPerfil(normalizar(guardado || PERFIL_BASE))
      }
    })
    return () => {
      vivo = false
    }
  }, [usuarioId])

  // Todas las acciones pasan por aqui: cambian el perfil en memoria y lo
  // mandan al almacen sin que la pantalla se entere de cual es
  const actualizar = useCallback((cambio) => {
    setPerfil((actual) => {
      if (!actual) {
        return actual
      }
      const siguiente = { ...actual, ...cambio(actual), actualizado: new Date().toISOString() }
      clearTimeout(guardando.current)
      guardando.current = setTimeout(() => almacen.guardar(usuarioId, siguiente), 0)
      return siguiente
    })
  }, [usuarioId])

  const acciones = useMemo(() => ({
    iniciarSesion(usuario, correo = '') {
      const id = usuario.trim().toLowerCase()
      almacen.mover(INVITADO, id).then(() => {
        guardarSesion(id)
        setUsuarioId(id)
      })
      actualizar(() => ({ cuenta: { usuario: usuario.trim(), correo, invitado: false, creada: new Date().toISOString() } }))
    },

    cerrarSesion() {
      guardarSesion(INVITADO)
      setUsuarioId(INVITADO)
    },

    ganarMonedas(cantidad) {
      actualizar((actual) => ({ monedas: actual.monedas + cantidad }))
    },

    // Regresa false si no alcanza, para que la pantalla avise en vez de dejar saldo negativo
    gastarMonedas(cantidad) {
      if ((ultimo.current?.monedas ?? 0) < cantidad) {
        return false
      }
      actualizar((actual) => ({ monedas: Math.max(0, actual.monedas - cantidad) }))
      return true
    },

    ganarTrofeo(trofeoId) {
      actualizar((actual) => (actual.trofeos.includes(trofeoId)
        ? {}
        : { trofeos: [...actual.trofeos, trofeoId] }))
    },

    guardarTrivia(equipoId, aciertos, total) {
      actualizar((actual) => {
        const previo = actual.trivia[equipoId] || { mejor: 0, jugadas: 0 }
        return {
          trivia: { ...actual.trivia, [equipoId]: { mejor: Math.max(previo.mejor, aciertos), jugadas: previo.jugadas + 1 } },
          monedas: actual.monedas + aciertos * 5 + (aciertos === total ? 30 : 0),
          trofeos: aciertos === total && !actual.trofeos.includes(`trivia-${equipoId}`)
            ? [...actual.trofeos, `trivia-${equipoId}`]
            : actual.trofeos,
        }
      })
    },

    guardarFinal(finalId, ganada, lanzamientos) {
      actualizar((actual) => {
        // El premio se paga una sola vez aunque se vuelva a abrir el resultado
        const yaGanada = actual.finales[finalId]?.ganada
        return {
          finales: { ...actual.finales, [finalId]: { ganada: ganada || yaGanada, lanzamientos } },
          monedas: actual.monedas + (ganada && !yaGanada ? 50 : 0),
          trofeos: ganada && !actual.trofeos.includes(`final-${finalId}`)
            ? [...actual.trofeos, `final-${finalId}`]
            : actual.trofeos,
        }
      })
    },

    agregarCartas(nuevas) {
      actualizar((actual) => {
        const cartas = { ...actual.cartas }
        nuevas.forEach((carta) => {
          cartas[carta.id] = (cartas[carta.id] || 0) + 1
        })
        const distintas = Object.keys(cartas).length
        const trofeos = [...actual.trofeos]
        if (distintas >= Math.ceil(CARTAS_TOTAL / 2) && !trofeos.includes('logro-album-medio')) {
          trofeos.push('logro-album-medio')
        }
        if (distintas >= CARTAS_TOTAL && !trofeos.includes('logro-album-lleno')) {
          trofeos.push('logro-album-lleno')
        }
        return { cartas, trofeos }
      })
    },

    guardarEscudo(escudoId, config) {
      actualizar((actual) => ({ escudos: { ...actual.escudos, [escudoId]: config } }))
    },

    borrarEscudo(escudoId) {
      actualizar((actual) => {
        const escudos = { ...actual.escudos }
        delete escudos[escudoId]
        return { escudos }
      })
    },

    agregarFotos(nuevas) {
      actualizar((actual) => ({ galeria: [...nuevas, ...actual.galeria] }))
    },

    borrarFoto(fotoId) {
      actualizar((actual) => ({ galeria: actual.galeria.filter((foto) => foto.id !== fotoId) }))
    },

    marcarPreferencia(clave, valor) {
      actualizar((actual) => ({ preferencias: { ...actual.preferencias, [clave]: valor } }))
    },

    // Suma un dia a la racha si la ultima visita fue ayer, la reinicia si no
    registrarVisita() {
      actualizar((actual) => {
        const dia = hoy()
        if (actual.racha.ultimoDia === dia) {
          return {}
        }
        const ayer = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
        const dias = actual.racha.ultimoDia === ayer ? actual.racha.dias + 1 : 1
        const trofeos = dias >= 7 && !actual.trofeos.includes('logro-racha-siete')
          ? [...actual.trofeos, 'logro-racha-siete']
          : actual.trofeos
        return { racha: { dias, ultimoDia: dia }, trofeos }
      })
    },

    // Se llama al anclar un escudo en AR
    registrarEscaneo(escudoId) {
      actualizar((actual) => {
        const vistos = actual.preferencias.escudosVistos || []
        if (vistos.includes(escudoId)) {
          return {}
        }
        const siguiente = [...vistos, escudoId]
        const trofeos = [...actual.trofeos]
        if (!trofeos.includes('logro-primer-escaneo')) {
          trofeos.push('logro-primer-escaneo')
        }
        if (siguiente.length >= 5 && !trofeos.includes('logro-cinco-escudos')) {
          trofeos.push('logro-cinco-escudos')
        }
        return { preferencias: { ...actual.preferencias, escudosVistos: siguiente }, trofeos }
      })
    },
  }), [actualizar])

  const valor = useMemo(() => ({ perfil, usuarioId, acciones }), [perfil, usuarioId, acciones])

  // Sin perfil no se pinta nada: con localStorage esto dura un tic y evita que
  // las pantallas se dibujen con datos de fabrica y luego salten
  if (!perfil) {
    return null
  }

  return <JugadorContexto.Provider value={valor}>{children}</JugadorContexto.Provider>
}
