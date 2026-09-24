const RADIO = 26
const VUELTA = 2 * Math.PI * RADIO

// Reloj circular: el arco se vacia con el tiempo y se pone rojo al final
export default function RelojTrivia({ restante, total, urgente, detenido }) {
  const parte = Math.max(0, Math.min(1, restante / total))
  const clases = ['trivia-reloj', urgente ? 'es-urgente' : '', detenido ? 'es-detenido' : ''].filter(Boolean).join(' ')

  return (
    <div className={clases} role="timer" aria-label={`Quedan ${restante} segundos`}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle className="trivia-reloj__pista" cx="32" cy="32" r={RADIO} />
        <circle
          className="trivia-reloj__arco"
          cx="32"
          cy="32"
          r={RADIO}
          strokeDasharray={VUELTA}
          strokeDashoffset={VUELTA * (1 - parte)}
        />
      </svg>
      <strong>{restante}</strong>
    </div>
  )
}
