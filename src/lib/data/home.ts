import { BarChart3, Map as MapIcon, Navigation } from "lucide-react";

export const FEATURES_DATA = [
	{
		id: 1,
		title: "Peta Interaktif",
		description:
			"Navigasi wilayah Jakarta dengan peta WebGL beresolusi tinggi. Filter fasilitas berdasarkan kategori, kapasitas, dan status operasional secara seketika.",
		icon: MapIcon,
	},
	{
		id: 2,
		title: "Analisis Radius",
		description:
			"Temukan rumah sakit, sekolah, atau taman terdekat dari lokasi spesifik menggunakan algoritma pencarian radius (buffer) geospasial yang presisi.",
		icon: Navigation,
	},
	{
		id: 3,
		title: "Analitik Wilayah",
		description:
			"Dapatkan wawasan mendalam melalui dashboard analitik. Bandingkan sebaran infrastruktur antar kecamatan untuk identifikasi area prioritas.",
		icon: BarChart3,
	},
];
