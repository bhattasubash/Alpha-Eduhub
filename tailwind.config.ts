import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ["'Newsreader'", "Georgia", "Cambria", "'Times New Roman'", "serif"],
        sans: ["'Public Sans'", "'Source Sans 3'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        mono: ["'IBM Plex Mono'", "'JetBrains Mono'", "monospace"],
      },
      colors: {
        // Locked Paper & Ink Editorial Tokens
        paper: "#F6F3EC",        // Warm paper background (not pure white)
        "paper-light": "#FCFAF6", // Slightly elevated paper surface
        "paper-dark": "#ECE7DC",  // Slightly recessed paper tone
        ink: "#1B2420",          // Primary text (near-black with deep forest green undertone)
        "ink-muted": "#4A564F",  // Secondary text
        "ink-subtle": "#75827A", // Tertiary text
        ledger: "#2F4A3C",       // Deep forest green (primary accent, buttons, links)
        "ledger-hover": "#233A2E",
        "ledger-light": "#E9EFEA", // Very light ledger tint
        brass: "#B08D57",        // Secondary accent (small labels, dividers)
        "brass-light": "#F5EFE6",
        line: "#D9D2C2",         // Hairline borders, dividers
        "line-dark": "#C5BCAB",
        alert: "#8B3A3A",        // Oxblood (errors/warnings only)

        // Compatibility aliases for legacy dashboard components
        lamaSky: "#E9EFEA",
        lamaSkyLight: "#F6F3EC",
        lamaPurple: "#ECE7DC",
        lamaPurpleLight: "#FCFAF6",
        lamaYellow: "#F5EFE6",
        lamaYellowLight: "#FCFAF6",

        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "6px",
        md: "4px",
        sm: "2px",
      },
      boxShadow: {
        'ledger': '0 1px 3px 0 rgba(27, 36, 32, 0.06), 0 1px 2px -1px rgba(27, 36, 32, 0.04)',
        'ledger-lift': '0 4px 12px 0 rgba(27, 36, 32, 0.08), 0 2px 4px -2px rgba(27, 36, 32, 0.04)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
