import axios, {
	type AxiosError,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";
import { type ApiErrorResponse, AppError } from "./error";

const api = axios.create({
	baseURL:
		import.meta.env.MODE === "development"
			? "/api/v1"
			: import.meta.env.VITE_API_URL,
	timeout: 10000, // Timeout 10 detik sebagai standar
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const apiKey =
			localStorage.getItem("api_key") || import.meta.env.VITE_API_KEY;

		if (apiKey && config.headers) {
			config.headers["x-api-key"] = apiKey;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

api.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	(error: AxiosError<ApiErrorResponse>) => {
		if (error.response?.data) {
			const { message, code, details } = error.response.data;
			return Promise.reject(
				new AppError(
					message || "Terjadi kesalahan dari server",
					code || error.code || "SERVER_ERROR",
					details,
				),
			);
		}

		return Promise.reject(
			new AppError(
				error.message || "Terjadi kesalahan jaringan, silakan coba lagi",
				"NETWORK_ERROR",
			),
		);
	},
);

export default api;
