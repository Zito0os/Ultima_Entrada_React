import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El sitio se publica en https://zito0os.github.io/Ultima_Entrada_React/
const base = process.env.GITHUB_ACTIONS ? '/Ultima_Entrada_React/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    // Escucha en toda la red para poder abrirlo desde el celular.
    // Ojo: sobre http la camara no enciende, hace falta https o localhost.
    host: true,
    port: 5173,
  },
})
