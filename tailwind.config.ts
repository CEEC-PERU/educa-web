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
        "brandazuloscuro-100" : "#02061B",
        "brandmorado-700" : "#590F87",
        "brandrosado-800" : "#A959FF",
        "brandfucsia-900" : "#6017AF",
        "brandmorad-600" : "#572481",
        "brandmora-500" : "#501B7A",
        "brandborder-400" : "#6300B2",
        "brandpurpura-600" : "#3E0552",
        "brandrosa-800" : "#8204E7",
        "brandrosa-500": "#7913E5",
        "brandblanco-200": "#D9D9D9",
        "brandazul-200" : "#00168B",
        "brand-morado-500" : "#170744"
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
