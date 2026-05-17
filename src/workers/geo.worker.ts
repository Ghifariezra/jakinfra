import type {
	ClusterPoint,
	Facility,
	FacilityFilter,
	WorkerInMessage,
	WorkerOutMessage,
} from "@/lib/types/facility.types";

// ─── Rumus Pengukur Jarak (Haversine) ───
function calculateDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number,
): number {
	const R = 6371; // Radius bumi dalam KM
	const dLat = (lat2 - lat1) * (Math.PI / 180);
	const dLon = (lon2 - lon1) * (Math.PI / 180);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) *
			Math.cos(lat2 * (Math.PI / 180)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

// ─── Filter ───────────────────────────────────────────────────────────────────

function filterFacilities(
	data: Facility[],
	filter: FacilityFilter,
): Facility[] {
	return data.filter((f) => {
		if (filter.wilayah && f.nama_wilayah !== filter.wilayah) return false;
		if (filter.kecamatan && f.nama_kecamatan !== filter.kecamatan) return false;
		if (filter.jenis && f.jenis_sarana_kesehatan !== filter.jenis) return false;

		if (filter.search) {
			const q = filter.search.toLowerCase();
			return (
				f.nama_infrastruktur.toLowerCase().includes(q) ||
				f.alamat.toLowerCase().includes(q) ||
				f.nama_kelurahan.toLowerCase().includes(q)
			);
		}

		// LOGIKA CARI TERDEKAT LOKAL (SUPER CEPAT)
		if (filter.nearby) {
			const distance = calculateDistance(
				filter.nearby.lat,
				filter.nearby.lon,
				Number(f.lat ?? (f as any).latitude ?? 0),
				Number(f.lon ?? (f as any).lng ?? (f as any).longitude ?? 0),
			);
			// Jika jaraknya lebih besar dari radius yang diminta, buang data ini
			if (distance > filter.nearby.radius) return false;
		}

		return true;
	});
}

// ─── Cluster ──────────────────────────────────────────────────────────────────

function clusterFacilities(data: Facility[], zoom: number): ClusterPoint[] {
	const gridSize = Math.max(0.001, 0.5 / 2 ** (zoom - 10));
	const cells = new Map<string, Facility[]>();

	for (const f of data) {
		const cellX = Math.floor(f.lon / gridSize);
		const cellY = Math.floor(f.lat / gridSize);
		const key = `${cellX}:${cellY}`;

		const cell = cells.get(key);
		if (cell) {
			cell.push(f);
		} else {
			cells.set(key, [f]);
		}
	}

	const result: ClusterPoint[] = [];

	for (const [key, facilities] of cells) {
		const lat =
			facilities.reduce((sum, f) => sum + f.lat, 0) / facilities.length;
		const lon =
			facilities.reduce((sum, f) => sum + f.lon, 0) / facilities.length;

		result.push({
			id: key,
			lat,
			lon,
			count: facilities.length,
			facilities,
			isCluster: facilities.length > 1,
		});
	}

	return result;
}

// ─── Message Handler ──────────────────────────────────────────────────────────

// FIX: Gunakan WorkerInMessage agar Type Safe
self.onmessage = (e: MessageEvent<WorkerInMessage>) => {
	const { type, payload } = e.data;

	try {
		// PERINTAH SAPU JAGAT: Eksekusi Filter sekaligus Cluster
		if (type === "PROCESS_ALL") {
			// 1. Jalankan Filter terlebih dahulu
			const filteredData = filterFacilities(payload.data, payload.filter);

			// 2. Langsung Cluster hasil filterannya
			const clusteredData = clusterFacilities(filteredData, payload.zoom);

			// 3. Kirim kembali keduanya ke React secara bersamaan
			self.postMessage({
				type: "PROCESS_RESULT",
				payload: {
					filtered: filteredData,
					clusters: clusteredData,
				},
			} as WorkerOutMessage); // Cast untuk memastikan output juga type safe
			return;
		}

		// --- (Kode lama disisakan untuk kompabilitas tipe/cadangan jika masih mau dipanggil terpisah) ---
		if (type === "FILTER") {
			const result = filterFacilities(payload.data, payload.filter);
			self.postMessage({
				type: "FILTER_RESULT",
				payload: result,
			} as WorkerOutMessage);
			return;
		}

		if (type === "CLUSTER") {
			const result = clusterFacilities(payload.data, payload.zoom);
			self.postMessage({
				type: "CLUSTER_RESULT",
				payload: result,
			} as WorkerOutMessage);
			return;
		}
	} catch (err) {
		self.postMessage({
			type: "ERROR",
			payload: err instanceof Error ? err.message : "Unknown worker error",
		} as WorkerOutMessage);
	}
};
