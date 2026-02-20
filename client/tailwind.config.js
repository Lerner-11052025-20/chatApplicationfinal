/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        surface: {
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
          elevated: 'var(--surface-elevated)',
        },
        primary: {
          DEFAULT: '#0095f6',
          light: '#4cb5f9',
          dark: '#0074cc',
        },
        secondary: '#8e44ad',
        accent: {
          pink: '#fd1d1d',
          orange: '#fcb045',
          purple: '#833ab4',
        },
        success: '#2ecc71',
        warning: '#f39c12',
        danger: '#ed4956',
        ig: {
          blue: '#0095f6',
          separator: '#efefef',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          link: 'var(--text-link)',
        },
        border: {
          light: 'var(--border-light)',
          medium: 'var(--border-medium)',
          dark: 'var(--border-dark)',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '22px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
        md: '0 4px 12px rgba(0, 0, 0, 0.08)',
        lg: '0 8px 30px rgba(0, 0, 0, 0.12)',
        xl: '0 20px 60px rgba(0, 0, 0, 0.15)',
        card: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)',
        'ig-btn': '0 4px 12px rgba(0, 149, 246, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'heart-pop': 'heartPop 1s ease forwards',
        'message-pop': 'messagePop 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
        'gradient': 'gradientShift 3s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        heartPop: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '15%': { transform: 'scale(1.3)', opacity: '1' },
          '30%': { transform: 'scale(0.95)' },
          '45%': { transform: 'scale(1.05)' },
          '60%, 100%': { transform: 'scale(1)', opacity: '0' },
        },
        messagePop: {
          '0%': { transform: 'scale(0.8) translateY(10px)', opacity: '0' },
          '50%': { transform: 'scale(1.02) translateY(-2px)' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
