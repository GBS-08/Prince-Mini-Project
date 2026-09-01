/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a237e',
          light: '#3949ab',
          dark: '#0d1555',
        },
        accent: {
          DEFAULT: '#4CAF50',
          dark: '#388E3C',
          light: '#81C784',
        },
        accent2: {
          DEFAULT: '#2196F3',
          dark: '#1565C0',
          light: '#64B5F6',
        },
        gold: {
          DEFAULT: '#FF9800',
          dark: '#e65100',
        },
        danger: {
          DEFAULT: '#f44336',
          dark: '#c62828',
        },
        teal: {
          DEFAULT: '#009688',
          dark: '#00695c',
        },
        mint: '#a5f3b0',
        ink: {
          dark: '#0f172a',
          body: '#374151',
          muted: '#6b7280',
          light: '#9ca3af',
        },
        surface: {
          light: '#f8fafc',
          card: '#ffffff',
          subtle: '#f1f5f9',
        },
        line: {
          DEFAULT: '#e5e7eb',
          dark: '#d1d5db',
        },
      },
      fontFamily: {
        body: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        xs: '6px',
        sm: '10px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
      },
      boxShadow: {
        xs: '0 1px 3px rgba(0,0,0,0.06)',
        sm: '0 2px 8px rgba(0,0,0,0.07)',
        md: '0 8px 28px rgba(0,0,0,0.10)',
        lg: '0 20px 56px rgba(0,0,0,0.14)',
        xl: '0 32px 80px rgba(0,0,0,0.18)',
        blue: '0 8px 28px rgba(26,35,126,0.20)',
        header: '0 2px 24px rgba(26,35,126,0.06)',
        'header-scrolled': '0 4px 40px rgba(26,35,126,0.15)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        soft: 'cubic-bezier(0.34, 1.2, 0.64, 1)',
      },
      spacing: {
        header: 'var(--header-height)',
      },
      keyframes: {
        pageFadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        headerSlideDown: {
          from: { transform: 'translateY(-100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        navItemIn: {
          from: { opacity: '0', transform: 'translateY(-14px) scale(0.88)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        chipBounce: {
          from: { transform: 'scale(0.75)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        underlineGrow: {
          from: { transform: 'scaleX(0)', opacity: '0' },
          to: { transform: 'scaleX(1)', opacity: '1' },
        },
        modalIn: {
          from: { opacity: '0', transform: 'scale(0.82) translateY(32px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        toastIn: {
          from: { opacity: '0', transform: 'translateY(24px) scale(0.9)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        toastOut: {
          from: { opacity: '1', transform: 'translateY(0)' },
          to: { opacity: '0', transform: 'translateY(-24px)' },
        },
        iconPop: {
          from: { transform: 'scale(0) rotate(-20deg)' },
          to: { transform: 'scale(1) rotate(0)' },
        },
        skeletonPulse: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        progressShimmer: { to: { backgroundPosition: '200% center' } },
        heroShimmer: {
          '0%': { backgroundPosition: '-100% center' },
          '100%': { backgroundPosition: '300% center' },
        },
        cursorBlink: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
        rippleAnim: { to: { transform: 'scale(4)', opacity: '0' } },
        heroPan: {
          from: { transform: 'scale(1) translate(0, 0)' },
          to: { transform: 'scale(1.07) translate(-1%, 1%)' },
        },
        badgeIn: {
          from: { opacity: '0', transform: 'translateY(-20px) scale(0.85)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        badgePulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(165,243,176,0)' },
          '50%': { boxShadow: '0 0 0 10px rgba(165,243,176,0.10)' },
        },
        gradientShift: {
          from: { backgroundPosition: '0% center' },
          to: { backgroundPosition: '200% center' },
        },
        bounceBall: {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
          '50%': { transform: 'translateX(-50%) translateY(10px)' },
        },
        orbFloat1: {
          from: { transform: 'translate(0, 0) scale(1)' },
          to: { transform: 'translate(-44px, 44px) scale(1.16)' },
        },
        orbFloat2: {
          from: { transform: 'translate(0, 0) scale(1)' },
          to: { transform: 'translate(52px, -32px) scale(1.12)' },
        },
        orbFloat3: {
          from: { transform: 'translate(0, 0) scale(1)' },
          to: { transform: 'translate(-22px, 28px) scale(0.88)' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        bellRing: {
          '0%, 100%': { transform: 'rotate(0)' },
          '10%, 30%': { transform: 'rotate(14deg)' },
          '20%, 40%': { transform: 'rotate(-14deg)' },
          '50%': { transform: 'rotate(0)' },
        },
        heroTitleIn: {
          from: { opacity: '0', transform: 'translateY(22px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        otpShake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-5px)' },
          '40%': { transform: 'translateX(5px)' },
          '60%': { transform: 'translateX(-3px)' },
          '80%': { transform: 'translateX(3px)' },
        },
        adsFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        adsGlowShift: { to: { backgroundPosition: '200% center' } },
        adsLauncherPulse: {
          '0%, 100%': { boxShadow: '0 8px 24px rgba(26,35,126,0.36), 0 0 0 0 rgba(76,175,80,0)' },
          '50%': { boxShadow: '0 8px 24px rgba(26,35,126,0.36), 0 0 0 10px rgba(76,175,80,0.18)' },
        },
        cardReveal: {
          from: { opacity: '0', transform: 'translateY(32px) scale(0.96)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        emptyFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        countPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(76,175,80,0)' },
          '50%': { boxShadow: '0 0 0 4px rgba(76,175,80,0.12)' },
        },
        nbBellRing: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '5%': { transform: 'rotate(18deg)' },
          '10%': { transform: 'rotate(-15deg)' },
          '15%': { transform: 'rotate(11deg)' },
          '20%': { transform: 'rotate(-7deg)' },
          '25%': { transform: 'rotate(0deg)' },
        },
        shimmerX: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        'page-fade-in': 'pageFadeIn 0.45s ease both',
        'header-slide-down': 'headerSlideDown 0.65s cubic-bezier(0.34,1.3,0.64,1) both',
        'nav-item-in': 'navItemIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        'chip-bounce': 'chipBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        'underline-grow': 'underlineGrow 0.9s cubic-bezier(0.34,1.2,0.64,1) both',
        'modal-in': 'modalIn 0.42s cubic-bezier(0.34,1.56,0.64,1) both',
        'toast-in': 'toastIn 0.42s cubic-bezier(0.34,1.56,0.64,1)',
        'toast-out': 'toastOut 0.28s ease forwards',
        'icon-pop': 'iconPop 0.38s cubic-bezier(0.34,1.56,0.64,1) both',
        'skeleton-pulse': 'skeletonPulse 1.5s ease-in-out infinite',
        'progress-shimmer': 'progressShimmer 3s linear infinite',
        'hero-shimmer': 'heroShimmer 7s ease-in-out infinite',
        'cursor-blink': 'cursorBlink 1s step-end infinite',
        ripple: 'rippleAnim 0.55s linear',
        'hero-pan': 'heroPan 22s ease-in-out infinite alternate',
        'badge-in': 'badgePulse 3s ease-in-out infinite, badgeIn 0.8s 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
        'badge-pulse': 'badgePulse 3s ease-in-out infinite',
        'card-reveal': 'cardReveal 0.52s cubic-bezier(0.34,1.2,0.64,1) both',
        'empty-float': 'emptyFloat 3s ease-in-out infinite',
        'count-pulse': 'countPulse 2.8s ease-in-out infinite',
        'nb-bell': 'nbBellRing 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 4.5s linear infinite',
        'bounce-ball': 'bounceBall 2.5s ease infinite',
        'orb-1': 'orbFloat1 14s ease-in-out infinite alternate',
        'orb-2': 'orbFloat2 17s ease-in-out infinite alternate',
        'orb-3': 'orbFloat3 10s ease-in-out infinite alternate',
        'float-y': 'floatY 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bell-ring': 'bellRing 2.4s ease-in-out infinite',
        'shimmer-x': 'shimmerX 2.4s linear infinite',
        'spin-fast': 'spin 0.75s linear infinite',
        'hero-title-in': 'heroTitleIn 0.9s cubic-bezier(0.34,1.2,0.64,1) both',
        'hero-title-in-delayed': 'heroTitleIn 0.9s 0.18s cubic-bezier(0.34,1.2,0.64,1) both',
        'hero-title-in-late': 'heroTitleIn 0.9s 0.36s cubic-bezier(0.34,1.2,0.64,1) both',
        'fade-in-up': 'fadeInUp 0.35s ease both',
        'otp-shake': 'otpShake 0.38s ease',
        'ads-float': 'adsFloat 4.5s ease-in-out infinite',
        'ads-glow': 'adsGlowShift 5s linear infinite',
        'ads-launcher-pulse': 'adsLauncherPulse 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
