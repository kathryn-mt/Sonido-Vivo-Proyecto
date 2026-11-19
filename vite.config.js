
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],

    server: {
        host: '0.0.0.0',

        proxy: {
            '/api': {
                target: 'http://172.31.47.94:3000',
                changeOrigin: true
            }
        }
    }
});
