// Abre cada .mind y reporta cuantas imagenes trae y que tan reconocible es cada
// una. Tambien avisa si escudosData.js quedo con otro conteo.
// Uso: npm run marcadores
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { decode } from '@msgpack/msgpack'

const CARPETA = 'public/marcadores'
const MINIMO_PUNTOS = 300

function resumirObjetivo(objetivo) {
  const { width, height } = objetivo.targetImage
  const buscar = objetivo.matchingData.reduce((total, nivel) => total + nivel.maximaPoints.length + nivel.minimaPoints.length, 0)
  const seguir = objetivo.trackingData.reduce((total, nivel) => total + nivel.points.length, 0)
  return { width, height, buscar, seguir }
}

// Se lee como texto para no arrastrar el resto del codigo de la app a node
const fuente = readFileSync('src/escudosData.js', 'utf8')
function marcadoresDeclarados(id) {
  const inicio = fuente.indexOf(`${id}: {`) >= 0 ? fuente.indexOf(`${id}: {`) : fuente.indexOf(`'${id}': {`)
  if (inicio < 0) {
    return 1
  }
  const bloque = fuente.slice(inicio, fuente.indexOf('}', inicio))
  const valor = bloque.split('marcadores:')[1]
  return valor ? parseInt(valor, 10) : 1
}

const archivos = readdirSync(CARPETA).filter((nombre) => nombre.endsWith('.mind')).sort()
const problemas = []

for (const archivo of archivos) {
  const id = archivo.replace('.mind', '')
  const bruto = readFileSync(join(CARPETA, archivo))
  const datos = decode(bruto)
  const objetivos = datos.dataList.map(resumirObjetivo)
  const declarado = marcadoresDeclarados(id)

  console.log(`\n${archivo}  v${datos.v}  ${objetivos.length} imagen(es)  ${Math.round(bruto.length / 1024)} KB`)
  objetivos.forEach((objetivo, indice) => {
    const debil = objetivo.buscar < MINIMO_PUNTOS
    if (debil) {
      problemas.push(`${id} imagen ${indice}: solo ${objetivo.buscar} puntos, cuesta reconocerla`)
    }
    console.log(`  ${indice}  ${objetivo.width}x${objetivo.height}  ${objetivo.buscar} puntos de busqueda  ${objetivo.seguir} de seguimiento  ${debil ? 'DEBIL' : 'ok'}`)
  })

  if (declarado !== objetivos.length) {
    problemas.push(`${id}: escudosData dice ${declarado} marcador(es) y el .mind trae ${objetivos.length}`)
  }
}

console.log(`\n${archivos.length} archivos revisados.`)
if (problemas.length) {
  console.log('\nPor revisar:')
  problemas.forEach((problema) => console.log(`  - ${problema}`))
} else {
  console.log('Todo cuadra.')
}
