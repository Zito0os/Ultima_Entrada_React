import { rutaEscudo } from './escudosData'

// Los dos clubes de una final se pintan igual: el de la Liga Americana usa el
// escudo que ya vive en public/escudos y el rival usa el suyo. Si el archivo
// todavia no esta, cae al monograma con el color del club.
export default function EscudoFinal({ equipo, tamano = 'normal' }) {
  const clase = tamano === 'grande' ? 'escudo-final es-grande' : 'escudo-final'

  return (
    <span className={clase} title={equipo.ciudad}>
      <img
        src={rutaEscudo(equipo.escudo)}
        alt=""
        aria-hidden="true"
        loading="lazy"
        onError={(evento) => {
          evento.currentTarget.hidden = true
          evento.currentTarget.nextSibling.hidden = false
        }}
      />
      <b style={{ background: equipo.color || 'var(--azul-profundo)' }} hidden>{equipo.abrev}</b>
    </span>
  )
}
