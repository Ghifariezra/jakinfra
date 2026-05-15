import type {
	Facility,
	GetFacilitiesParams,
	GetNearbyFacilitiesParams,
} from "../types/facility.types";
import { BaseService } from "./base.service";

export class FacilityService extends BaseService {
	/**
	 * Mendapatkan semua data infrastruktur/fasilitas kesehatan dengan pagination.
	 */
	public async getAll(params?: GetFacilitiesParams): Promise<Facility[]> {
		return this.get<Facility[]>("/facility", { params });
	}

	/**
	 * Mencari fasilitas kesehatan terdekat dalam radius tertentu berdasarkan koordinat.
	 */
	public async getNearby(
		params: GetNearbyFacilitiesParams,
	): Promise<Facility[]> {
		return this.get<Facility[]>("/facility/nearby", { params });
	}
}

export const facilityService = FacilityService.getInstance();
