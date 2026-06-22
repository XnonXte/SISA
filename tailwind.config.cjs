/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand primary — Tech Green. Used for CTAs, active nav, success states.
        primary: {
          DEFAULT: '#1DB954',
          hover: '#179443',
          tint: '#E8F5E9',
        },
        // Accent — Gamification Orange. Points, rewards, milestones, pending states.
        accent: {
          DEFAULT: '#F5A623',
          tint: '#FFFCF7',
          tint2: '#FFF8E1',
        },
        // Ink — primary text / dark surfaces (note: shipped JSX uses #1A1A1A,
        // a deeper black than the original #1A1A2E spec — this is the source of truth).
        ink: {
          DEFAULT: '#1A1A1A',
          soft: '#1A1A2E',
        },
        // Neutrals
        muted: '#707070',
        placeholder: '#9E9E9E',
        line: '#E0E0E0',
        surface: '#FAFAFA',
        'surface-alt': '#F7F9F7',
        'surface-card': '#F4F4F4',
        // Status
        danger: {
          DEFAULT: '#D32F2F',
          tint: '#FFEBEE',
        },
        success: '#4CAF50',
        warning: '#FF9800',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        h1: ['28px', { lineHeight: '1.2', letterSpacing: '-0.5px', fontWeight: '800' }],
        h2: ['18px', { lineHeight: '1.3', fontWeight: '700' }],
        h3: ['15px', { lineHeight: '1.3', fontWeight: '700' }],
        'body-md': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        'body-reg': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        overline: ['11px', { lineHeight: '1.3', fontWeight: '700', letterSpacing: '0.5px' }],
      },
      borderRadius: {
        // SISA's signature asymmetric "Geo-Curve": opposite corners square, two rounded.
        // Use as `rounded-geo-sm/DEFAULT/lg/xl` on any element; pair with `rounded-geo-flip`
        // when the curve should mirror (top-left/bottom-right instead of top-right/bottom-left).
        'geo-xs': '0px 8px 0px 8px',
        'geo-sm': '0px 12px 0px 12px',
        geo: '0px 16px 0px 16px',
        'geo-lg': '0px 20px 0px 20px',
        'geo-xl': '0px 24px 0px 24px',
        'geo-2xl': '0px 32px 0px 32px',
        'geo-xs-flip': '8px 0px 8px 0px',
        'geo-sm-flip': '12px 0px 12px 0px',
        'geo-flip': '16px 0px 16px 0px',
        'geo-lg-flip': '20px 0px 20px 0px',
        'geo-xl-flip': '24px 0px 24px 0px',
      },
      spacing: {
        // 4px-based scale already implied by the design system; named aliases for clarity.
        18: '4.5rem',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
        'card-accent': '0 2px 12px rgba(245,166,35,0.12)',
        'cta-primary': '0 4px 16px rgba(29,185,84,0.35)',
        'cta-accent': '0 4px 16px rgba(245,166,35,0.25)',
      },
      keyframes: {
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        scanLine: {
          // Matches original scanMovement: linear ping-pong 0%->100%->0%
          '0%': { top: '0%' },
          '50%': { top: '100%' },
          '100%': { top: '0%' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          from: { transform: 'scale(0.8)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        dotFade: {
          '0%, 100%': { opacity: '0.15', transform: 'scale(0.7)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        pingAnim: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(29,185,84,0.4)' },
          '50%': { transform: 'scale(1.1)', boxShadow: '0 0 0 8px rgba(29,185,84,0)' },
        },
        // Matches original truckBounce: vertical bounce, not horizontal drive
        drive: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        spin: 'spin 1s linear infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'fade-up': 'fadeUp 0.5s ease both',
        'pop-in': 'popIn 0.4s cubic-bezier(.17,.67,.35,1.3) both',
        'dot-fade': 'dotFade 1.5s ease-in-out infinite',
        'ping-brand': 'pingAnim 1.5s ease-in-out infinite',
        drive: 'drive 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
