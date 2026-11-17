import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Agregar JWT automáticamente a las solicitudes
api.interceptors.request.use(
    function (config) {
        const token = sessionStorage.getItem(
            'sonido_vivo_token'
        );

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default api;