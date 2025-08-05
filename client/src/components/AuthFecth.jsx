// utils/authFetch.js
import axios from "axios";

// Crea una instancia de Axios
const authFetch = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // importante para enviar la cookie del refreshToken
});

// Interceptor para añadir el token en cada request
authFetch.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar expiración de token
authFetch.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si token expiró, intenta renovar con refreshToken
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://localhost:3000/api/auth/refresh",
          null,
          {
            withCredentials: true,
          }
        );

        const newToken = res.data.accessToken;
        localStorage.setItem("token", newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return authFetch(originalRequest); // Reintenta la petición original
      } catch (refreshError) {
        console.error("No se pudo refrescar el token", refreshError);
        localStorage.removeItem("token");
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default authFetch;
