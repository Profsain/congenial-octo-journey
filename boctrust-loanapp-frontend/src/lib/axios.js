import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setToken } from "../redux/reducers/adminAuthReducer";
import { getRefreshToken } from "../services/refreshToken";
import { handleLogout } from "../services/logout";
import { useNavigate } from "react-router-dom";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`, // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Allows cookies to be sent with requests, required for refresh token in HttpOnly cookie
});

// Axios interceptor setup function
export const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.adminAuth.token); // Get the access token from Redux state

  // Request interceptor to attach access token to headers
  apiClient.interceptors.request.use(
    (config) => {
      if (accessToken && !config._retry) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token refresh
  apiClient.interceptors.response.use(
    (response) => response, // If the response is successful, return it directly
    async (error) => {
      const originalRequest = error.config;

      // Check if error status is 401 (Unauthorized) and retry hasn't been attempted
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true; // Mark this request as retried
   
        try {
          const { token: newAccessToken } = await getRefreshToken();

          dispatch(setToken(newAccessToken));

          console.log(newAccessToken, "newAccessToken")

          // Attach new token to the original request and retry it
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest); // Retry the original request
        } catch (refreshError) {
          console.error("Refresh token request failed", refreshError);
          await handleLogout();
          dispatch(logoutUser());
          navigate("/login");
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default apiClient;
