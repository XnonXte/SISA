/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:   "#1DB954",
        accent:    "#F5A623",
        dark:      "#1A1A1A",
        muted:     "#707070",
        placeholder: "#9E9E9E",
        light:     "#FAFAFA",
        card:      "#F0F0F0",
        "green-soft": "#E8F5E9",
        "amber-soft": "#FFFCF7",
        "amber-light": "#FFF8E1",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      borderRadius: {
        "asym": "0px 20px 0px 20px",
        "asym-sm": "0px 12px 0px 12px",
        "asym-lg": "0px 24px 0px 24px",
        "asym-xl": "0px 32px 0px 32px",
      },
    },
  },
  plugins: [],
};
