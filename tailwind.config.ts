import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 16px 40px -24px rgba(15, 23, 42, 0.35)"
      },
      colors: {
        brand: {
          50: "#f2f7ff",
          100: "#e2edff",
          200: "#bed6ff",
          300: "#8fb7ff",
          400: "#5c91ff",
          500: "#326cff",
          600: "#1c4dff",
          700: "#193ee7",
          800: "#1c36bb",
          900: "#1d3293"
        }
      },
      backgroundImage: {
        "dashboard-grid":
          "linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)"
      }
    }
  },
  daisyui: {
    themes: [
      {
        investmenttracker: {
          primary: "#326cff",
          secondary: "#0f766e",
          accent: "#8b5cf6",
          neutral: "#111827",
          "base-100": "#f8fafc",
          "base-200": "#eef2f7",
          "base-300": "#e2e8f0",
          "base-content": "#0f172a",
          info: "#0284c7",
          success: "#16a34a",
          warning: "#d97706",
          error: "#dc2626"
        }
      }
    ]
  },
  plugins: [daisyui]
};

export default config;
