/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins_400Regular', 'Poppins_500Medium', 'Poppins_600SemiBold'], // Match the font variants you have installed
      },
    },
  },
  plugins: [],
};
