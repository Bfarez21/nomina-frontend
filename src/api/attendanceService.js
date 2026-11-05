import { fetchData} from "./client";
// obtener lista de empleados
export const getUsers = ()=> fetchData('/api/users');

//create user
export const createUser = (userData) =>
    fetchData('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    });

// registra marcacion user
export const registerClock = (userId, customTimestamp = null) =>
    fetchData('/api/attendance/clock', {
        method: 'POST',
        body: JSON.stringify({
            userId: Number(userId),
            customTimestamp
        }),
    });

//obtener maraciones por fecha de un empleado
export const getTodayAttendance = (userId, dateStr) =>
    fetchData(`/api/attendance/user/${userId}/date/${dateStr}`);

//   historial filtrado por año y mes
export const getMonthlyAttendanceHistory = (userId, year, month) => {
    return fetchData(`/api/attendance/user/${userId}/history/monthly?year=${year}&month=${month}`, {
        method: 'GET'
    });
};

// data excel
// src/api/attendanceService.js

export const uploadAttendanceExcel = async (file, userId, year, month) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('year', year);
    formData.append('month', month);

    // Obtener el token JWT de las ubicaciones posibles en localStorage
    const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');

    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // IMPORTANTE: NO agregar 'Content-Type': 'multipart/form-data' manualmente.
    // El navegador asigna automáticamente el Content-Type adecuado con su boundary al enviar FormData.
    const response = await fetch('http://localhost:5000/api/attendance/import-excel', {
        method: 'POST',
        headers: headers,
        body: formData,
    });

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(responseText || `Error ${response.status}: No se pudo procesar el archivo Excel`);
    }

    return responseText;
};
