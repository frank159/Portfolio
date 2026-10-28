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
        sans: ["Google Sans Flex", "sans-serif"],
        nunito: ['var(--font-nunito-sans)', 'sans-serif'],
        ribeye: ['var(--font-ribeye)', 'serif'],
        display: ["Anton SC", "sans-serif"],

      },
    },
  },
  plugins: [],
};

export default config;