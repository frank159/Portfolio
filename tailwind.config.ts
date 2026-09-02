import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-42dot)', 'sans-serif'],
        nunito: ['var(--font-nunito-sans)', 'sans-serif'],
        ribeye: ['var(--font-ribeye)', 'serif'], // <--- Adicionado aqui
      },
    },
  },
  plugins: [],
};

export default config;