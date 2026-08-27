const CLAVE = 'ue_usuario'

export function guardarUsuario(nombre) {
  try {
    localStorage.setItem(CLAVE, nombre)
  } catch {
    // navegador con almacenamiento bloqueado: la app sigue funcionando sin cuenta
  }
}

export function leerUsuario() {
  try {
    return localStorage.getItem(CLAVE) || ''
  } catch {
    return ''
  }
}
