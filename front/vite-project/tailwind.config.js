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
        toss: {
          blue: {
            DEFAULT: '#0050FF',
            hover: '#0040D0',
            light: '#E8F0FE',
            dark: '#1A3B8B'
          },
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
          dark: {
            bg: '#101622',
            card: '#1B2232',
            border: '#2C354D'
          }
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'toss': '0 8px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'toss-hover': '0 16px 32px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'toss-sm': '12px',
        'toss': '18px',
        'toss-lg': '24px',
      }
    },
  },
  plugins: [],
}
