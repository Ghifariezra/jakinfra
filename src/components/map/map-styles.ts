export const JENIS_COLOR: Record<string, string> = {
	"Rumah Sakit Umum": "#ef4444",
	"Rumah Sakit Khusus": "#f97316",
	Puskesmas: "#6bd8cb",
	"Klinik Utama": "#8b5cf6",
	"Klinik Pratama": "#a78bfa",
	Apotek: "#3b82f6",
	Laboratorium: "#f59e0b",
};

export function getMarkerColor(jenis: string): string {
	return JENIS_COLOR[jenis] ?? "#64748b";
}

export const boundaryFillStyle = {
	id: "jakarta-fill",
	type: "fill" as const,
	paint: { "fill-color": "#29a195", "fill-opacity": 0.05 },
};

export const boundaryLineStyle = {
	id: "jakarta-line",
	type: "line" as const,
	paint: {
		"line-color": "#6bd8cb",
		"line-width": 1.5,
		"line-opacity": 0.8,
		"line-dasharray": [4, 2],
	},
};

// ─── STYLE BARU: Untuk Sorotan Wilayah (Kota) ───
export const cityHighlightStyle = {
	id: "city-highlight-line",
	type: "line" as const,
	paint: {
		"line-color": "#5de6ff", // Biru muda cerah (dari --color-cyan Anda)
		"line-width": 4,
		"line-opacity": 0.9,
	},
};

export const cityFillStyle = {
	id: "city-highlight-fill",
	type: "fill" as const,
	paint: {
		"line-color": "#5de6ff",
		"fill-color": "#5de6ff",
		"fill-opacity": 0.1,
	},
};

// ─── STYLE BARU: Untuk Sorotan Kecamatan ───
export const kecamatanHighlightStyle = {
	id: "kecamatan-highlight-line",
	type: "line" as const,
	paint: {
		"line-color": "#14b8a6", // Teal menyala
		"line-width": 3,
		"line-opacity": 1,
	},
};

export const kecamatanFillStyle = {
	id: "kecamatan-highlight-fill",
	type: "fill" as const,
	paint: {
		"fill-color": "#14b8a6",
		"fill-opacity": 0.15,
	},
};

// ─── STYLE BARU: Untuk Sorotan Kelurahan ───
export const kelurahanHighlightStyle = {
	id: "kelurahan-highlight-line",
	type: "line" as const,
	paint: {
		"line-color": "#8b5cf6", // Violet
		"line-width": 2.5,
		"line-opacity": 1,
	},
};

export const kelurahanFillStyle = {
	id: "kelurahan-highlight-fill",
	type: "fill" as const,
	paint: {
		"fill-color": "#8b5cf6",
		"fill-opacity": 0.15,
	},
};

export const clusterLayer = {
	id: "clusters",
	type: "circle" as const,
	filter: ["==", "isCluster", true],
	paint: {
		"circle-color": "rgba(107, 216, 203, 0.9)",
		"circle-stroke-width": 2,
		"circle-stroke-color": "#ffffff",
		"circle-radius": ["step", ["get", "count"], 15, 20, 20, 50, 25, 100, 30],
	},
};

export const clusterCountLayer = {
	id: "cluster-count",
	type: "symbol" as const,
	filter: ["==", "isCluster", true],
	layout: {
		"text-field": "{count}",
		"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
		"text-size": 12,
	},
	paint: {
		"text-color": "#ffffff",
	},
};

export const unclusteredPointLayer = {
	id: "unclustered-point",
	type: "circle" as const,
	filter: ["==", "isCluster", false],
	paint: {
		"circle-radius": 6,
		"circle-stroke-width": 2,
		"circle-stroke-color": "#ffffff",
		"circle-color": [
			"match",
			["get", "jenis"],
			"Rumah Sakit Umum",
			"#ef4444",
			"Rumah Sakit Khusus",
			"#f97316",
			"Puskesmas",
			"#6bd8cb",
			"Klinik Utama",
			"#8b5cf6",
			"Klinik Pratama",
			"#a78bfa",
			"Apotek",
			"#3b82f6",
			"Laboratorium",
			"#f59e0b",
			"#64748b",
		],
	},
};
