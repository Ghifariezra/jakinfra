import { facilityService } from "../services/facility.service";
import type {
	Facility,
	GetFacilitiesBBoxParams,
	GetFacilitiesParams,
	GetNearbyFacilitiesParams,
} from "../types/facility.types";

const PAGE_SIZE = 1000; // Supabase max per request
const PARALLEL_BATCHES = 5; // Ambil 5 halaman (5000 data) sekaligus secara paralel

export async function fetchAllFacilities(
	_?: GetFacilitiesParams,
): Promise<Facility[]> {
	const results: Facility[] = [];
	let currentOffset = 0;
	let hasMore = true;

	while (hasMore) {
		// 1. Siapkan keranjang janji (promises) untuk ditembakkan bersamaan
		const promises = [];
		for (let i = 0; i < PARALLEL_BATCHES; i++) {
			promises.push(
				facilityService.getAll({
					limit: PAGE_SIZE,
					offset: currentOffset + i * PAGE_SIZE,
				}),
			);
		}

		// 2. Tembakkan ke-5 request (5000 data) secara BERSAMAAN
		const pages = await Promise.all(promises);

		// 3. Gabungkan hasil dari ke-5 halaman tersebut
		for (const page of pages) {
			results.push(...page);

			// Jika ada satu halaman saja yang isinya kurang dari PAGE_SIZE (1000),
			// berarti itu adalah halaman paling ujung dan data sudah habis.
			if (page.length < PAGE_SIZE) {
				hasMore = false;
				break;
			}
		}

		// 4. Majukan offset untuk putaran batch berikutnya (jika data > 5000)
		currentOffset += PAGE_SIZE * PARALLEL_BATCHES;
	}

	return results;
}

export async function fetchNearbyFacilities(
	params: GetNearbyFacilitiesParams,
): Promise<Facility[]> {
	return facilityService.getNearby(params);
}

export async function fetchFacilitiesByBBox(
	params: GetFacilitiesBBoxParams,
): Promise<Facility[]> {
	return facilityService.getByBBox(params);
}
