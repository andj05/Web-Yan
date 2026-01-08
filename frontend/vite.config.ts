import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    base: '/',  // Ruta base (usar '/' para Netlify, '/Web-Yan/' para GitHub Pages)
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
        open: true,
    },
});
