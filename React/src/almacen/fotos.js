import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'

import { db } from '../firebase'
import { INVITADO } from './index'

// Las imagenes de la galeria van aparte del perfil, una por documento en
// usuarios/{uid}/fotos: el perfil se reescribe en cada cambio y Firestore
// no acepta documentos de mas de 1 MB. El invitado las guarda en IndexedDB.
const LADO_MAXIMO = 1280
const PESO_MAXIMO = 900000
const BASE_LOCAL = 'ue_fotos'
const TABLA = 'imagenes'

const cache = new Map()
const llave = (usuarioId, fotoId) => `${usuarioId}/${fotoId}`

// Reduce la captura a JPEG hasta que quepa en un documento
export function comprimir(lienzo) {
  const escala = Math.min(1, LADO_MAXIMO / Math.max(lienzo.width, lienzo.height))
  const salida = document.createElement('canvas')
  salida.width = Math.round(lienzo.width * escala)
  salida.height = Math.round(lienzo.height * escala)
  salida.getContext('2d').drawImage(lienzo, 0, 0, salida.width, salida.height)
  let calidad = 0.85
  let datos = salida.toDataURL('image/jpeg', calidad)
  while (datos.length > PESO_MAXIMO && calidad > 0.3) {
    calidad -= 0.1
    datos = salida.toDataURL('image/jpeg', calidad)
  }
  return datos
}

function abrirLocal() {
  return new Promise((resolver, rechazar) => {
    const peticion = indexedDB.open(BASE_LOCAL, 1)
    peticion.onupgradeneeded = () => peticion.result.createObjectStore(TABLA)
    peticion.onsuccess = () => resolver(peticion.result)
    peticion.onerror = () => rechazar(peticion.error)
  })
}

async function local(modo, operar) {
  const base = await abrirLocal()
  return new Promise((resolver, rechazar) => {
    const peticion = operar(base.transaction(TABLA, modo).objectStore(TABLA))
    peticion.onsuccess = () => resolver(peticion.result)
    peticion.onerror = () => rechazar(peticion.error)
  })
}

const documento = (usuarioId, fotoId) => doc(db, 'usuarios', usuarioId, 'fotos', fotoId)

export async function guardarImagen(usuarioId, fotoId, imagen) {
  if (usuarioId === INVITADO) {
    await local('readwrite', (tabla) => tabla.put(imagen, llave(usuarioId, fotoId)))
  } else {
    await setDoc(documento(usuarioId, fotoId), { imagen })
  }
  cache.set(llave(usuarioId, fotoId), imagen)
}

export async function leerImagen(usuarioId, fotoId) {
  const clave = llave(usuarioId, fotoId)
  if (cache.has(clave)) {
    return cache.get(clave)
  }
  let imagen
  if (usuarioId === INVITADO) {
    imagen = (await local('readonly', (tabla) => tabla.get(clave))) ?? null
  } else {
    const resultado = await getDoc(documento(usuarioId, fotoId))
    imagen = resultado.exists() ? resultado.data().imagen : null
  }
  if (imagen) {
    cache.set(clave, imagen)
  }
  return imagen
}

export async function borrarImagen(usuarioId, fotoId) {
  cache.delete(llave(usuarioId, fotoId))
  if (usuarioId === INVITADO) {
    await local('readwrite', (tabla) => tabla.delete(llave(usuarioId, fotoId)))
  } else {
    await deleteDoc(documento(usuarioId, fotoId))
  }
}

// Al crear cuenta, las fotos del invitado se van con el resto del perfil
export async function moverImagenes(desdeId, haciaId, fotoIds) {
  for (const fotoId of fotoIds) {
    const imagen = await leerImagen(desdeId, fotoId)
    if (imagen) {
      await guardarImagen(haciaId, fotoId, imagen)
      await borrarImagen(desdeId, fotoId)
    }
  }
}

// Sin await: si tarda, el navegador ya no cuenta el toque y niega compartir
function aArchivo(datos, nombre) {
  const [cabecera, base64] = datos.split(',')
  const tipo = cabecera.slice(5, cabecera.indexOf(';'))
  const bytes = Uint8Array.from(atob(base64), (letra) => letra.charCodeAt(0))
  return new File([bytes], nombre, { type: tipo })
}

function nombreArchivo(foto, indice) {
  const limpio = foto.nombre.normalize('NFD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').toLowerCase()
  return `ultima-entrada-${limpio || 'foto'}-${indice + 1}.jpg`
}

// En el celular abre el menu de compartir, que trae Guardar imagen. Si no hay, se descargan.
export async function exportarFotos(usuarioId, fotos) {
  const archivos = []
  for (const [indice, foto] of fotos.entries()) {
    const datos = cache.get(llave(usuarioId, foto.id)) ?? await leerImagen(usuarioId, foto.id)
    if (datos) {
      archivos.push(aArchivo(datos, nombreArchivo(foto, indice)))
    }
  }
  if (navigator.canShare?.({ files: archivos })) {
    try {
      await navigator.share({ files: archivos })
      return
    } catch (error) {
      if (error.name === 'AbortError') {
        return
      }
    }
  }
  archivos.forEach((archivo) => {
    const enlace = document.createElement('a')
    enlace.href = URL.createObjectURL(archivo)
    enlace.download = archivo.name
    enlace.click()
    setTimeout(() => URL.revokeObjectURL(enlace.href), 1000)
  })
}
