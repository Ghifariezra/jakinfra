import { gpx } from "@tmcw/togeojson";
import subdistrictRaw from "@/lib/data/subdistrict.gpx?raw";

let _cachedGeoJSON: ReturnType<typeof buildGeoJSON> | null = null;

function buildGeoJSON() {
	const parser = new DOMParser();
	const dom = parser.parseFromString(subdistrictRaw, "text/xml");
	const geojson = gpx(dom);

	return {
		type: "FeatureCollection" as const,
		features: geojson.features.map((f) => {
			const props = f.properties as Record<string, unknown> | null | undefined;
			return {
				type: "Feature" as const,
				geometry: f.geometry as GeoJSON.Geometry,
				properties: {
					nama_kecamatan: (props?.name as string) ?? "",
				},
			};
		}),
	};
}

export function getSubdistrictGeoJSON() {
	if (!_cachedGeoJSON) _cachedGeoJSON = buildGeoJSON();
	return _cachedGeoJSON;
}

export function getKecamatanFeature(namaKecamatan: string) {
	const data = getSubdistrictGeoJSON();
	return (
		data.features.find(
			(f) =>
				f.properties.nama_kecamatan.toLowerCase() ===
				namaKecamatan.toLowerCase(),
		) ?? null
	);
}
