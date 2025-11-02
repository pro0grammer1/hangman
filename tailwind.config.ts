import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        tertiary: "var(--tertiary)",
      },
      screens: {
        // `tall` matches viewports at least 750px tall (desktop-like)
        'tall': { 'raw': '(min-height: 750px)' },
        // `small` for slightly shorter viewports if needed
        'small': { 'raw': '(max-height: 799px)' },
      }
    },
  },
  plugins: [],
} satisfies Config;
