import axios from 'axios';
import { getSession } from "next-auth/react";

const apiUrl = process.env.NEXT_PUBLIC_QUERY_BRIDGE_API_URL;

const axiosInstance = axios.create({
    baseURL: apiUrl,
});

axiosInstance.defaults.withCredentials = true;

// Interceptor para añadir el token a cada petición
axiosInstance.interceptors.request.use(async (config) => {
    const session = await getSession();
    if (session && session.accessToken) {
        config.headers['Authorization'] = `Bearer ${session.accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
