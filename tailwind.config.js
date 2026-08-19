/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#0b0f19",
          800: "#111827",
          700: "#1f293d",
          600: "#374151"
        },
        brand: {
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca"
        },
        avoidable: {
          500: "#f59e0b",
          600: "#d97706"
        }
      }
    },
  },
  plugins: [],
}
