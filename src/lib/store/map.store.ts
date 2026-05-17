import { create } from "zustand";
import type {
	ClusterPoint,
	Facility,
	FacilityFilter,
} from "../types/facility.types";

// Definisikan tipe untuk BBOX
export type BBox = {
	min_lat: number;
	min_lon: number;
	max_lat: number;
	max_lon: number;
};

interface FacilityMapState {
	// Raw data dari API
	allFacilities: Facility[];
	// Data setelah difilter/cluster oleh worker
	filteredFacilities: Facility[];
	clusterPoints: ClusterPoint[];

	// UI & Spatial state
	filter: FacilityFilter;
	bbox: BBox | null; // <--- 1. Tambahkan state BBOX
	selectedFacility: Facility | null;
	isLoading: boolean;
	isWorkerProcessing: boolean;
	error: string | null;

	// Actions
	setAllFacilities: (data: Facility[]) => void;
	setFilteredFacilities: (data: Facility[]) => void;
	setClusterPoints: (data: ClusterPoint[]) => void;
	setFilter: (filter: Partial<FacilityFilter>) => void;
	setBbox: (bbox: BBox | null) => void; // <--- 2. Tambahkan action BBOX
	setSelectedFacility: (facility: Facility | null) => void;
	setLoading: (loading: boolean) => void;
	setWorkerProcessing: (processing: boolean) => void;
	setError: (error: string | null) => void;
	resetFilter: () => void;
}

const defaultFilter: FacilityFilter = {
	wilayah: undefined,
	kecamatan: undefined,
	jenis: undefined,
	search: undefined,
};

export const useFacilityMapStore = create<FacilityMapState>((set) => ({
	allFacilities: [],
	filteredFacilities: [],
	clusterPoints: [],
	filter: defaultFilter,
	bbox: null, // <--- 3. Nilai awal BBOX
	selectedFacility: null,
	isLoading: false,
	isWorkerProcessing: false,
	error: null,

	setAllFacilities: (data) => set({ allFacilities: data }),
	setFilteredFacilities: (data) => set({ filteredFacilities: data }),
	setClusterPoints: (data) => set({ clusterPoints: data }),
	setFilter: (filter) =>
		set((state) => ({ filter: { ...state.filter, ...filter } })),
	setBbox: (bbox) => set({ bbox }), // <--- 4. Implementasi setBbox
	setSelectedFacility: (facility) => set({ selectedFacility: facility }),
	setLoading: (loading) => set({ isLoading: loading }),
	setWorkerProcessing: (processing) => set({ isWorkerProcessing: processing }),
	setError: (error) => set({ error }),
	resetFilter: () => set({ filter: defaultFilter }),
}));
