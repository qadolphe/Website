import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070c1a",
        foreground: "#eef0f4",
        muted: "#a6b2c8",
        accent: "#f4c66a",
      },
      boxShadow: {
        glow: "0 0 30px rgba(244, 198, 106, 0.35)",
      },
      keyframes: {
        twinkle: { "0%, 100%": { opacity: "0.25" }, "50%": { opacity: "0.9" } },
      },
      animation: {
        twinkle: "twinkle 6s ease-in-out infinite",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top, rgba(244, 198, 106, 0.14), transparent 32%), linear-gradient(180deg, #0e172b 0%, #070c1a 48%, #050914 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
