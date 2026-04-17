import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F6F4E8",
        card: "#E5EEE4",
        cardSoft: "#C0E1D2",
        ok: "#C0E1D2",
        warn: "#DC9B9B",
        bad: "#DC9B9B"
      }
    }
  },
  plugins: []
};

export default config;
