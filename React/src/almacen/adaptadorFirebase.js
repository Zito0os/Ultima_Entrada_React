import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'

import { db } from '../firebase'
import { normalizar } from './esquema'
import { adaptadorLocal } from './adaptadorLocal'

const referencia = (usuarioId) => doc(db, 'usuarios', usuarioId)

export const adaptadorFirebase = {
  nombre: 'firebase',

  async leer(usuarioId) {
    if (usuarioId === 'invitado') {
      return adaptadorLocal.leer(usuarioId)
    }
    const resultado = await getDoc(referencia(usuarioId))
    return resultado.exists() ? normalizar(resultado.data()) : null
  },

  async guardar(usuarioId, perfil) {
    if (usuarioId === 'invitado') {
      return adaptadorLocal.guardar(usuarioId, perfil)
    }
    try {
      await setDoc(referencia(usuarioId), normalizar(perfil), { merge: true })
      return true
    } catch {
      return false
    }
  },

  async borrar(usuarioId) {
    if (usuarioId === 'invitado') {
      return adaptadorLocal.borrar(usuarioId)
    }
    try {
      await deleteDoc(referencia(usuarioId))
      return true
    } catch {
      return false
    }
  },

  async mover(desdeId, haciaId) {
    const perfil = await this.leer(desdeId)
    if (!perfil) {
      return false
    }
    await this.guardar(haciaId, perfil)
    if (desdeId === 'invitado') {
      await adaptadorLocal.borrar(desdeId)
    } else {
      await this.borrar(desdeId)
    }
    return true
  },
}