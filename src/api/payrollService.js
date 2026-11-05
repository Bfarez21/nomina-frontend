import { fetchData } from './client';

export const getMonthlyPayroll = (userId, year, month) => {
    return fetchData(`/api/payroll/user/${userId}?year=${year}&month=${month}`, {
        method: 'GET',
    });
};