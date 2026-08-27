import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El sitio se publica en https://zito0os.github.io/Ultima_Entrada_React/
const base = process.env.GITHUB_ACTIONS ? '/Ultima_Entrada_React/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
})
