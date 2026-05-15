import { useQuery } from "@tanstack/react-query";
import {
	getStatsBlankSpotAction,
	getStatsDensityAction,
	getStatsJenisAction,
	getStatsKecamatanAction,
	getStatsSummaryAction,
	getStatsWilayahAction,
} from "../actions/stats.action";

export const statsKeys = {
	all: ["stats"] as const,
	summary: () => [...statsKeys.all, "summary"] as const,
	wilayah: (nama_wilayah?: string) =>
		[...statsKeys.all, "wilayah", { nama_wilayah }] as const,
	jenis: () => [...statsKeys.all, "jenis"] as const,
	kecamatan: (params?: { nama_wilayah?: string; nama_kecamatan?: string }) =>
		[...statsKeys.all, "kecamatan", params] as const,
	density: (params?: { nama_wilayah?: string; order?: "asc" | "desc" }) =>
		[...statsKeys.all, "density", params] as const,
	blankSpot: (params?: { jenis?: string; nama_wilayah?: string }) =>
		[...statsKeys.all, "blank-spot", params] as const,
};

export const useStatsSummary = () => {
	return useQuery({
		queryKey: statsKeys.summary(),
		queryFn: () => getStatsSummaryAction(),
		staleTime: 1000 * 60 * 5, // 5 menit cache
	});
};

export const useStatsWilayah = (nama_wilayah?: string) => {
	return useQuery({
		queryKey: statsKeys.wilayah(nama_wilayah),
		queryFn: () => getStatsWilayahAction(nama_wilayah),
		staleTime: 1000 * 60 * 5, // 5 menit cache
	});
};

export const useStatsJenis = () => {
	return useQuery({
		queryKey: statsKeys.jenis(),
		queryFn: () => getStatsJenisAction(),
		staleTime: 1000 * 60 * 60, // 1 jam cache karena data master kategori jarang berubah
	});
};

export const useStatsKecamatan = (params?: {
	nama_wilayah?: string;
	nama_kecamatan?: string;
}) => {
	return useQuery({
		queryKey: statsKeys.kecamatan(params),
		queryFn: () => getStatsKecamatanAction(params),
		staleTime: 1000 * 60 * 5,
	});
};

export const useStatsDensity = (params?: {
	nama_wilayah?: string;
	order?: "asc" | "desc";
}) => {
	return useQuery({
		queryKey: statsKeys.density(params),
		queryFn: () => getStatsDensityAction(params),
		staleTime: 1000 * 60 * 5,
	});
};

export const useStatsBlankSpot = (params?: {
	jenis?: string;
	nama_wilayah?: string;
}) => {
	return useQuery({
		queryKey: statsKeys.blankSpot(params),
		queryFn: () => getStatsBlankSpotAction(params),
		staleTime: 1000 * 60 * 5,
	});
};
