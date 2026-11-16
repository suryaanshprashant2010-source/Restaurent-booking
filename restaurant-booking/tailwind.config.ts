import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1F3D2B",
          50: "#E9F0EC",
          100: "#D3E1D9",
          200: "#A7C3B3",
          300: "#7BA58D",
          400: "#4F8767",
          500: "#2E5A42",
          600: "#1F3D2B",
          700: "#182F22",
          800: "#102019",
          900: "#08100C"
        },
        champagne: {
          DEFAULT: "#D4B896",
          50: "#FBF7F1",
          100: "#F6EFE3",
          200: "#EDDFC7",
          300: "#E4CFAB",
          400: "#DCC4A0",
          500: "#D4B896",
          600: "#C49C6B",
          700: "#A87944",
          800: "#7D5A33",
          900: "#523B22"
        },
        ivory: {
          DEFAULT: "#F8F4EC",
          50: "#FFFFFF",
          100: "#FDFBF7",
          200: "#F8F4EC",
          300: "#EFE7D8",
          400: "#E6DAC4",
          500: "#DDCDB0"
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(31, 61, 43, 0.08)"
      }
    },
  },
  plugins: [],
} satisfies Config;
