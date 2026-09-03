import { adaptadorLocal } from './adaptadorLocal'

// Interfaz que tiene que cumplir cualquier almacen. Ninguna pantalla habla con
// localStorage ni con la base directamente: todas pasan por useJugador, que a
// su vez usa este objeto. Para mover el proyecto a Firebase se escribe un
// adaptadorFirebase con estos mismos metodos y se cambia la linea de abajo.
//
//   leer(usuarioId)                -> Promise<perfil | null>
//   guardar(usuarioId, perfil)     -> Promise<boolean>
//   borrar(usuarioId)              -> Promise<boolean>
//   mover(desdeId, haciaId)        -> Promise<boolean>
//
// El perfil siempre tiene la forma de PERFIL_BASE en esquema.js.
export const almacen = adaptadorLocal

export const INVITADO = 'invitado'
