/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0A0A0A',
        'pure-black': '#000000',
        gold: '#D4AF37',
        'champagne-gold': '#F7E7CE',
        'soft-white': '#F5F5F5',
        'light-gray': '#B0B0B0',
        gray: '#808080',
      },
      spacing: {
        '15': '3.75rem',
      },
      zIndex: {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
      },
      scale: {
        '115': '1.15',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      writingMode: {
        'vertical-lr': 'vertical-lr',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Montserrat', 'sans-serif'],
        serif: ['Libre Baskerville', 'serif'],
      },
      animation: {
        'gold-shimmer': 'goldShimmer 2s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 6s ease-in-out infinite',
        'pulse-gold': 'pulse 2s ease-in-out infinite',
        'sparkle': 'sparkle 15s linear infinite',
        'scroll-down': 'scrollDown 2s infinite',
        'float': 'float 10s linear infinite',
      },
      keyframes: {
        goldShimmer: {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
            filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.5)) drop-shadow(0 0 40px rgba(212, 175, 55, 0.3))'
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            filter: 'drop-shadow(0 0 40px rgba(212, 175, 55, 0.8)) drop-shadow(0 0 60px rgba(212, 175, 55, 0.4))'
          }
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        sparkle: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-200px)' }
        },
        scrollDown: {
          'to': { top: '100%' }
        },
        float: {
          '0%': {
            opacity: '0',
            transform: 'translateY(100vh) scale(0)'
          },
          '10%': {
            opacity: '1',
            transform: 'translateY(90vh) scale(1)'
          },
          '90%': {
            opacity: '1',
            transform: 'translateY(-10vh) scale(1)'
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-20vh) scale(0)'
          }
        }
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backdropBlur: {
        'luxury': '20px',
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.writing-mode-vertical-lr': {
          'writing-mode': 'vertical-lr',
        },
        '.z-1': {
          'z-index': '1',
        },
        '.z-2': {
          'z-index': '2',
        },
        '.z-3': {
          'z-index': '3',
        },
        '.z-4': {
          'z-index': '4',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}