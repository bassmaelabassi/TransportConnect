/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
      content: [
        "./index.html", // Include your root HTML file
        "./src/**/*.{js,jsx,ts,tsx}", // Include all JS/JSX/TS/TSX files inside src
      ],
      theme: {
        extend: {
          // Here you can add customizations to your theme.
          // For example, adding custom colors:
          // colors: {
          //   primary: "#1DA1F2",
          // },
        },
      },
      plugins: [
        // Add any plugins you might need, for example:
        // require('@tailwindcss/forms'),
      ],
    };
    