// tailwind.config.ts - ENHANCED VERSION WITH PREMIUM ANIMATIONS
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  safelist: [
    // PRIMARY colors
    'bg-primary', 'bg-primary-50', 'bg-primary-100', 'bg-primary-200',
    'bg-primary-300', 'bg-primary-400', 'bg-primary-500', 'bg-primary-600',
    'bg-primary-700', 'bg-primary-800', 'bg-primary-900', 'bg-primary-950',
    'text-primary', 'text-primary-50', 'text-primary-100', 'text-primary-200',
    'text-primary-300', 'text-primary-400', 'text-primary-500', 'text-primary-600',
    'text-primary-700', 'text-primary-800', 'text-primary-900', 'text-primary-950',
    'border-primary', 'border-primary-200', 'border-primary-500',
    'ring-primary', 'ring-primary-500',
    'hover:bg-primary-50', 'hover:bg-primary-100', 'hover:bg-primary-600',
    'hover:text-primary-500', 'hover:border-primary-500',

    // SECONDARY colors
    'bg-secondary', 'bg-secondary-50', 'bg-secondary-100', 'bg-secondary-200',
    'bg-secondary-300', 'bg-secondary-400', 'bg-secondary-500', 'bg-secondary-600',
    'bg-secondary-700', 'bg-secondary-800', 'bg-secondary-900', 'bg-secondary-950',
    'text-secondary', 'text-secondary-50', 'text-secondary-100', 'text-secondary-200',
    'text-secondary-300', 'text-secondary-400', 'text-secondary-500', 'text-secondary-600',
    'text-secondary-700', 'text-secondary-800', 'text-secondary-900', 'text-secondary-950',
    'border-secondary', 'border-secondary-200', 'border-secondary-300', 'border-secondary-500',
    'border-secondary-600', 'border-secondary-700',
    'ring-secondary', 'ring-secondary-500',
    'hover:bg-secondary-50', 'hover:bg-secondary-100', 'hover:bg-secondary-200',
    'hover:bg-secondary-700', 'hover:bg-secondary-800',
    'hover:text-secondary-500', 'hover:border-secondary-500',

    // ACCENT colors
    'bg-accent', 'bg-accent-50', 'bg-accent-100', 'bg-accent-200',
    'bg-accent-300', 'bg-accent-400', 'bg-accent-500', 'bg-accent-600',
    'bg-accent-700', 'bg-accent-800', 'bg-accent-900', 'bg-accent-950',
    'text-accent', 'text-accent-50', 'text-accent-100', 'text-accent-200',
    'text-accent-300', 'text-accent-400', 'text-accent-500', 'text-accent-600',
    'text-accent-700', 'text-accent-800', 'text-accent-900', 'text-accent-950',
    'border-accent', 'border-accent-500',
    'ring-accent', 'ring-accent-500',
    'hover:bg-accent-50', 'hover:bg-accent-100', 'hover:bg-accent-600',
    'hover:text-accent-500',
    
    // Animation classes
    'animate-float', 'animate-glow-pulse', 'animate-shimmer', 'animate-breathe',
    'animate-slide-up', 'animate-slide-down', 'animate-slide-left', 'animate-slide-right',
    'animate-bounce-in', 'animate-rubber-band', 'animate-aurora',
  ],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        // Surface Colors
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',

        card: {
          DEFAULT: 'rgb(var(--color-card) / <alpha-value>)',
          foreground: 'rgb(var(--color-card-foreground) / <alpha-value>)',
        },

        popover: {
          DEFAULT: 'rgb(var(--color-popover) / <alpha-value>)',
          foreground: 'rgb(var(--color-popover-foreground) / <alpha-value>)',
        },

        border: 'rgb(var(--color-border) / <alpha-value>)',
        input: 'rgb(var(--color-input) / <alpha-value>)',
        ring: 'rgb(var(--color-ring) / <alpha-value>)',

        muted: {
          DEFAULT: 'rgb(var(--color-muted) / <alpha-value>)',
          foreground: 'rgb(var(--color-muted-foreground) / <alpha-value>)',
        },

        // PRIMARY Color
        primary: {
          DEFAULT: 'rgb(var(--color-primary-500) / <alpha-value>)',
          foreground: 'rgb(var(--color-primary-foreground) / <alpha-value>)',
          50: 'rgb(var(--color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          200: 'rgb(var(--color-primary-200) / <alpha-value>)',
          300: 'rgb(var(--color-primary-300) / <alpha-value>)',
          400: 'rgb(var(--color-primary-400) / <alpha-value>)',
          500: 'rgb(var(--color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--color-primary-600) / <alpha-value>)',
          700: 'rgb(var(--color-primary-700) / <alpha-value>)',
          800: 'rgb(var(--color-primary-800) / <alpha-value>)',
          900: 'rgb(var(--color-primary-900) / <alpha-value>)',
          950: 'rgb(var(--color-primary-950) / <alpha-value>)',
        },

        // SECONDARY Color
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary-500) / <alpha-value>)',
          foreground: 'rgb(var(--color-secondary-foreground) / <alpha-value>)',
          50: 'rgb(var(--color-secondary-50) / <alpha-value>)',
          100: 'rgb(var(--color-secondary-100) / <alpha-value>)',
          200: 'rgb(var(--color-secondary-200) / <alpha-value>)',
          300: 'rgb(var(--color-secondary-300) / <alpha-value>)',
          400: 'rgb(var(--color-secondary-400) / <alpha-value>)',
          500: 'rgb(var(--color-secondary-500) / <alpha-value>)',
          600: 'rgb(var(--color-secondary-600) / <alpha-value>)',
          700: 'rgb(var(--color-secondary-700) / <alpha-value>)',
          800: 'rgb(var(--color-secondary-800) / <alpha-value>)',
          900: 'rgb(var(--color-secondary-900) / <alpha-value>)',
          950: 'rgb(var(--color-secondary-950) / <alpha-value>)',
        },

        // ACCENT Color
        accent: {
          DEFAULT: 'rgb(var(--color-accent-500) / <alpha-value>)',
          foreground: 'rgb(var(--color-accent-foreground) / <alpha-value>)',
          50: 'rgb(var(--color-accent-50) / <alpha-value>)',
          100: 'rgb(var(--color-accent-100) / <alpha-value>)',
          200: 'rgb(var(--color-accent-200) / <alpha-value>)',
          300: 'rgb(var(--color-accent-300) / <alpha-value>)',
          400: 'rgb(var(--color-accent-400) / <alpha-value>)',
          500: 'rgb(var(--color-accent-500) / <alpha-value>)',
          600: 'rgb(var(--color-accent-600) / <alpha-value>)',
          700: 'rgb(var(--color-accent-700) / <alpha-value>)',
          800: 'rgb(var(--color-accent-800) / <alpha-value>)',
          900: 'rgb(var(--color-accent-900) / <alpha-value>)',
          950: 'rgb(var(--color-accent-950) / <alpha-value>)',
        },

        // Semantic Colors
        destructive: {
          DEFAULT: 'rgb(var(--color-destructive) / <alpha-value>)',
          foreground: 'rgb(var(--color-destructive-foreground) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgb(var(--color-success) / <alpha-value>)',
          foreground: 'rgb(var(--color-success-foreground) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--color-warning) / <alpha-value>)',
          foreground: 'rgb(var(--color-warning-foreground) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'rgb(var(--color-info) / <alpha-value>)',
          foreground: 'rgb(var(--color-info-foreground) / <alpha-value>)',
        },
      },

      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },

      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },

      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgb(var(--color-primary-500) / 0.3)',
        'glow-lg': '0 0 40px rgb(var(--color-primary-500) / 0.4)',
        'glow-xl': '0 0 60px rgb(var(--color-primary-500) / 0.5)',
        'glow-secondary': '0 0 20px rgb(var(--color-secondary-500) / 0.3)',
        'glow-accent': '0 0 20px rgb(var(--color-accent-500) / 0.3)',
        'glow-accent-lg': '0 0 40px rgb(var(--color-accent-500) / 0.4)',
        'inner-glow': 'inset 0 0 20px rgb(var(--color-primary-500) / 0.15)',
        'neon': '0 0 5px rgb(var(--color-primary-500)), 0 0 20px rgb(var(--color-primary-500) / 0.5), 0 0 40px rgb(var(--color-primary-500) / 0.3)',
        'neon-accent': '0 0 5px rgb(var(--color-accent-500)), 0 0 20px rgb(var(--color-accent-500) / 0.5), 0 0 40px rgb(var(--color-accent-500) / 0.3)',
        'elevation-1': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'elevation-2': '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
        'elevation-3': '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)',
        'elevation-4': '0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)',
        'elevation-5': '0 20px 40px rgba(0,0,0,0.2)',
      },

      // ============================================
      // PREMIUM ANIMATIONS
      // ============================================
      animation: {
        // Basic
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
        
        // Slides
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left': 'slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        
        // Scale
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-out',
        'pop-in': 'popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        
        // Floating & Breathing
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'breathe-slow': 'breathe 6s ease-in-out infinite',
        
        // Glow effects
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'glow-breathe': 'glowBreathe 3s ease-in-out infinite',
        'neon-flicker': 'neonFlicker 2s ease-in-out infinite',
        
        // Shimmer & Shine
        'shimmer': 'shimmer 2s linear infinite',
        'shine': 'shine 1.5s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        
        // Rotate
        'spin-slow': 'spin 3s linear infinite',
        'spin-reverse': 'spinReverse 1s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'swing': 'swing 2s ease-in-out infinite',
        
        // Attention
        'rubber-band': 'rubberBand 1s ease-in-out',
        'jello': 'jello 1s ease-in-out',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        
        // Background effects
        'gradient-shift': 'gradientShift 15s ease infinite',
        'gradient-fast': 'gradientShift 8s ease infinite',
        'aurora': 'aurora 15s ease infinite',
        'aurora-fast': 'aurora 8s ease infinite',
        'mesh-flow': 'meshFlow 20s ease infinite',
        
        // Border animations
        'border-glow': 'borderGlow 2s ease-in-out infinite',
        'border-flow': 'borderFlow 3s linear infinite',
        
        // Timer specific
        'colon-blink': 'colonBlink 1s step-end infinite',
        'timer-tick': 'timerTick 1s ease-in-out infinite',
        'timer-pulse': 'timerPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        
        // Entrance animations
        'enter-from-left': 'enterFromLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'enter-from-right': 'enterFromRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'enter-from-top': 'enterFromTop 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'enter-from-bottom': 'enterFromBottom 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        
        // Morphing
        'morph': 'morph 8s ease-in-out infinite',
        'blob': 'blob 7s infinite',
        
        // Ripple
        'ripple': 'ripple 0.6s linear',
        'ripple-slow': 'ripple 1s linear',
      },

      keyframes: {
        // Basic
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        
        // Slides
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        
        // Scale
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        
        // Float & Breathe
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.9' },
        },
        
        // Glow effects
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgb(var(--color-primary-500) / 0.4), 0 0 20px rgb(var(--color-primary-500) / 0.2)' 
          },
          '50%': { 
            boxShadow: '0 0 20px rgb(var(--color-primary-500) / 0.6), 0 0 40px rgb(var(--color-primary-500) / 0.4)' 
          },
        },
        glowBreathe: {
          '0%, 100%': { 
            boxShadow: '0 0 10px rgb(var(--color-primary-500) / 0.3)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgb(var(--color-primary-500) / 0.5), 0 0 60px rgb(var(--color-primary-500) / 0.3)' 
          },
        },
        neonFlicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
            textShadow: '0 0 5px rgb(var(--color-primary-500)), 0 0 20px rgb(var(--color-primary-500) / 0.7), 0 0 40px rgb(var(--color-primary-500) / 0.5)',
            opacity: '1',
          },
          '20%, 24%, 55%': {
            textShadow: 'none',
            opacity: '0.8',
          },
        },
        
        // Shimmer & Shine
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        shine: {
          '0%': { backgroundPosition: '-100% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.9)' },
        },
        
        // Rotate
        spinReverse: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        swing: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '20%': { transform: 'rotate(15deg)' },
          '40%': { transform: 'rotate(-10deg)' },
          '60%': { transform: 'rotate(5deg)' },
          '80%': { transform: 'rotate(-5deg)' },
        },
        
        // Attention
        rubberBand: {
          '0%': { transform: 'scale3d(1, 1, 1)' },
          '30%': { transform: 'scale3d(1.25, 0.75, 1)' },
          '40%': { transform: 'scale3d(0.75, 1.25, 1)' },
          '50%': { transform: 'scale3d(1.15, 0.85, 1)' },
          '65%': { transform: 'scale3d(0.95, 1.05, 1)' },
          '75%': { transform: 'scale3d(1.05, 0.95, 1)' },
          '100%': { transform: 'scale3d(1, 1, 1)' },
        },
        jello: {
          '0%, 11.1%, 100%': { transform: 'none' },
          '22.2%': { transform: 'skewX(-12.5deg) skewY(-12.5deg)' },
          '33.3%': { transform: 'skewX(6.25deg) skewY(6.25deg)' },
          '44.4%': { transform: 'skewX(-3.125deg) skewY(-3.125deg)' },
          '55.5%': { transform: 'skewX(1.5625deg) skewY(1.5625deg)' },
          '66.6%': { transform: 'skewX(-0.78125deg) skewY(-0.78125deg)' },
          '77.7%': { transform: 'skewX(0.390625deg) skewY(0.390625deg)' },
          '88.8%': { transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)' },
        },
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.1)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1)' },
        },
        
        // Background effects
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        aurora: {
          '0%, 100%': { 
            backgroundPosition: '50% 50%',
            filter: 'hue-rotate(0deg)',
          },
          '25%': { backgroundPosition: '0% 50%' },
          '50%': { 
            backgroundPosition: '50% 100%',
            filter: 'hue-rotate(30deg)',
          },
          '75%': { backgroundPosition: '100% 50%' },
        },
        meshFlow: {
          '0%, 100%': { 
            backgroundPosition: '0% 0%',
          },
          '25%': { backgroundPosition: '100% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' },
        },
        
        // Border animations
        borderGlow: {
          '0%, 100%': { 
            borderColor: 'rgb(var(--color-primary-500) / 0.5)',
            boxShadow: '0 0 10px rgb(var(--color-primary-500) / 0.3)',
          },
          '50%': { 
            borderColor: 'rgb(var(--color-primary-500))',
            boxShadow: '0 0 20px rgb(var(--color-primary-500) / 0.5)',
          },
        },
        borderFlow: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 0%' },
        },
        
        // Timer specific
        colonBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        timerTick: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        timerPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        
        // Entrance
        enterFromLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        enterFromRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        enterFromTop: {
          '0%': { opacity: '0', transform: 'translateY(-100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        enterFromBottom: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        
        // Morphing
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '50%': { borderRadius: '50% 60% 30% 60% / 30% 60% 70% 40%' },
          '75%': { borderRadius: '60% 40% 60% 30% / 70% 30% 50% 60%' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        
        // Ripple
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      },

      // Transition timing functions
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.5, 1.5, 0.75, 1.25)',
      },

      // Transition durations
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },
    },
  },
  plugins: [],
};

export default config;