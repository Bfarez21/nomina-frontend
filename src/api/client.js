const BASE_URL = 'http://localhost:5000/API';

export const fetchData = async (endpoint, options ={}) =>{
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if(!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'error en la peticion');
    }
    if(response.status === 200) return null;
    return response.json();
};