/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        rainbow: 'rainbow 3s linear infinite',
      },
      keyframes: {
        rainbow: {
          'to': { backgroundPosition: '200% center' },
        }
      },
      backgroundImage: {
        'diagonal-lines-light': `repeating-linear-gradient(
          45deg,
          theme(colors.neutral.200),
          theme(colors.neutral.200) 10px,
          theme(colors.neutral.100) 10px,
          theme(colors.neutral.100) 20px
        )`,
        'diagonal-lines-dark': `repeating-linear-gradient(
          45deg,
          #222,
          #222 10px,
          #111 10px,
          #111 20px
        )`,
        // A more subtle dark version like your image
        'diagonal-lines-dark-subtle': `repeating-linear-gradient(
          45deg,
          theme(colors.neutral.800),
          theme(colors.neutral.800) 5px,
          theme(colors.neutral.900) 5px,
          theme(colors.neutral.900) 10px
        )`,
      },
    },
  },
  plugins: [require("tailwindcss-animate"),
    require('tailwind-scrollbar-hide'),
  ],
  
}