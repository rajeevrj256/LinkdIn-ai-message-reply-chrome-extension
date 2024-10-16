/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./**/*.{js,jsx,ts,tsx}"],
  plugins: [
    require("@tailwindcss/forms")
    // ...
  ]
}
