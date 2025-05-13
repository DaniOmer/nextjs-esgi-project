/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Couleurs personnalisées
      colors: {
        "pokemon-red": "#FF0000",
        "pokemon-blue": "#3B4CCA",
        "pokemon-yellow": "#FFDE00",
      },
      // Espacements personnalisés
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      // Breakpoints personnalisés
      screens: {
        tablet: "640px",
        laptop: "1024px",
        desktop: "1280px",
      },
      // Autres personnalisations
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        custom:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
