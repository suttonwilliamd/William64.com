/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        green: {
          400: '#00ff99',
          600: '#00cc77',
          700: '#00aa55',
          900: '#006633'
        },
        cyan: {
          400: '#00ffee',
        },
        black: '#0d0d0d'
      },
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace']
      }
    }
  },
  plugins: []
}
