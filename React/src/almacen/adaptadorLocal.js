import { normalizar } from './esquema'

const PREFIJO = 'ue_perfil'
// Claves de la version anterior, cuando cada pantalla guardaba por su cuenta
const CLAVE_USUARIO_VIEJA = 'ue_usuario'
const CLAVE_ESCUDOS_VIEJA = 'ue_config_escudos'
const CLAVE_ONBOARDING_VIEJA = 'ue_modelos_visto'

function clave(usuarioId) {
  return `${PREFIJO}:${usuarioId}`
}

function leerJSON(nombre) {
  try {
    const bruto = localStorage.getItem(nombre)
    return bruto ? JSON.parse(bruto) : null
  } catch {
    return null
  }
}

// Rescata lo que quedo guardado antes de que existiera esta capa
function rescatarViejo() {
  try {
    const usuario = localStorage.getItem(CLAVE_USUARIO_VIEJA)
    const escudos = leerJSON(CLAVE_ESCUDOS_VIEJA)
    const onboarding = localStorage.getItem(CLAVE_ONBOARDING_VIEJA) === '1'
    if (!usuario && !escudos && !onboarding) {
      return null
    }
    return normalizar({
      cuenta: usuario ? { usuario, invitado: false } : undefined,
      escudos: escudos || {},
      preferencias: { onboardingModelos: onboarding },
    })
  } catch {
    return null
  }
}

// Implementacion de la interfaz de almacen contra localStorage. Para cambiar a
// Firebase basta con otro objeto que exponga estos cuatro metodos.
export const adaptadorLocal = {
  nombre: 'local',

  async leer(usuarioId) {
    const guardado = leerJSON(clave(usuarioId))
    if (guardado) {
      return normalizar(guardado)
    }
    return rescatarViejo()
  },

  async guardar(usuarioId, perfil) {
    try {
      localStorage.setItem(clave(usuarioId), JSON.stringify(perfil))
      return true
    } catch {
      return false
    }
  },

  async borrar(usuarioId) {
    try {
      localStorage.removeItem(clave(usuarioId))
      return true
    } catch {
      return false
    }
  },

  // Se usa al iniciar sesion para llevarse el avance de invitado a la cuenta
  async mover(desdeId, haciaId) {
    const perfil = await this.leer(desdeId)
    if (!perfil) {
      return false
    }
    await this.guardar(haciaId, perfil)
    await this.borrar(desdeId)
    return true
  },
}
