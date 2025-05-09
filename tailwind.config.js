// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Monitora todos os arquivos relevantes dentro de app/
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Monitora todos os arquivos relevantes dentro de components/
    // Adicione outros caminhos se tiver componentes em outros lugares, ex: "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      // Aqui você pode estender o tema padrão do Tailwind
      // Por exemplo, adicionar cores customizadas, fontes, breakpoints, etc.
      // colors: {
      //   'betbrasil-blue': '#007bff',
      //   'betbrasil-green': '#28a745',
      // },
    },
  },
  plugins: [
    // Aqui você pode adicionar plugins do Tailwind, como @tailwindcss/forms, @tailwindcss/typography
  ],
}