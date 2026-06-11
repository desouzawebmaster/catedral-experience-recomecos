import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101114",
        ember: "#e24a2f",
        gold: "#f4b24a",
        moss: "#54715b",
        paper: "#f7f4ee"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(226, 74, 47, 0.28)"
      }
    }
  },
  plugins: []
};

export default config;
