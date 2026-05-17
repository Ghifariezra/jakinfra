/** biome-ignore-all lint/suspicious/noExplicitAny: ... */

import { Layers, Loader2 } from "lucide-react";
import { Head } from "@/components/common/head";
import { useTheme } from "@/components/contexts/theme-provider";
import { useFacilityMap } from "@/lib/hooks/use-facility";
import { useFacilityMapStore } from "@/lib/store/map.store";
import type { Facility } from "@/lib/types/facility.types";
import "maplibre-gl/dist/maplibre-gl.css";
import { gpx } from "@tmcw/togeojson";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MapGL, {
	Layer,
	type MapMouseEvent,
	type MapRef,
	Marker,
	NavigationControl,
	Source,
	type ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import { FacilityPopup, MapPopupStyle } from "@/components/map/facility-popup";
import { MapSidebar } from "@/components/map/map-sidebar";
import {
	boundaryFillStyle,
	boundaryLineStyle,
	cityFillStyle,
	cityHighlightStyle,
	clusterCountLayer,
	clusterLayer,
	JENIS_COLOR,
	kecamatanFillStyle,
	kecamatanHighlightStyle,
	kelurahanFillStyle,
	kelurahanHighlightStyle,
	unclusteredPointLayer,
} from "@/components/map/map-styles";
import cityGpxUrl from "@/lib/data/city.gpx?url";
import neighborhoodGpxUrl from "@/lib/data/neighborhood.gpx?url"; // File kelurahan
// ─── IMPORT 4 FILE GPX ───
import provinceGpxUrl from "@/lib/data/province.gpx?url";
import subdistrictGpxUrl from "@/lib/data/sub-district.gpx?url";
import { WILAYAH_OSM_MAP } from "../data/geo";

interface ViewState {
	longitude: number;
	latitude: number;
	zoom: number;
}

export function RouteComponent() {
	const [viewState, setViewState] = useState<ViewState>({
		longitude: 106.827,
		latitude: -6.2088,
		zoom: 11,
	});
	const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
		null,
	);

	// ─── STATE GEOJSON ───
	const [provinceGeoJSON, setProvinceGeoJSON] = useState<any>(null);
	const [cityGeoJSON, setCityGeoJSON] = useState<any>(null);
	const [subdistrictGeoJSON, setSubdistrictGeoJSON] = useState<any>(null);
	const [neighborhoodGeoJSON, setNeighborhoodGeoJSON] = useState<any>(null);

	const mapRef = useRef<MapRef>(null);
	const { theme } = useTheme();

	const {
		allFacilities,
		clusterPoints,
		filteredFacilities,
		filter,
		isWorkerProcessing,
	} = useFacilityMapStore();

	const { isLoading } = useFacilityMap(viewState.zoom);

	// ─── LOGIKA PARSING KE-4 GPX ───
	useEffect(() => {
		async function loadAndParseGpx() {
			try {
				const parser = new DOMParser();

				const [provRes, cityRes, subRes, neighRes] = await Promise.all([
					fetch(provinceGpxUrl),
					fetch(cityGpxUrl),
					fetch(subdistrictGpxUrl),
					fetch(neighborhoodGpxUrl),
				]);

				const provDoc = parser.parseFromString(
					await provRes.text(),
					"text/xml",
				);
				const cityDoc = parser.parseFromString(
					await cityRes.text(),
					"text/xml",
				);
				const subDoc = parser.parseFromString(await subRes.text(), "text/xml");
				const neighDoc = parser.parseFromString(
					await neighRes.text(),
					"text/xml",
				);

				setProvinceGeoJSON(gpx(provDoc));
				setCityGeoJSON(gpx(cityDoc));
				setSubdistrictGeoJSON(gpx(subDoc));
				setNeighborhoodGeoJSON(gpx(neighDoc));
			} catch (error) {
				console.error("Gagal memproses file batas GPX:", error);
			}
		}
		loadAndParseGpx();
	}, []);

	// ─── DYNAMIC HIGHLIGHT FILTERS (SISTEM GUGUR) ───
	const activeCityFilter = useMemo(() => {
		if (filter.wilayah && !filter.kecamatan && !filter.kelurahan) {
			const osmName =
				WILAYAH_OSM_MAP[filter.wilayah] || filter.wilayah.toLowerCase();
			return ["==", ["downcase", ["get", "name"]], osmName] as any; // FIX TS Error
		}
		return ["==", ["get", "name"], "TIDAK_ADA"] as any; // FIX TS Error
	}, [filter.wilayah, filter.kecamatan, filter.kelurahan]);

	const activeSubdistrictFilter = useMemo(() => {
		if (filter.kecamatan && !filter.kelurahan) {
			return [
				"==",
				["downcase", ["get", "name"]],
				filter.kecamatan.toLowerCase(),
			] as any; // FIX TS Error
		}
		return ["==", ["get", "name"], "TIDAK_ADA"] as any; // FIX TS Error
	}, [filter.kecamatan, filter.kelurahan]);

	const activeNeighborhoodFilter = useMemo(() => {
		if (filter.kelurahan) {
			const osmName = filter.kelurahan.toLowerCase();
			return ["==", ["downcase", ["get", "name"]], osmName] as any; // FIX TS Error
		}
		return ["==", ["get", "name"], "TIDAK_ADA"] as any; // FIX TS Error
	}, [filter.kelurahan]);

	// Animasi Fly-To saat memilih wilayah/kecamatan/kelurahan/nearby
	useEffect(() => {
		if (!mapRef.current || allFacilities.length === 0) return;

		if (filter.nearby) {
			mapRef.current.flyTo({
				center: [filter.nearby.lon, filter.nearby.lat],
				zoom: 13,
				duration: 1500,
			});
			return;
		}

		let targetData = allFacilities;
		let targetZoom = 11;

		if (filter.kelurahan) {
			targetData = allFacilities.filter(
				(f) => f.nama_kelurahan === filter.kelurahan,
			);
			targetZoom = 14.5; // Zoom lebih dekat untuk kelurahan
		} else if (filter.kecamatan) {
			targetData = allFacilities.filter(
				(f) => f.nama_kecamatan === filter.kecamatan,
			);
			targetZoom = 13.5;
		} else if (filter.wilayah) {
			targetData = allFacilities.filter(
				(f) => f.nama_wilayah === filter.wilayah,
			);
			targetZoom = 12;
		} else {
			mapRef.current.flyTo({
				center: [106.827, -6.2088],
				zoom: 11,
				duration: 1200,
			});
			return;
		}

		if (targetData.length > 0) {
			const sumLat = targetData.reduce(
				(acc, curr) => acc + Number(curr.lat ?? (curr as any).latitude ?? 0),
				0,
			);
			const sumLon = targetData.reduce(
				(acc, curr) =>
					acc +
					Number(curr.lon ?? (curr as any).lng ?? (curr as any).longitude ?? 0),
				0,
			);
			const avgLat = sumLat / targetData.length;
			const avgLon = sumLon / targetData.length;

			if (!Number.isNaN(avgLat) && !Number.isNaN(avgLon)) {
				mapRef.current.flyTo({
					center: [avgLon, avgLat],
					zoom: targetZoom,
					duration: 1200,
				});
			}
		}
	}, [
		filter.wilayah,
		filter.kecamatan,
		filter.kelurahan,
		filter.nearby,
		allFacilities,
	]);

	// Konversi Data Fasilitas ke GeoJSON
	const facilitiesGeoJSON = useMemo(() => {
		return {
			type: "FeatureCollection" as const,
			features: clusterPoints.map((point) => {
				const lon = Number(point.lon ?? (point as any).lng ?? 0);
				const lat = Number(point.lat ?? (point as any).latitude ?? 0);
				return {
					type: "Feature" as const,
					geometry: { type: "Point" as const, coordinates: [lon, lat] },
					properties: {
						isCluster: point.isCluster,
						count: point.count,
						id: point.isCluster ? null : point.facilities[0]?.id,
						jenis: point.isCluster
							? null
							: point.facilities[0]?.jenis_sarana_kesehatan || "",
					},
				};
			}),
		};
	}, [clusterPoints]);

	const handleFacilitySelect = useCallback((facility: Facility) => {
		const lon = Number(
			facility.lon ?? (facility as any).lng ?? (facility as any).longitude,
		);
		const lat = Number(facility.lat ?? (facility as any).latitude);
		if (!Number.isNaN(lon) && !Number.isNaN(lat)) {
			mapRef.current?.flyTo({ center: [lon, lat], zoom: 16, duration: 1000 });
		}
		setSelectedFacility(facility);
	}, []);

	const handleMapClick = useCallback(
		(e: MapMouseEvent) => {
			const feature = e.features?.[0];
			if (!feature) {
				setSelectedFacility(null);
				return;
			}

			if (feature.layer.id === "clusters") {
				mapRef.current?.flyTo({
					center: [e.lngLat.lng, e.lngLat.lat],
					zoom: Math.min(viewState.zoom + 2, 16),
					duration: 1000,
				});
			} else if (feature.layer.id === "unclustered-point") {
				const clickedId = feature.properties?.id;
				const facility = filteredFacilities.find(
					(f) => String(f.id) === String(clickedId),
				);
				if (facility) handleFacilitySelect(facility);
			}
		},
		[filteredFacilities, viewState.zoom, handleFacilitySelect],
	);

	return (
		<Head
			title="Peta Interaktif Infrastruktur | JakInfra"
			description="Eksplorasi persebaran fasilitas publik di DKI Jakarta secara real-time."
		>
			<MapPopupStyle />

			<div className="relative w-full h-[calc(100vh-4rem)] bg-background overflow-hidden">
				{(isLoading || isWorkerProcessing) && (
					<div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 glass px-4 py-2 rounded-full flex items-center gap-2 text-xs text-foreground shadow-lg">
						<Loader2 size={13} className="animate-spin text-teal-400" />
						{isLoading ? "Memuat data fasilitas..." : "Memproses data..."}
					</div>
				)}

				<MapGL
					{...viewState}
					ref={mapRef}
					onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
					mapStyle={
						theme === "dark"
							? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
							: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
					}
					onClick={handleMapClick}
					cursor={selectedFacility ? "pointer" : "grab"}
					interactiveLayerIds={["clusters", "unclustered-point"]}
					attributionControl={false}
				>
					{/* LAYER PROVINSI */}
					{provinceGeoJSON && (
						<Source
							id="province-boundary"
							type="geojson"
							data={provinceGeoJSON}
						>
							<Layer {...boundaryFillStyle} />
							<Layer {...boundaryLineStyle} />
						</Source>
					)}

					{/* LAYER KOTA */}
					{cityGeoJSON && (
						<Source id="city-boundary" type="geojson" data={cityGeoJSON}>
							<Layer {...cityFillStyle} filter={activeCityFilter} />
							<Layer {...cityHighlightStyle} filter={activeCityFilter} />
						</Source>
					)}

					{/* LAYER KECAMATAN */}
					{subdistrictGeoJSON && (
						<Source
							id="subdistrict-boundary"
							type="geojson"
							data={subdistrictGeoJSON}
						>
							<Layer {...kecamatanFillStyle} filter={activeSubdistrictFilter} />
							<Layer
								{...kecamatanHighlightStyle}
								filter={activeSubdistrictFilter}
							/>
						</Source>
					)}

					{/* LAYER KELURAHAN BARU */}
					{neighborhoodGeoJSON && (
						<Source
							id="neighborhood-boundary"
							type="geojson"
							data={neighborhoodGeoJSON}
						>
							<Layer
								{...kelurahanFillStyle}
								filter={activeNeighborhoodFilter}
							/>
							<Layer
								{...kelurahanHighlightStyle}
								filter={activeNeighborhoodFilter}
							/>
						</Source>
					)}

					{/* LAYER TITIK FASILITAS */}
					<Source id="facilities-data" type="geojson" data={facilitiesGeoJSON}>
						<Layer {...(clusterLayer as any)} />
						<Layer {...(clusterCountLayer as any)} />
						<Layer {...(unclusteredPointLayer as any)} />
					</Source>

					{filter.nearby && (
						<Marker
							longitude={filter.nearby.lon}
							latitude={filter.nearby.lat}
							anchor="bottom"
						>
							<div className="flex flex-col items-center">
								<div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg mb-1 animate-bounce">
									Pusat Pencarian
								</div>
								<div className="w-4 h-4 bg-rose-500 border-2 border-white rounded-full shadow-lg" />
							</div>
						</Marker>
					)}

					<div className="absolute top-20 right-3 flex flex-col gap-2 z-10">
						<NavigationControl showCompass={false} position="top-right" />
						<button
							type="button"
							className="w-7.25 h-7.25 dark:bg-surface-low bg-white text-foreground rounded shadow-md flex items-center justify-center border border-border transition-colors cursor-pointer hover:opacity-80"
						>
							<Layers size={16} />
						</button>
					</div>

					{selectedFacility && (
						<FacilityPopup
							facility={selectedFacility}
							onClose={() => setSelectedFacility(null)}
						/>
					)}
				</MapGL>

				<MapSidebar onFacilityClick={handleFacilitySelect} />

				<div className="absolute bottom-6 right-6 z-10 bg-white dark:bg-slate-900 border border-border rounded-2xl p-3 shadow-lg">
					<p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
						Legenda
					</p>
					<div className="space-y-1.5">
						{Object.entries(JENIS_COLOR)
							.slice(0, 5)
							.map(([jenis, color]) => (
								<div key={jenis} className="flex items-center gap-2">
									<span
										className="w-2.5 h-2.5 rounded-full shrink-0"
										style={{ background: color }}
									/>
									<span className="text-[10px] text-muted-foreground">
										{jenis}
									</span>
								</div>
							))}
					</div>
				</div>
			</div>
		</Head>
	);
}
