/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Stoneman brand green (from the logo wordmark #015442)
        brand: {
          50: '#edf7f3',
          100: '#d3ece2',
          200: '#a8d8c6',
          300: '#72bda2',
          400: '#3f9d7f',
          500: '#1d8165',
          600: '#0b6a52',
          700: '#015442',
          800: '#043f33',
          900: '#032c24',
          950: '#011a15',
        },
        // Sprout leaf accents
        leaf: { teal: '#0E9384', green: '#4CAF7E', lime: '#B5C74A' },
        lime: { 50: '#f7f9e8', 100: '#eef3cc', 200: '#dfe89d', 300: '#cbd96c', 400: '#b5c74a', 500: '#98ab31', 600: '#768625' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 40, 32, 0.04), 0 4px 16px -4px rgba(16, 40, 32, 0.08)',
        lift: '0 12px 32px -12px rgba(1, 84, 66, 0.28)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #011a15 0%, #015442 55%, #0b6a52 100%)',
        'leaf-gradient': 'linear-gradient(90deg, #0E9384, #4CAF7E, #B5C74A)',
      },
    },
  },
  plugins: [],
};
