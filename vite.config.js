import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 
                    'resources/js/app.jsx',
                    'resources/css/filament/admin/theme.css'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
          '@': '/resources/js',
        },
      },
    build: {
        sourcemap: true,  // Enable source maps in Vite
      }
});
