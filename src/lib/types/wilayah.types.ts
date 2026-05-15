export interface Wilayah {
	id: string;
	nama_wilayah: string;
}

export interface Kecamatan {
	id: string;
	wilayah_id: string;
	nama_wilayah: string;
	nama_kecamatan: string;
}

export interface Kelurahan {
	id: string;
	kecamatan_id: string;
	nama_kecamatan: string;
	nama_wilayah: string;
	nama_kelurahan: string;
}

export interface GetWilayahParams {
	search?: string;
}

export interface GetKecamatanParams {
	search?: string;
}

export interface GetKelurahanParams {
	kecamatan_id?: string;
	search?: string;
}
