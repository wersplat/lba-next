/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Global theme colors using CSS variables
        'theme': {
          'bg-primary': 'var(--bg-primary)',
          'bg-secondary': 'var(--bg-secondary)',
          'bg-tertiary': 'var(--bg-tertiary)',
          'bg-hover': 'var(--bg-hover)',
          'border': 'var(--bg-border)',
          'text-primary': 'var(--text-primary)',
          'text-secondary': 'var(--text-secondary)',
          'text-muted': 'var(--text-muted)',
        },
        // Legends Basketball Association Theme: Using CSS variables from leagues_info
        // These will be dynamically set by ThemeContext based on leagues_info colors
        legends: {
          purple: {
            50: '#F3E8FF',
            100: '#E9D5FF',
            200: '#D8B4FE',
            300: '#C084FC',
            400: '#A855F7',
            500: 'var(--league-primary, #7A60A8)', // Primary brand color from leagues_info
            600: '#7E22CE',
            700: '#6B21A8',
            800: '#581C87',
            900: '#4C1D95',
          },
          red: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            200: '#FECACA',
            300: '#FCA5A5',
            400: '#F87171',
            500: '#EF4444',
            600: 'var(--league-secondary, #21104A)', // Secondary/accent color from leagues_info
            700: '#B91C1C',
            800: '#991B1B',
            900: '#7F1D1D',
          },
          blue: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            200: '#BFDBFE',
            300: '#93C5FD',
            400: '#60A5FA',
            500: '#3B82F6',
            600: 'var(--league-accent, #B51E4E)', // Tertiary color from leagues_info
            700: '#1D4ED8',
            800: '#1E40AF',
            900: '#1E3A8A',
          },
        },
        // Legacy support - using CSS variables
        primary: {
          DEFAULT: 'var(--league-primary, #7A60A8)', // Purple primary from leagues_info
          light: '#F3E8FF',
          medium: '#D8B4FE',
          dark: '#7E22CE',
        },
        secondary: {
          DEFAULT: 'var(--league-secondary, #21104A)', // Red secondary from leagues_info
          light: '#FECACA',
          medium: '#FCA5A5',
          dark: '#B91C1C',
        },
        // Direct CSS variable access for dynamic colors
        'league-primary': 'var(--league-primary)',
        'league-secondary': 'var(--league-secondary)',
        'league-accent': 'var(--league-accent)',
      },
    },
  },
  plugins: [],
}

