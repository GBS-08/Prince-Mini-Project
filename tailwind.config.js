/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1320px' },
    },
    extend: {
      colors: {
        brand: {
          50: '#eef1fb',
          100: '#d9dff5',
          200: '#b3bfeb',
          300: '#8496dc',
          400: '#5a6dc7',
          500: '#3949ab',
          600: '#2a389a',
          700: '#1a237e',
          800: '#141c66',
          900: '#0d1555',
          950: '#070c33',
        },
        gold: {
          50: '#fff8ed',
          100: '#ffedd0',
          200: '#ffd79f',
          300: '#ffba63',
          400: '#ff9800',
          500: '#f57c00',
          600: '#e65100',
          700: '#bf360c',
          800: '#96300f',
          900: '#7a2a11',
        },
        leaf: {
          50: '#eef9ef',
          100: '#d5f0d8',
          200: '#ade1b3',
          300: '#81c784',
          400: '#4caf50',
          500: '#3d9440',
          600: '#388e3c',
          700: '#2c6e30',
          800: '#255828',
          900: '#1f4922',
        },
        sky: {
          400: '#64b5f6',
          500: '#2196f3',
          600: '#1976d2',
          700: '#1565c0',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
          subtle: '#f1f5f9',
          dark: '#0b1020',
          'dark-muted': '#111935',
          'dark-subtle': '#18224a',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      fontSize: {
        'display-sm': ['clamp(1.9rem,4.2vw,2.6rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2.2rem,5vw,3.4rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-lg': ['clamp(2.6rem,6.4vw,4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(15,23,42,0.06)',
        card: '0 10px 34px -12px rgba(15,23,42,0.18)',
        elevated: '0 24px 60px -20px rgba(15,23,42,0.28)',
        brand: '0 18px 40px -16px rgba(26,35,126,0.55)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.15rem',
        '3xl': '1.6rem',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg,#1a237e 0%,#2a389a 45%,#3949ab 100%)',
        'gold-gradient': 'linear-gradient(135deg,#ff9800 0%,#e65100 100%)',
        'hero-veil': 'linear-gradient(105deg,rgba(7,12,51,0.94) 0%,rgba(13,21,85,0.86) 45%,rgba(13,21,85,0.55) 100%)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
        marquee: 'marquee 32s linear infinite',
        shimmer: 'shimmer 1.6s infinite',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22,1,0.36,1)',
      },
    },
  },
  plugins: [],
}
