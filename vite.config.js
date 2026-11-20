import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(function (config) {

    // Obtener las variables de entorno
    const env = loadEnv(
        config.mode,
        process.cwd(),
        'VITE_'
    );

    // Dirección del backend para este entorno
    const backendURL =
        env.VITE_API_PROXY_TARGET ||
        'http://172.31.47.94:3000';

    return {

        plugins: [react()],

        server: {

            host: '0.0.0.0',

            proxy: {

                '/api': {

                    target: backendURL,

                    changeOrigin: true

                }

            }

        }

    };
});