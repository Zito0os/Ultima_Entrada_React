import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import AperturaSobre from './cartas/AperturaSobre'
import { buscarSobre } from './cartas/sobres'

// Sin el estado de la compra no hay nada que abrir: entrar por la URL directo
// ya no regala un sobre
export default function AbrirSobre() {
  const { packId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const sobre = buscarSobre(packId)

  if (!sobre || !state?.cartas?.length) {
    return <Navigate to="/sobres" replace />
  }

  return (
    <AperturaSobre
      sobre={sobre}
      cartas={state.cartas}
      monedasExtra={state.monedasExtra}
      onAlbum={() => navigate('/album', { replace: true })}
      onOtro={() => navigate('/sobres', { replace: true })}
    />
  )
}
