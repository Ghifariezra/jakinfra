import * as turf from "@turf/turf";

// Event listener untuk menerima pesan (data) dari Main Thread (React)
self.onmessage = (event: MessageEvent) => {
	// Menerima data koordinat dari React
	const { point1, point2 } = event.data;

	console.log("👷‍♂️ [Worker] Menerima tugas menghitung jarak...");

	// Gunakan Turf.js untuk kalkulasi (Skenario simulasi tugas berat)
	const from = turf.point(point1);
	const to = turf.point(point2);
	const options = { units: "kilometers" as const };

	const distance = turf.distance(from, to, options);

	// Kirim kembali hasilnya ke Main Thread
	self.postMessage({
		status: "success",
		distance: distance.toFixed(2),
	});
};
