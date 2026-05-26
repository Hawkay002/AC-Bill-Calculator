import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: Change this to match your GitHub repo name.
// Example: if your repo is https://github.com/username/ac-calculator
// then base must be '/ac-calculator/'
//
// If you're deploying to username.github.io (no repo path), use base: '/'
export default defineConfig({
  plugins: [react()],
  base: '/AC-Bill-Calculator/',
})
