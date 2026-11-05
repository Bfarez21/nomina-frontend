import { fetchData } from './client';

export const loginApi = (credentials) =>
    fetchData('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });

export const registerApi = (userData) =>
    fetchData('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });