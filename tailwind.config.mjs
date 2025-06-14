/** @type {import('tailwindcss').Config} */
export default {
  content: [
<<<<<<< HEAD:tailwind.config.js
    './app//*.{js,ts,jsx,tsx,mdx}',
    './pages//*.{js,ts,jsx,tsx,mdx}',
    './components//*.{js,ts,jsx,tsx,mdx}',

    // Or if using src directory:
    './src//*.{js,ts,jsx,tsx,mdx}',
=======
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
>>>>>>> main:tailwind.config.mjs
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#2E7D32',
        'primary-light': '#AED581',
        'secondary-blue': '#2962FF',
        'secondary-yellow': '#FFD700',
        'bg-dark': '#121212',
        'bg-light': '#FAFAFA',
        'card-dark': '#1E1E1E',
        'card-light': '#FFFFFF',
        'text-primary': '#FFFFFF',
        'text-dark': '#212121',
        'text-muted': '#B0BEC5',
        success: '#66BB6A',
        warning: '#FFB300',
        error: '#EF5350',
        'border-light': '#E0E0E0',
        'border-dark': '#333333',
        'accent-nft': '#00E676',
        'accent-points': '#40C4FF',
      },
    },
  },
  plugins: [],
};
