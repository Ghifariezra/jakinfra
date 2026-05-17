export interface Facility {
	id: string;
	idx?: number;
	periode_data: number;
	wilayah_id: string;
	nama_wilayah: string;
	kecamatan_id: string;
	nama_kecamatan: string;
	kelurahan_id: string;
	nama_kelurahan: string;
	jenis_sarana_id: string;
	jenis_sarana_kesehatan: string;
	nama_infrastruktur: string;
	alamat: string;
	lat: number;
	lon: number;
	created_at: string;
	updated_at: string;
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

export interface GetFacilitiesBBoxParams {
	min_lat: number;
	min_lon: number;
	max_lat: number;
	max_lon: number;
}

export interface FacilityFilter {
	wilayah?: string;
	kecamatan?: string;
	kelurahan?: string; // <--- UPDATE: Tambahkan kelurahan di sini
	jenis?: string;
	search?: string;
	nearby?: {
		lat: number;
		lon: number;
		radius: number;
	};
}

export interface ClusterPoint {
	id: string;
	lat: number;
	lon: number;
	count: number;
	facilities: Facility[];
	isCluster: boolean;
}

// ─── UPDATE: Tambahkan tipe PROCESS_ALL ───
export type WorkerInMessage =
	| { type: "FILTER"; payload: { data: Facility[]; filter: FacilityFilter } }
	| { type: "CLUSTER"; payload: { data: Facility[]; zoom: number } }
	| {
			type: "PROCESS_ALL";
			payload: { data: Facility[]; filter: FacilityFilter; zoom: number };
	  };

// ─── UPDATE: Tambahkan tipe PROCESS_RESULT ───
export type WorkerOutMessage =
	| { type: "FILTER_RESULT"; payload: Facility[] }
	| { type: "CLUSTER_RESULT"; payload: ClusterPoint[] }
	| {
			type: "PROCESS_RESULT";
			payload: { filtered: Facility[]; clusters: ClusterPoint[] };
	  }
	| { type: "ERROR"; payload: string };
