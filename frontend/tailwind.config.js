/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6D3EF5', 
          hover: '#5A2EE3',
          light: '#F5F3FF',
          dark: '#110B30',
        },
        lavender: {
          DEFAULT: '#E8E5F9',
          light: '#F4F2FD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(109, 62, 245, 0.15)',
        'card': '0 20px 40px -15px rgba(17, 11, 48, 0.05)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        slideUp: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    },
  },
  plugins: [],
}
