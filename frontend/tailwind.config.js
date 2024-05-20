/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      select: {
        // Override default iOS styling
        '-webkit-appearance': 'none',
        // Add your custom styles
        // For example:
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        borderWidth: '1px',
        borderColor: '#e5e7eb',
        backgroundColor: '#fff',
        color: '#4b5563',
        lineHeight: '1.25',
        // Center text horizontally and vertically
        display: 'inline-block',
        textAlign: 'center', // Center text horizontally
        // Use line-height to vertically center text
        lineHeight: '2rem', // Adjust line-height based on select height
    },
      colors: {
        'dark-blue': '#131C28',
        'blue': "#0072DC",
        'darker-blue': '#070E16',
      }
    },
  },
  plugins: [
],
}

