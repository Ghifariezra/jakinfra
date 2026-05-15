import type {
	StatsBlankSpot,
	StatsDensity,
	StatsJenis,
	StatsKecamatan,
	StatsSummary,
	StatsWilayah,
} from "../types/stats.types";
import { BaseService } from "./base.service";

export class StatsService extends BaseService {
	/**
	 * Mengembalikan rangkuman keseluruhan seluruh wilayah.
	 */
	public async getSummary(): Promise<StatsSummary> {
		return this.get<StatsSummary>("/stats/summary");
	}

	/**
	 * Mengumpulkan statistik berdasarkan pengelompokan tingkat wilayah.
	 */
	public async getWilayah(nama_wilayah?: string): Promise<StatsWilayah[]> {
		return this.get<StatsWilayah[]>("/stats/wilayah", {
			params: { nama_wilayah },
		});
	}

	/**
	 * Menyajikan statistik penyebaran tiap kategori layanan kesehatan.
	 */
	public async getJenis(): Promise<StatsJenis[]> {
		return this.get<StatsJenis[]>("/stats/jenis");
	}

	/**
	 * Menampilkan tingkat keterisian fasilitas pada level kecamatan.
	 */
	public async getKecamatan(params?: {
		nama_wilayah?: string;
		nama_kecamatan?: string;
	}): Promise<StatsKecamatan[]> {
		return this.get<StatsKecamatan[]>("/stats/kecamatan", { params });
	}

	/**
	 * Menghitung kepadatan/density fasilitas tiap area.
	 */
	public async getDensity(params?: {
		nama_wilayah?: string;
		order?: "asc" | "desc";
	}): Promise<StatsDensity[]> {
		return this.get<StatsDensity[]>("/stats/density", { params });
	}

	/**
	 * Analitik daerah dengan minim ases atau kelurahan yang sama sekali tidak ada sarana.
	 */
	public async getBlankSpot(params?: {
		jenis?: string;
		nama_wilayah?: string;
	}): Promise<StatsBlankSpot[]> {
		return this.get<StatsBlankSpot[]>("/stats/blank-spot", { params });
	}
}

export const statsService = StatsService.getInstance();
