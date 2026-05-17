import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Popup } from "react-map-gl/maplibre";
import type { Facility } from "@/lib/types/facility.types";

export function MapPopupStyle() {
	const styleRef = useRef<HTMLStyleElement | null>(null);

	useEffect(() => {
		const style = document.createElement("style");
		style.textContent = `
			.jakinfra-popup .maplibregl-popup-content {
				background: transparent !important;
				padding: 0 !important;
				box-shadow: none !important;
			}
			.jakinfra-popup .maplibregl-popup-tip { display: none !important; }
		`;
		document.head.appendChild(style);
		styleRef.current = style;
		return () => styleRef.current?.remove();
	}, []);

	return null;
}

interface FacilityPopupProps {
	facility: Facility;
	onClose: () => void;
}

export function FacilityPopup({ facility, onClose }: FacilityPopupProps) {
	const lon = Number(facility.lon);
	const lat = Number(facility.lat);

	if (Number.isNaN(lon) || Number.isNaN(lat)) return null;

	return (
		<Popup
			longitude={lon}
			latitude={lat}
			anchor="left"
			offset={16}
			closeButton={false}
			className="jakinfra-popup z-20"
			maxWidth="300px"
		>
			<div className="bg-white dark:bg-slate-900 border border-border rounded-2xl p-5 shadow-2xl text-foreground">
				<div className="flex justify-between items-start mb-1">
					<h3 className="font-semibold text-primary text-sm leading-tight pr-2">
						{facility.nama_infrastruktur}
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
					>
						<X size={14} />
					</button>
				</div>

				<p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium mb-3">
					{facility.jenis_sarana_kesehatan}
				</p>

				<div className="space-y-1 mb-4">
					<p className="text-[11px] text-muted-foreground">
						📍 {facility.alamat}
					</p>
					<p className="text-[11px] text-muted-foreground">
						🏙️ {facility.nama_kelurahan}, {facility.nama_kecamatan}
					</p>
					<p className="text-[11px] text-muted-foreground">
						🗺️ {facility.nama_wilayah}
					</p>
				</div>

				<div className="text-[10px] text-muted-foreground/60 border-t border-border/30 pt-2">
					Periode data: {facility.periode_data}
				</div>
			</div>
		</Popup>
	);
}
