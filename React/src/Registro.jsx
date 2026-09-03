import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { cartaAlAzar } from './cartasData'
import { useJugador } from './almacen/useJugador'

export default function Registro() {
  const navigate = useNavigate()
  const { acciones } = useJugador()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [aviso, setAviso] = useState('')
  const [creada, setCreada] = useState(false)

  const crear = (event) => {
    event.preventDefault()
    if (!correo.includes('@')) {
      setAviso('Escribe un correo válido.')
      return
    }
    if (contrasena.length < 6) {
      setAviso('La contraseña necesita al menos seis caracteres.')
      return
    }
    if (contrasena !== confirmar) {
      setAviso('Las dos contraseñas no coinciden.')
      return
    }
    acciones.iniciarSesion(correo.split('@')[0], correo)
    acciones.agregarCartas([cartaAlAzar(), cartaAlAzar('especial')])
    setAviso('')
    setCreada(true)
  }

  if (creada) {
    return (
      <main className="acceso-shell">
        <section className="acceso-content">
          <h1 className="acceso-marca">ÚLTIMA<br />ENTRADA</h1>
          <div className="acceso-regalo">
            <p className="acceso-regalo-kicker">CUENTA CREADA</p>
            <h2>TE TOCAN DOS<br />CARTAS DE REGALO</h2>
            <p>Úsalas para probar el escaneo desde el primer minuto.</p>
            <div className="acceso-regalo-cartas" aria-hidden="true"><span /><span /></div>
          </div>
          <button className="acceso-principal" type="button" onClick={() => navigate('/album')}>VER MI ÁLBUM</button>
          <button className="acceso-invitado" type="button" onClick={() => navigate('/')}>IR AL INICIO</button>
        </section>
      </main>
    )
  }

  return (
    <main className="acceso-shell">
      <form className="acceso-content" onSubmit={crear}>
        <h1 className="acceso-marca">ÚLTIMA<br />ENTRADA</h1>

        <div className="acceso-panel">
          <h2 className="acceso-titulo">REGISTRARSE</h2>
          <div className="acceso-campos">
            <label className="acceso-campo">
              <span className="sr-only">Correo</span>
              <input type="email" placeholder="CORREO" value={correo} onChange={(event) => setCorreo(event.target.value)} autoComplete="email" />
            </label>
            <label className="acceso-campo">
              <span className="sr-only">Contraseña</span>
              <input type="password" placeholder="CONTRASEÑA" value={contrasena} onChange={(event) => setContrasena(event.target.value)} autoComplete="new-password" />
            </label>
            <label className="acceso-campo">
              <span className="sr-only">Confirmar contraseña</span>
              <input type="password" placeholder="CONFIRMAR" value={confirmar} onChange={(event) => setConfirmar(event.target.value)} autoComplete="new-password" />
            </label>
            <button className="acceso-crear" type="submit">CREAR</button>
          </div>
        </div>

        {aviso && <p className="acceso-aviso" role="alert">{aviso}</p>}

        <button className="acceso-secundario" type="button" onClick={() => navigate('/entrar')}>YA TENGO CUENTA</button>
      </form>
    </main>
  )
}
