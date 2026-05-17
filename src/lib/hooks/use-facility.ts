import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
	fetchAllFacilities /* fetchFacilitiesByBBox */,
} from "../actions/facility.action";
import { useFacilityMapStore } from "../store/map.store";
import type { WorkerOutMessage } from "../types/facility.types"; // FIX: Import tipe ini

export function useFacilityMap(zoom = 12) {
	const workerRef = useRef<Worker | null>(null);

	const {
		allFacilities,
		filter,
		// bbox, // <--- BBOX dinonaktifkan sementara
		setAllFacilities,
		setFilteredFacilities,
		setClusterPoints,
		setLoading,
		setWorkerProcessing,
		setError,
	} = useFacilityMapStore();

	// ── 1. Init worker sekali ──
	useEffect(() => {
		workerRef.current = new Worker(
			new URL("../../workers/geo.worker.ts", import.meta.url),
			{ type: "module" },
		);

		// FIX: Gunakan WorkerOutMessage agar tidak ada error any
		workerRef.current.onmessage = (e: MessageEvent<WorkerOutMessage>) => {
			const { type, payload } = e.data;

			if (type === "PROCESS_RESULT") {
				setFilteredFacilities(payload.filtered);
				setClusterPoints(payload.clusters);
				setWorkerProcessing(false);
				return;
			}

			if (type === "ERROR") {
				setError(payload);
				setWorkerProcessing(false);
			}
		};

		return () => workerRef.current?.terminate();
	}, [setClusterPoints, setError, setFilteredFacilities, setWorkerProcessing]);

	// =========================================================================
	// ── 2A. Fetch via React Query (MODE: LOAD SEMUA DATA - AKTIF) ──
	// =========================================================================
	const { isLoading, data } = useQuery({
		queryKey: ["facilities-all"],
		queryFn: () => fetchAllFacilities(),
		staleTime: 1000 * 60 * 60, // Cache 1 jam
	});

	// =========================================================================
	// ── 2B. Fetch via React Query (MODE: BBOX - NONAKTIF SEMENTARA) ──
	// =========================================================================
	/*
    const { isLoading, data } = useQuery({
        queryKey: ["facilities-bbox", bbox],
        queryFn: () => fetchFacilitiesByBBox(bbox!),
        enabled: !!bbox,
        staleTime: 1000 * 60 * 5, 
    });
    */

	useEffect(() => {
		if (data) setAllFacilities(data);
	}, [data, setAllFacilities]);

	useEffect(() => {
		setLoading(isLoading);
	}, [isLoading, setLoading]);

	// ── 3. Eksekusi Worker (Sapu Jagat) ──
	useEffect(() => {
		if (!workerRef.current || allFacilities.length === 0) {
			if (allFacilities.length === 0 && !isLoading) {
				setFilteredFacilities([]);
				setClusterPoints([]);
			}
			return;
		}

		setWorkerProcessing(true);
		workerRef.current.postMessage({
			type: "PROCESS_ALL",
			payload: {
				data: allFacilities,
				filter: filter,
				zoom: zoom,
			},
		});
	}, [
		allFacilities,
		filter,
		zoom,
		isLoading,
		setWorkerProcessing,
		setFilteredFacilities,
		setClusterPoints,
	]);

	return { isLoading };
}
