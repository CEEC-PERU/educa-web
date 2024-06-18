import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-100": "#000E57",
        "brand-200": "#1C0955",
        "brand-300": "#24033D",
        "brand-500" : "#071144",
        "brandazul-600":"#030A32",
        "brandmorado-700" : "#590F87",
        "brandrosado-800" : "#A959FF",
        "brandfucsia-900" : "#6017AF"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
