import preset from '../../../../vendor/filament/filament/tailwind.config.preset'

export default {
    presets: [preset],
    content: [
        './app/Filament/**/*.php',
        './resources/views/filament/**/*.blade.php',
        './vendor/filament/**/*.blade.php',
        './resources/views/**/*.blade.php',
        './app/Filament/**/*.php',
        './app/Livewire/**/*.php',
    ],
    theme: {
        screens: {
          sm: '480px',
          md: '768px',
          lg: '976px',
          xl: '1440px',
        },
        colors: {
          'blue': '#1fb6ff',
          'purple': '#7e5bef',
          'pink': '#ff49db',
          'orange': '#ff7849',
          'green': '#13ce66',
          'yellow': '#ffc82c',
          'gray-dark': '#273444',
          'gray': '#8492a6',
          'gray-light': '#d3dce6',
        },
        fontFamily: {
          sans: ['Graphik', 'sans-serif'],
          serif: ['Merriweather', 'serif'],
        },
        extend: {
          spacing: {
            '128': '32rem',
            '144': '36rem',
          },
          borderRadius: {
            'xl': '2rem',
          }
        }
      }
}
