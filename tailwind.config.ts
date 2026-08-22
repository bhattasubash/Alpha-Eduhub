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
        // High-Contrast Editorial Paper & Ink Tokens
        paper: "#F6F3EC",        // Primary warm paper canvas
        "paper-band": "#ECE6D8",  // Distinct, richer alternate paper band (breaks scroll rhythm)
        "paper-highlight": "#E0D7C4", // Grounded recommended tier cell tint
        "paper-light": "#FCFAF6", // Elevated crisp paper surface
        "paper-dark": "#E6DECFC",  // Recessed ledger tone
        ink: "#1B2420",          // Primary text (near-black with forest undertone)
        "ink-muted": "#46524A",  // High-contrast secondary text
        "ink-subtle": "#6E7A72", // Crisp tertiary text
        ledger: "#2F4A3C",       // Deep forest green (buttons, active states, data-positive)
        "ledger-hover": "#21362B",
        "ledger-light": "#E3EAE4", // Clear badge/indicator background
        brass: "#B08D57",        // Secondary accent
        "brass-dark": "#7D5C2C", // Deep contrast brass for section index & numerals (>5:1 ratio)
        "brass-light": "#F2EBE0",
        line: "#C9BEA7",         // Crisp etched divider (replaces washed-out beige)
        "line-dark": "#B0A389",  // Heavy rule
        alert: "#8B3A3A",        // Oxblood (warnings/unexcused flags only)

        // Compatibility aliases for legacy dashboard components
        lamaSky: "#E3EAE4",
        lamaSkyLight: "#F6F3EC",
        lamaPurple: "#ECE6D8",
        lamaPurpleLight: "#FCFAF6",
        lamaYellow: "#F2EBE0",
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
        lg: "4px",
        md: "3px",
        sm: "2px",
      },
      boxShadow: {
        'ledger': '0 1px 3px 0 rgba(27, 36, 32, 0.08), 0 1px 2px -1px rgba(27, 36, 32, 0.05)',
        'ledger-lift': '0 6px 16px 0 rgba(27, 36, 32, 0.10), 0 2px 6px -2px rgba(27, 36, 32, 0.05)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
