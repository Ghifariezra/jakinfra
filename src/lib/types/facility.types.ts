export interface Facility {
	id: string;
	periode_data: number;
	wilayah_id?: string;
	nama_wilayah: string;
	kecamatan_id?: string;
	nama_kecamatan: string;
	kelurahan_id?: string;
	nama_kelurahan: string;
	jenis_sarana_id?: string;
	jenis_sarana_kesehatan: string;
	nama_infrastruktur: string;
	alamat: string;
	lat: number;
	lon: number;
	created_at?: string;
	updated_at?: string;
}

export interface GetFacilitiesParams {
	limit?: number;
	offset?: number;
}

export interface GetNearbyFacilitiesParams {
	lat: number;
	lon: number;
	radius?: number;
}
