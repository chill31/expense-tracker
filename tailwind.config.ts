import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [nextui()],
  theme: {
    extend: {
      colors: {
        "logo-gr-1": "#03F9AF",
        "logo-gr-2": "#1CD9FF",
        "primary": "#4199FF",
        "error": "#FF3F34",
        "warning": "#FFA801",
        "success": "#05C46B",
        "gray": "#CACACA",
        "dark": "#1C1E21",
        "dark-secondary": "#2A2D33"
      },
    }
  }
};
export default config;
