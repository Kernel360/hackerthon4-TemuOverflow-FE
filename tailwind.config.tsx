import type { Config } from 'tailwindcss'

const config: Config = {
  // module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          '50': '#f2f6fb',
          '100': '#e6eff9',
          '200': '#d2e0f3',
          '300': '#b7cbea',
          '400': '#9aaedf',
          '500': '#8093d4',
          '600': '#5c6bc0',
          '700': '#5661ac',
          '800': '#48528b',
          '900': '#3f4770',
          '950': '#252941'
        },
        tumbleweed: {
          '50': '#fdf5ef',
          '100': '#f9e8db',
          '200': '#f3cdb5',
          '300': '#e9a47d',
          '400': '#e18056',
          '500': '#da6035',
          '600': '#cc492a',
          '700': '#aa3724',
          '800': '#882e24',
          '900': '#6e2820',
          '950': '#3b120f'
        }
      }
    }
  },

  plugins: []
}

export default config
