import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#e5e5e5",
        muted: "#a3a3a3",
        accent: "#f59e0b",
      },
      boxShadow: {
        glow: "0 0 30px rgba(245, 158, 11, 0.35)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top, rgba(245, 158, 11, 0.14), transparent 32%), linear-gradient(180deg, #111111 0%, #0a0a0a 48%, #050505 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
