/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#3B82F6', // Bleu
            dark: '#1D4ED8',
            light: '#60A5FA',
          },
          secondary: {
            DEFAULT: '#1E40AF', // Bleu foncé
            light: '#3B82F6',
          }
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        }
      },
    },
    plugins: [],
  }