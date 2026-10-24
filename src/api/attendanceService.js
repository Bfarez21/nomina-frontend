import { fetchData} from "./client";
// obtener lista de empleados
export const getUsers = ()=> fetchData('/users');

//create user
export const createUser = (userData) =>
    fetchData('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    });

// registra marcacion user
export const registerClock = (userId, customTimestamp = null) =>
    fetchData('/attendance/clock', {
        method: 'POST',
        body: JSON.stringify({
            userId: Number(userId),
            customTimestamp
        }),
    });

//obtener maraciones por fecha de un empleado
export const getTodayAttendance = (userId, dateStr) =>
    fetchData(`/attendance/user/${userId}/date/${dateStr}`);