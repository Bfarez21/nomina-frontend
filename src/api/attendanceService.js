import { fetchData} from "./client";
import { API_URL } from "../config";

// registra marcacion user
export const registerClock = (userId, action) => {
  return fetchData(`/api/attendance/clock`, {
    method: "POST",
    body: JSON.stringify({ userId, action }),
  });
};

//obtener maraciones por fecha de un empleado
export const getTodayAttendance = (userId, dateStr) =>
    fetchData(`/api/attendance/user/${userId}/date/${dateStr}`);

//   historial filtrado por año y mes
export const getMonthlyAttendanceHistory = (userId, year, month) => {
    return fetchData(`/api/attendance/user/${userId}/history/monthly?year=${year}&month=${month}`, {
        method: 'GET'
    });
};

// Cargar archivo Excel de asistencia
export const uploadAttendanceExcel = (file, userId, year, month) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);
  formData.append('year', year);
  formData.append('month', month);

  return fetchData('/api/attendance/import-excel', {
    method: 'POST',
    body: formData,
  });
};
