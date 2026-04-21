import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#141414",
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#141414",
        },
        accent: {
          DEFAULT: "#E44A32",
          50: "#FEF2F0",
          100: "#FFE4D6",
          200: "#FDCFBA",
          300: "#F4A583",
          400: "#E8714E",
          500: "#E44A32",
          600: "#D03A22",
          700: "#AD2E1A",
          800: "#8C271B",
          900: "#74241B",
        },
        teal: {
          DEFAULT: "#008060",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#008060",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        warm: {
          50: "#FFFCF9",
          100: "#FFF8F3",
          200: "#FFE4D6",
          300: "#F4E1D2",
          400: "#F5E6DB",
        },
        // Topmate pastel card backgrounds
        pastel: {
          peach:    "#FFE4D6",
          blue:     "#AACAF9",
          lavender: "#F1D4FF",
          yellow:   "#FCE78C",
          green:    "#F5FBF4",
          mint:     "#D1FAE5",
        },
        dark: {
          DEFAULT: "#141414",
          100: "#1A1A1A",
          200: "#0A0A0A",
        },
      },
      fontFamily: {
        // Topmate body — Inter
        sans: ["Inter", "Inter Fallback", "system-ui", "-apple-system", "sans-serif"],
        // Headings — Inter Display
        display: ["Inter Display", "Inter", "system-ui", "Arial", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      borderRadius: {
        sm:    "6px",
        md:    "8px",
        lg:    "10px",
        xl:    "12px",
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "48px",
        pill:  "9999px",
      },
      boxShadow: {
        card:           "0 2px 8px rgba(0,0,0,0.05)",
        "card-hover":   "0 8px 24px rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.10)",
        nav:            "0 1px 0 rgba(0,0,0,0.06)",
        "nav-scrolled": "0 4px 16px rgba(0,0,0,0.08)",
        btn:            "0 1px 3px rgba(0,0,0,0.12)",
      },
      letterSpacing: {
        display: "-0.04em",
        heading: "-0.025em",
        tight:   "-0.01em",
      },
      fontSize: {
        "display-xl": ["4.5rem",  { lineHeight: "1",    letterSpacing: "-0.04em" }],
        "display-lg": ["3.5rem",  { lineHeight: "1",    letterSpacing: "-0.03em" }],
        "display-md": ["2.5rem",  { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-sm": ["2rem",    { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
        "display-xs": ["1.5rem",  { lineHeight: "1.2",  letterSpacing: "-0.015em" }],
      },
    },
  },
  plugins: [],
};

export default config;
