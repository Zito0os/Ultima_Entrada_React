import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useJugador } from './almacen/useJugador'

export default function Entrar() {
  const navigate = useNavigate()
  const { acciones } = useJugador()
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [aviso, setAviso] = useState('')

  const iniciar = (event) => {
    event.preventDefault()
    if (!usuario.trim() || !contrasena) {
      setAviso('Escribe tu usuario y tu contraseña para continuar.')
      return
    }
    acciones.iniciarSesion(usuario.trim())
    navigate('/')
  }

  return (
    <main className="acceso-shell">
      <form className="acceso-content" onSubmit={iniciar}>
        <h1 className="acceso-marca">ÚLTIMA<br />ENTRADA</h1>

        <div className="acceso-panel">
          <h2 className="acceso-titulo">INICIO SESIÓN</h2>
          <div className="acceso-campos">
            <label className="acceso-campo">
              <span className="sr-only">Usuario</span>
              <input type="text" placeholder="USUARIO" value={usuario} onChange={(event) => setUsuario(event.target.value)} autoComplete="username" />
            </label>
            <label className="acceso-campo">
              <span className="sr-only">Contraseña</span>
              <input type="password" placeholder="CONTRASEÑA" value={contrasena} onChange={(event) => setContrasena(event.target.value)} autoComplete="current-password" />
            </label>
            <button className="acceso-olvide" type="button" onClick={() => setAviso('Te enviaremos un enlace de recuperación al correo de la cuenta.')}>
              OLVIDÉ MI CONTRASEÑA
            </button>
            <button className="acceso-principal" type="submit">INICIAR</button>
          </div>
        </div>

        {aviso && <p className="acceso-aviso" role="status">{aviso}</p>}

        <button className="acceso-secundario" type="button" onClick={() => navigate('/registro')}>REGISTRARME</button>
        <button className="acceso-invitado" type="button" onClick={() => navigate('/')}>ENTRAR SIN CUENTA</button>
      </form>
    </main>
  )
}
