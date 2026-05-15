import { statsService } from "../services/stats.service";

export const getStatsSummaryAction = () => {
	return statsService.getSummary();
};

export const getStatsWilayahAction = (nama_wilayah?: string) => {
	return statsService.getWilayah(nama_wilayah);
};

export const getStatsJenisAction = () => {
	return statsService.getJenis();
};

export const getStatsKecamatanAction = (params?: {
	nama_wilayah?: string;
	nama_kecamatan?: string;
}) => {
	return statsService.getKecamatan(params);
};

export const getStatsDensityAction = (params?: {
	nama_wilayah?: string;
	order?: "asc" | "desc";
}) => {
	return statsService.getDensity(params);
};

export const getStatsBlankSpotAction = (params?: {
	jenis?: string;
	nama_wilayah?: string;
}) => {
	return statsService.getBlankSpot(params);
};
