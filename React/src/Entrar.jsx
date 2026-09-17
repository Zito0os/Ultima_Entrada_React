import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { useJugador } from './almacen/useJugador'
import { auth } from './firebase'

export default function Entrar() {
  const navigate = useNavigate()
  const { acciones } = useJugador()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [aviso, setAviso] = useState('')

  const iniciar = async (event) => {
    event.preventDefault()
    if (!correo.trim() || !contrasena) {
      setAviso('Escribe tu correo y tu contraseña para continuar.')
      return
    }
    try {
      const resultado = await signInWithEmailAndPassword(auth, correo.trim(), contrasena)
      const nombre = resultado.user.displayName || correo.split('@')[0]
      await acciones.iniciarSesion(nombre, resultado.user.email || correo.trim(), resultado.user.uid)
      navigate('/')
    } catch (error) {
      setAviso(error.code === 'auth/invalid-credential'
        ? 'El correo o la contraseña no son correctos.'
        : 'No se pudo iniciar sesión. Intenta nuevamente.')
    }
  }

  return (
    <main className="acceso-shell">
      <form className="acceso-content" onSubmit={iniciar}>
        <h1 className="acceso-marca">ÚLTIMA<br />ENTRADA</h1>

        <div className="acceso-panel">
          <h2 className="acceso-titulo">INICIO SESIÓN</h2>
          <div className="acceso-campos">
            <label className="acceso-campo">
              <span className="sr-only">Correo</span>
              <input type="email" placeholder="CORREO" value={correo} onChange={(event) => setCorreo(event.target.value)} autoComplete="email" />
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
