import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        // dulu "maroon", sekarang jadi Soft Sky Blue
        maroon: {
          DEFAULT: "#3B7DD8",
          50: "#EFF6FF",
          100: "#DCEBFC",
          200: "#B9D7F8",
          300: "#8EBEF2",
          400: "#5FA0E8",
          500: "#3B7DD8",
          600: "#2E63B0",
          700: "#254E8A",
          800: "#1C3A67",
          900: "#142944",
          950: "#0D1B2E",
        },
        // dulu "gold", sekarang jadi warna krem hangat
        gold: {
          DEFAULT: "#D9B98A",
          50: "#FDFAF5",
          100: "#F7EEDE",
          200: "#EEDCBB",
          300: "#E4CA99",
          400: "#DEC08A",
          500: "#D9B98A",
          600: "#C39A5C",
          700: "#A67D42",
          800: "#7D5F32",
          900: "#544020",
        },
        cream: "#F7FAFD",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      backgroundImage: {
        "maroon-gradient":
          "linear-gradient(135deg, #254E8A 0%, #3B7DD8 50%, #5FA0E8 100%)",
        "gold-shine":
          "linear-gradient(135deg, #C39A5C 0%, #D9B98A 50%, #E4CA99 100%)",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(59, 125, 216, 0.08)",
        glow: "0 0 40px rgba(217, 185, 138, 0.25)",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;