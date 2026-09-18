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
        maroon: {
          DEFAULT: "#681B2B",
          50: "#FBEEF0",
          100: "#F3D3D8",
          200: "#E4A6B0",
          300: "#D07888",
          400: "#A73F52",
          500: "#681B2B",
          600: "#571623",
          700: "#46121C",
          800: "#350D15",
          900: "#24090E",
          950: "#150507",
        },
        gold: {
          DEFAULT: "#D4AF37",
          50: "#FCF8EC",
          100: "#F8EFD1",
          200: "#F0DFA3",
          300: "#E9CF75",
          400: "#E1BF47",
          500: "#D4AF37",
          600: "#AB8C2C",
          700: "#816921",
          800: "#584616",
          900: "#2E230B",
        },
        cream: "#FBF7F0",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      backgroundImage: {
        "maroon-gradient":
          "linear-gradient(135deg, #46121C 0%, #681B2B 50%, #8A2438 100%)",
        "gold-shine":
          "linear-gradient(135deg, #AB8C2C 0%, #D4AF37 50%, #E9CF75 100%)",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(104, 27, 43, 0.08)",
        glow: "0 0 40px rgba(212, 175, 55, 0.25)",
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
