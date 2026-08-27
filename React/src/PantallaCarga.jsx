import { useEffect, useState } from 'react'

const poses = [1, 2, 3]

export default function PantallaCarga({ onDone, duration = 2800 }) {
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const salida = setTimeout(() => setIsLeaving(true), duration - 400)
    const fin = setTimeout(onDone, duration)
    return () => {
      clearTimeout(salida)
      clearTimeout(fin)
    }
  }, [duration, onDone])

  return (
    <div className={isLeaving ? 'splash-shell is-leaving' : 'splash-shell'} role="status" aria-label="Cargando ÚLTIMA ENTRADA">
      <div className="splash-stage">
        <div className="splash-batter" aria-hidden="true">
          {poses.map((pose, index) => (
            <img src={`${import.meta.env.BASE_URL}bateador/pose-${pose}.png`} alt="" style={{ '--pose': index }} key={pose} />
          ))}
        </div>
        <h1 className="splash-title">ÚLTIMA<br />ENTRADA</h1>
      </div>
      <div className="splash-progress" aria-hidden="true"><span /></div>
      <p className="splash-note">LIGA AMERICANA · REALIDAD AUMENTADA</p>
    </div>
  )
}
