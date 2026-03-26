import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b1220",
        card: "#111827",
        cardSoft: "#1f2937",
        ok: "#22c55e",
        warn: "#facc15",
        bad: "#ef4444"
      }
    }
  },
  plugins: []
};

export default config;
