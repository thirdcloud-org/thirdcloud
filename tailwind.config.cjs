/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'grid': `
        linear-gradient(to right, #636363 1px, transparent 1px),
        linear-gradient(to bottom, #636363 1px, transparent 1px)
      `,
      },
      animation: {
        "text-gradient": "text 1.5s linear infinite",
				fade: 'fadeIn .5s ease-in-out',
			},
			keyframes: {
				fadeIn: {
					from: { opacity: 0 },
					to: { opacity: 1 },
				},
        text: {
          to: {
            backgroundPosition: "200% center",
          },
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
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      addUtilities({
        '.bg-grid': {
          backgroundSize: '80px 80px',
          backgroundPosition: '-2px -2px',
        },
        '.bg-grid-lg': {
          backgroundSize: '120px 120px',
          backgroundPosition: '-2px -2px',
        },
      });

    },

  ]
};
