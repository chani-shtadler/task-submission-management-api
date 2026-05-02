import axios from 'axios';

const API = axios.create({
    // ודאי שהמספר 3000 הוא הפורט שהשרת שלך באמת רץ עליו
    baseURL: 'http://localhost:3000', 
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;