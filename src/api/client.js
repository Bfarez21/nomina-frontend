const BASE_URL = 'http://localhost:5000/api';

export const fetchData = async (endpoint, options = {}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Error en la petición');
    }

    if (response.status === 204) return null;

    return response.json();
};