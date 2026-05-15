import { QueryClient } from "@tanstack/react-query";
import { AppError, handleError } from "./error";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false, // Jangan fetch ulang saat user ganti tab
			retry: (failureCount, error) => {
				// Coba ulang maksimal 2 kali hanya untuk Network Error
				if (
					error instanceof AppError &&
					error.code === "NETWORK_ERROR" &&
					failureCount < 2
				) {
					return true;
				}
				return false;
			},
			staleTime: 1000 * 60 * 5, // Default 5 menit agar tidak terus-terusan hit request
			throwOnError: false, // Biarkan error ditangkap di onError secara manual lewat hooks/komponen
		},
		mutations: {
			retry: false, // Jangan coba ulang mutasi otomatis (seperti create keys/post)
			onError: (error) => {
				// Logging error jika dibutuhkan untuk mutations global (misal toast)
				const appError = handleError(error);
				console.error("[Mutation Error]:", appError.message);
			},
		},
	},
});
