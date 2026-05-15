export interface StatsSummary {
	total_fasilitas: number;
	total_wilayah: number;
	total_kecamatan: number;
	total_kelurahan: number;
	total_jenis_sarana: number;
	periode_awal: number;
	periode_akhir: number;
}

export interface StatsWilayah {
	wilayah_id: string;
	nama_wilayah: string;
	total_fasilitas: number;
	persentase_distribusi: number;
	layanan_dasar: number;
	layanan_rujukan: number;
	rasio_dasar_per_rs: number;
}

export interface StatsJenis {
	jenis_sarana_id: string;
	jenis_sarana_kesehatan: string;
	jumlah: number;
	persentase: number;
}

export interface StatsKecamatan {
	nama_wilayah: string;
	kecamatan_id: string;
	nama_kecamatan: string;
	total_fasilitas: number;
	kelurahan_terlayani: number;
	total_kelurahan: number;
	pct_kelurahan_terlayani: number;
}

export interface StatsDensity {
	nama_wilayah: string;
	nama_kecamatan: string;
	total_kelurahan: number;
	total_fasilitas: number;
	faskes_per_kelurahan: number;
}

export interface StatsBlankSpot {
	nama_wilayah: string;
	nama_kecamatan: string;
	kelurahan_id: string;
	nama_kelurahan: string;
	jenis_sarana_id: string;
	jenis_sarana_kesehatan: string;
}
