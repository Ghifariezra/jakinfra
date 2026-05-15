import type {
	GetKecamatanParams,
	GetKelurahanParams,
	GetWilayahParams,
	Kecamatan,
	Kelurahan,
	Wilayah,
} from "../types/wilayah.types";
import { BaseService } from "./base.service";

export class WilayahService extends BaseService {
	/**
	 * Menampilkan data nama-nama wilayah (kabupaten/kota administratif).
	 */
	public async getAll(params?: GetWilayahParams): Promise<Wilayah[]> {
		return this.get<Wilayah[]>("/wilayah", { params });
	}

	/**
	 * Menampilkan rincian data suatu wilayah berdasarkan spesifik id.
	 */
	public async getById(id: string): Promise<Wilayah> {
		return this.get<Wilayah>(`/wilayah/${id}`);
	}

	/**
	 * Menampilkan daftar kecamatan dalam suatu wilayah.
	 */
	public async getKecamatan(
		id: string,
		params?: GetKecamatanParams,
	): Promise<Kecamatan[]> {
		return this.get<Kecamatan[]>(`/wilayah/${id}/kecamatan`, { params });
	}

	/**
	 * Menampilkan daftar kelurahan berdasarkan ID kecamatan di suatu wilayah.
	 */
	public async getKelurahan(
		id: string,
		params?: GetKelurahanParams,
	): Promise<Kelurahan[]> {
		return this.get<Kelurahan[]>(`/wilayah/${id}/kelurahan`, { params });
	}
}

export const wilayahService = WilayahService.getInstance();
