/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        ibm: ['"IBM Plex Mono"', "monospace", "sans-serif"],
      },
      colors: {
        "accent-darker": "var(--accent-darker-color)",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: false,
  },
};

