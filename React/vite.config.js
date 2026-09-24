import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// El sitio se publica en https://zito0os.github.io/Ultima_Entrada_React/
const base = process.env.GITHUB_ACTIONS ? '/Ultima_Entrada_React/' : '/'

// Sin https el celular no da camara ni giroscopio, asi que el servidor de
// desarrollo levanta con certificado propio. `--mode http` lo apaga, para
// navegadores que rechazan esos certificados.
export default defineConfig(({ mode }) => {
  const conHttps = mode !== 'http'
  return {
    base,
    plugins: conHttps ? [react(), basicSsl()] : [react()],
    server: {
      // Escucha en toda la red para poder abrirlo desde el celular
      host: true,
      port: 5173,
      https: conHttps,
    },
  }
})
