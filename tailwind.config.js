// tailwind config via versão ESM
/** @type {import ('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js, jsx}',
    './src/pages/**/*.{js,jsx}',
    './src/components/*.{js,jsx}',
  ],
  theme: {
    screens: {
      xs: '465px',
      xssm: '576px',
      sm: '640px',
      md: '768px',
      mdlg: '992px',
      lg: '1040px',
      xl: '1280px',
      lgxl: '1400px',
      '2xl': '1536px',
      '3xl': '1850px',
    },
    extends: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
};
