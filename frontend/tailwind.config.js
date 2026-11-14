/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          main: "#0B1220",
          secondary: "#101B2D",
          panel: "#142235",
          elevated: "#192B40",
          hover: "#1F344F",
          active: "#253D5C",
        },
        border: {
          subtle: "#26364A",
          muted: "#1E2C3D",
          strong: "#3B4E66",
          accent: "#38BDF8",
        },
        accent: {
          primary: "#38BDF8",     // Cyan / Sky
          primaryHover: "#0EA5E9",
          secondary: "#818CF8",   // Indigo
          secondaryHover: "#6366F1",
          muted: "rgba(56, 189, 248, 0.12)",
        },
        status: {
          success: "#4ADE80",
          successMuted: "rgba(74, 222, 128, 0.15)",
          warning: "#FBBF24",
          warningMuted: "rgba(251, 191, 36, 0.15)",
          danger: "#F87171",
          dangerMuted: "rgba(248, 113, 113, 0.15)",
          info: "#38BDF8",
          infoMuted: "rgba(56, 189, 248, 0.15)",
        },
        content: {
          primary: "#F1F5F9",
          secondary: "#94A3B8",
          muted: "#64748B",
          disabled: "#475569",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "0.875rem" }], // 11px
        xs: ["0.75rem", { lineHeight: "1rem" }],          // 12px
        sm: ["0.8125rem", { lineHeight: "1.125rem" }],     // 13px
        base: ["0.875rem", { lineHeight: "1.25rem" }],    // 14px
        md: ["0.9375rem", { lineHeight: "1.375rem" }],    // 15px
        lg: ["1rem", { lineHeight: "1.5rem" }],           // 16px
        xl: ["1.125rem", { lineHeight: "1.75rem" }],      // 18px
        "2xl": ["1.25rem", { lineHeight: "1.75rem" }],    // 20px
        "3xl": ["1.5rem", { lineHeight: "2rem" }],        // 24px
      },
      boxShadow: {
        panel: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        modal: "0 20px 40px -4px rgba(0, 0, 0, 0.7)",
        glow: "0 0 16px -2px rgba(56, 189, 248, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

