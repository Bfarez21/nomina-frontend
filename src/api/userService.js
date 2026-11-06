//api/userService
import { fetchData } from './client';

export const getAllUsers = () => {
    return fetchData('/api/users', {
        method: 'GET'
    });
};