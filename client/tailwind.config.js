/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5b8fc',
          400: '#8191f7',
          500: '#667eea',
          600: '#5568d3',
          700: '#4852b8',
          800: '#3e4495',
          900: '#353a76',
        },
        purple: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#764ba2',
          700: '#6d28d9',
        },
      },
      backgroundImage: {
        'gradient-real': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-fake': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      },
    },
  },
  plugins: [],
}
