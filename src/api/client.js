const BASE_URL = 'http://localhost:5000';

export const fetchData = async (endpoint, options = {}) => {
    const token = localStorage.getItem('jwt_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    }
    const config ={
        ...options,
        headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (response.status === 404) return null;
    if (response.status === 204) return null;

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Error en la petición');
    }

    return response.json();
};