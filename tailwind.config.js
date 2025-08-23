/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
	darkMode: 'class',
    content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './vendor/laravel/jetstream/**/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/**/*.jsx',
    './resources/**/*.tsx',
    './resources/views/**/**/*.blade.php',
    './resources/**/**/*.jsx',
	'./components/ui/**/**/*.tsx',
    './app/Filament/**/*.php',
    './resources/views/filament/**/*.blade.php',
    './vendor/filament/**/*.blade.php',
    './resources/**/*.blade.php',
    './vendor/livewire-filemanager/filemanager/resources/views/*.blade.php',
    'node_modules/preline/dist/*.js',
],
theme: {
	extend: {
		boxShadow: {
			custom: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
			regular: 'rgba(0, 0, 0, 0.25) 2px 2px 2px, rgba(0, 0, 0, 0.22) 2px 2px 2px', 
			white: 'rgba(255, 255, 255, 0.25) 0px 14px 28px, rgba(255, 255, 255, 0.22) 0px 10px 10px',
		},
		scale: {
			'105': '1.05'
		},
		colors: {
			card: {
				DEFAULT: 'hsl(var(--card))',
				foreground: 'hsl(var(--card-foreground))'
			},
			dark: {
				primary: '#262626',
				secondary: '#313131',
				hover: '#d8d8d833',
			},
			light: {
				primary: '#e7e7e7',
				secondary: '#EFEFEF',
				thirdly: '#f6f6f6',
				hover: '#e7e7e7'
			},
			muted: {
				DEFAULT: 'hsl(var(--muted))',
				foreground: 'hsl(var(--muted-foreground))'
			},
			action: {
				// DEFAULT: '#356B8C',
				DEFAULT: '#007bff',
			},
			hover: {
				DEFAULT: '#007bff'
			},
			destructive:{
				DEFAULT: '#dc2626',
			    secondary: "#D84444"
			},
			input: 'hsl(var(--input))',
			ring: 'hsl(var(--ring))',
			chart: {
				'1': 'hsl(var(--chart-1))',
				'2': 'hsl(var(--chart-2))',
				'3': 'hsl(var(--chart-3))',
				'4': 'hsl(var(--chart-4))',
				'5': 'hsl(var(--chart-5))'
			},
			sidebar: {
				DEFAULT: 'hsl(var(--sidebar-background))',
				foreground: 'hsl(var(--sidebar-foreground))',
				primary: 'hsl(var(--sidebar-primary))',
				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
				accent: 'hsl(var(--sidebar-accent))',
				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
				border: 'hsl(var(--sidebar-border))',
				ring: 'hsl(var(--sidebar-ring))'
			}
		},
		keyframes: {
			'accordion-down': {
				from: {
					height: '0'
				},
				to: {
					height: 'var(--radix-accordion-content-height)'
				}
			},
			'accordion-up': {
				from: {
					height: 'var(--radix-accordion-content-height)'
				},
				to: {
					height: '0'
				}
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out'
		}
	}
},

plugins: [require("tailwindcss-animate"), require('preline/plugin'),],
}

