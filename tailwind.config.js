/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Modern cyberpunk palette
        primary: {
          DEFAULT: '#00e5a0',
          hover: '#00ffbb',
          50: '#00f0c0',
          100: '#00e5a0',
          200: '#00d080',
          300: '#00bb60',
          400: '#00a040',
          500: '#008820',
          600: '#006610',
          700: '#00440a',
          800: '#002205',
          900: '#001103'
        },
        secondary: {
          DEFAULT: '#ff6b9d',
          hover: '#ff8fab',
          50: '#ffb0d0',
          100: '#ff90c0',
          200: '#ff70b0',
          300: '#ff50a0',
          400: '#ff3090',
          500: '#ff1080',
          600: '#e00070',
          700: '#c00060',
          800: '#a00050',
          900: '#800040'
        },
        accent: {
          DEFAULT: '#7b68ee',
          50: '#a090ff',
          100: '#8a7dff',
          200: '#7b68ee',
          300: '#6a55dd',
          400: '#5a42cc',
          500: '#4a2fbb',
          600: '#3a1caa',
          700: '#2a0999',
          800: '#1a0088',
          900: '#0a0077'
        },
        background: {
          DEFAULT: '#0a0a1a',
          surface: '#12122a',
          hover: '#1a1a35'
        },
        text: {
          DEFAULT: '#e0e0ff',
          secondary: '#a0a0c0',
          tertiary: '#666680'
        },
        border: {
          DEFAULT: '#2a2a4a',
          hover: '#3a3a6a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
        retro: ['"Press Start 2P"', 'Silkscreen', 'monospace']
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px'
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 229, 160, 0.1)',
        'glow-pink': '0 0 20px rgba(255, 107, 157, 0.1)',
        'cyber-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'cyber-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'cyber-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'cyber-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: []
}
