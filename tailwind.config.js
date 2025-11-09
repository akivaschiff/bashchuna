/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Terracotta (Community & Connection)
        primary: {
          50: '#fef6f3',
          100: '#fde9df',
          200: '#fbd2c4',
          300: '#f7b49f',
          400: '#f28d6e',
          500: '#e86841',
          600: '#d24e2a',
          700: '#b23d20',
          800: '#92341e',
          900: '#792f1e',
          950: '#41160d',
        },
        // Secondary: Sage Green (Trust & Reliability)
        secondary: {
          50: '#f4f7f4',
          100: '#e5ebe5',
          200: '#ccd9ce',
          300: '#a8bfac',
          400: '#7d9f84',
          500: '#5a8462',
          600: '#476a4e',
          700: '#3a5540',
          800: '#2f4435',
          900: '#28382d',
          950: '#141f18',
        },
        // Accent: Golden Amber (Quality & Highlights)
        accent: {
          50: '#fef9ec',
          100: '#fcefc9',
          200: '#f9dd8e',
          300: '#f6c453',
          400: '#f3aa2c',
          500: '#ed8a18',
          600: '#d26512',
          700: '#ae4712',
          800: '#8d3716',
          900: '#742f15',
          950: '#421708',
        },
        // Neutrals: Warm Gray (Sophisticated Foundation)
        neutral: {
          50: '#f8f8f7',
          100: '#efeeec',
          200: '#e3e1dd',
          300: '#d1cec8',
          400: '#b4afa6',
          500: '#9a938a',
          600: '#7f7970',
          700: '#69635b',
          800: '#58534d',
          900: '#4b4742',
          950: '#282623',
        },
        // Semantic Colors
        success: {
          light: '#a8bfac',
          DEFAULT: '#5a8462',
          dark: '#3a5540',
        },
        warning: {
          light: '#f6c453',
          DEFAULT: '#f3aa2c',
          dark: '#d26512',
        },
        error: {
          light: '#f7b49f',
          DEFAULT: '#d24e2a',
          dark: '#92341e',
        },
        info: {
          light: '#bfdbfe',
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
        },
      },
      fontFamily: {
        sans: ['var(--font-rubik)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(121, 47, 30, 0.06), 0 1px 2px 0 rgba(121, 47, 30, 0.04)',
        'card-hover': '0 10px 15px -3px rgba(121, 47, 30, 0.08), 0 4px 6px -2px rgba(121, 47, 30, 0.05)',
        'modal': '0 20px 25px -5px rgba(121, 47, 30, 0.12), 0 10px 10px -5px rgba(121, 47, 30, 0.06)',
        'header': '0 1px 3px 0 rgba(121, 47, 30, 0.05)',
        'inner': 'inset 0 2px 4px 0 rgba(121, 47, 30, 0.04)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'card': '0.75rem',
        'input': '0.5rem',
        'button': '0.5rem',
        'badge': '9999px',
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #fef6f3 0%, #ffffff 100%)',
        'gradient-hero': 'linear-gradient(135deg, #fef6f3 0%, #e5ebe5 100%)',
        'gradient-card': 'linear-gradient(180deg, #ffffff 0%, #f8f8f7 100%)',
        'gradient-primary': 'linear-gradient(135deg, #e86841 0%, #d24e2a 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #5a8462 0%, #476a4e 100%)',
      },
    },
  },
  plugins: [],
}
