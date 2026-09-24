import Carta from './Carta'
import { MONEDAS_POR_REPETIDA } from './sobres'

export default function ResumenSobre({ cartas, monedasExtra, onAlbum, onOtro }) {
  return (
    <section className="resumen" aria-labelledby="resumen-titulo">
      <h2 className="resumen__titulo" id="resumen-titulo">TU SOBRE</h2>
      <ul className="resumen__rejilla">
        {cartas.map((carta, indice) => (
          <li key={indice} style={{ '--i': indice }}>
            <Carta carta={carta} />
            <span className={carta.nueva ? 'resumen__marca es-nueva' : 'resumen__marca'}>
              {carta.nueva ? 'NUEVA' : `REPETIDA +${MONEDAS_POR_REPETIDA}`}
            </span>
          </li>
        ))}
      </ul>
      {monedasExtra > 0 && <p className="resumen__monedas">+{monedasExtra} monedas por cartas repetidas</p>}
      <div className="resumen__acciones">
        <button className="resumen__boton is-principal" type="button" onClick={onAlbum}>VER EN EL ÁLBUM</button>
        <button className="resumen__boton" type="button" onClick={onOtro}>COMPRAR OTRO</button>
      </div>
    </section>
  )
}
