import { useEffect, useState } from 'react'

import PageHeader from './PageHeader'
import { escudos } from './escudosData'

const LADO = 640

// Convierte el SVG del escudo en la imagen que se imprime y se usa de marcador
function rasterizar(url, fondo) {
  return new Promise((resolver, rechazar) => {
    const svg = new Image()
    svg.onload = () => {
      const lienzo = document.createElement('canvas')
      lienzo.width = LADO
      lienzo.height = LADO
      const ctx = lienzo.getContext('2d')
      ctx.fillStyle = fondo
      ctx.fillRect(0, 0, LADO, LADO)

      const margen = LADO * 0.06
      const util = LADO - margen * 2
      const escala = Math.min(util / svg.width, util / svg.height)
      const ancho = svg.width * escala
      const alto = svg.height * escala
      ctx.drawImage(svg, (LADO - ancho) / 2, (LADO - alto) / 2, ancho, alto)

      resolver(lienzo.toDataURL('image/png'))
    }
    svg.onerror = rechazar
    svg.src = url
  })
}

export default function CompilarMarcador() {
  const [marcadores, setMarcadores] = useState([])

  useEffect(() => {
    Promise.all(escudos.map((escudo) => rasterizar(`${import.meta.env.BASE_URL}${escudo.svg}`, escudo.fondo)
      .then((previa) => ({ ...escudo, previa }))))
      .then(setMarcadores)
  }, [])

  const descargar = (marcador) => {
    const enlace = document.createElement('a')
    enlace.href = marcador.previa
    enlace.download = `marcador-${marcador.id}.png`
    enlace.click()
  }

  return (
    <main className="prueba-shell">
      <PageHeader title="MARCADORES" backTo="/ar" rightLabel={`${marcadores.length}`} />

      <section className="prueba-content" aria-label="Preparación de marcadores">
        <p className="compilar-intro">
          Cada escudo se convierte en una imagen de {LADO} por {LADO} sobre fondo plano. Esta es la
          imagen que se imprime y la que se sube al compilador de MindAR para generar el archivo
          .mind del equipo.
        </p>

        <div className="compilar-lista">
          {marcadores.map((marcador) => (
            <article className="compilar-fila" key={marcador.id}>
              <img src={marcador.previa} alt={`Marcador de ${marcador.nombre}`} />
              <div className="compilar-copia">
                <strong>{marcador.nombre}</strong>
                <small>{LADO} x {LADO} px</small>
              </div>
              <button className="compilar-descarga" type="button" onClick={() => descargar(marcador)}>PNG</button>
            </article>
          ))}
        </div>

        <p className="compilar-pasos">
          <b>1.</b> Descarga las imágenes.<br />
          <b>2.</b> Súbelas al compilador de MindAR, todas las de un mismo equipo en un solo lote.<br />
          <b>3.</b> Guarda el .mind que te devuelve en <code>public/marcadores/</code>.
        </p>
      </section>
    </main>
  )
}
