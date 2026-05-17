import type {
	Facility,
	GetFacilitiesBBoxParams,
	GetFacilitiesParams,
	GetNearbyFacilitiesParams,
} from "../types/facility.types";
import { BaseService } from "./base.service";

export class FacilityService extends BaseService {
	public async getAll(params?: GetFacilitiesParams): Promise<Facility[]> {
		return this.get<Facility[]>("/facility", { params });
	}

	public async getNearby(
		params: GetNearbyFacilitiesParams,
	): Promise<Facility[]> {
		return this.get<Facility[]>("/facility/nearby", { params });
	}

	public async getByBBox(params: GetFacilitiesBBoxParams): Promise<Facility[]> {
		return this.get<Facility[]>("/facility/bbox", { params });
	}
}

export const facilityService = FacilityService.getInstance();
