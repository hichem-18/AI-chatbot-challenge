/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Amiri', 'Noto Sans Arabic', 'Arabic UI Text', 'system-ui', 'sans-serif'],
        'english': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'monospace'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fefce8',
          500: '#eab308',
          600: '#ca8a04',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // Custom RTL plugin
    function({ addUtilities, addComponents }) {
      // RTL utilities
      const newUtilities = {
        '.rtl': {
          direction: 'rtl',
        },
        '.ltr': {
          direction: 'ltr',
        },
      }
      
      // Basic form styles (replacing @tailwindcss/forms)
      const formComponents = {
        '.input-primary': {
          'display': 'block',
          'width': '100%',
          'border-radius': '0.5rem',
          'border': '1px solid #d1d5db',
          'background-color': '#ffffff',
          'padding': '0.5rem 0.75rem',
          'font-size': '0.875rem',
          'line-height': '1.25rem',
          '&:focus': {
            'outline': '2px solid transparent',
            'outline-offset': '2px',
            'border-color': '#3b82f6',
            'box-shadow': '0 0 0 3px rgb(59 130 246 / 0.1)',
          },
          '&:disabled': {
            'background-color': '#f3f4f6',
            'cursor': 'not-allowed',
          }
        },
        '.btn-primary': {
          'background-color': '#2563eb',
          'color': '#ffffff',
          'font-weight': '500',
          'padding': '0.5rem 1rem',
          'border-radius': '0.5rem',
          'transition': 'background-color 0.2s',
          'border': 'none',
          'cursor': 'pointer',
          '&:hover': {
            'background-color': '#1d4ed8',
          },
          '&:focus': {
            'outline': '2px solid transparent',
            'outline-offset': '2px',
            'box-shadow': '0 0 0 3px rgb(37 99 235 / 0.5)',
          },
          '&:disabled': {
            'opacity': '0.5',
            'cursor': 'not-allowed',
          }
        },
        '.btn-outline': {
          'border': '1px solid #d1d5db',
          'color': '#374151',
          'background-color': '#ffffff',
          'font-weight': '500',
          'padding': '0.5rem 1rem',
          'border-radius': '0.5rem',
          'transition': 'background-color 0.2s',
          'cursor': 'pointer',
          '&:hover': {
            'background-color': '#f9fafb',
          },
          '&:focus': {
            'outline': '2px solid transparent',
            'outline-offset': '2px',
            'box-shadow': '0 0 0 3px rgb(59 130 246 / 0.1)',
          }
        }
      }
      
      addUtilities(newUtilities, ['responsive', 'hover'])
      addComponents(formComponents)
    }
  ],
}