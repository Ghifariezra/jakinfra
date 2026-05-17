import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Hook reusable untuk mengambil file Markdown (.md) dari URL eksternal
 * * @param url URL lengkap menuju file raw (misal: raw.githubusercontent.com/...)
 * @param queryKey Array string unik untuk caching TanStack Query
 */
export function useMarkdown(url: string, queryKey: string[]) {
	return useQuery({
		queryKey,
		queryFn: async () => {
			// Gunakan axios murni untuk menghindari interceptor API internal JakInfra
			const response = await axios.get(url, {
				// Penting: Beritahu Axios bahwa kita mengharapkan teks biasa, bukan JSON
				responseType: "text",
			});

			return response.data;
		},
		// Cache dokumen selama 1 jam agar hemat kuota dan super cepat saat pindah halaman
		staleTime: 60 * 60 * 1000,
	});
}
