/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
				fade: 'fadeIn .5s ease-in-out',
			},
			keyframes: {
				fadeIn: {
					from: { opacity: 0 },
					to: { opacity: 1 },
				},
			},
      colors: {
        zinc: {
          970: '#050505',
          930: '#101012'
        },
      },
    }
  },
  plugins: [
    // default prefix is "ui"
		require("@kobalte/tailwindcss"),
    require('@tailwindcss/typography')
  ]
};
