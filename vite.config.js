import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 
                    'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
        tsconfigPaths()
    ],
    server: {
    host: 'localhost', // not 0.0.0.0
    port: 5174,
    strictPort: true,
  }
});
