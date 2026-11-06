import { API_URL } from "config";

export const fetchData = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // Si el body es FormData, dejamos que el navegador ponga el Content-Type automáticamente con su boundary.
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 404 || response.status === 204) return null;

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Error en la petición");
  }

  // Si la respuesta es texto plano (como en import-excel), la manejamos sin romper el parseo JSON
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};
