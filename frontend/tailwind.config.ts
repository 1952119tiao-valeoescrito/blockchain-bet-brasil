// Caminho: /tailwind.config.ts (VERSÃO CORRIGIDA E BLINDADA)

import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'], // Essencial para temas dark/light
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: '', // Prefixo opcional, mas bom ter definido
  theme: {
    container: {
      center: true,
      padding: '1rem', // Sua otimização mantida!
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // ====================================================================
      // PARTE 1: DEFINIÇÃO DAS CORES PARA COMPONENTES (O ANTIGO "BO")
      // Estas cores se conectam com as variáveis do seu globals.css
      // ====================================================================
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Suas cores personalizadas foram mantidas e podem coexistir!
        brand: {
          DEFAULT: '#00C2FF',
          dark: '#0077B6',
          light: '#90E0EF',
        },
        alerta: '#FFD60A',
        sucesso: '#32CD32',
        fundo: '#0D1B2A',
        texto: '#E0E0E0',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      backgroundImage: { // Mantido do seu original
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  // ====================================================================
  // PARTE 2: ADIÇÃO DO PLUGIN DE ANIMAÇÃO
  // ====================================================================
  plugins: [require('tailwindcss-animate')], 
} satisfies Config;

export default config;