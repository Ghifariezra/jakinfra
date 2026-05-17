import { Filter, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useFacilityMapStore } from "@/lib/store/map.store";
import type { Facility } from "@/lib/types/facility.types";
import { getMarkerColor } from "./map-styles";

interface MapSidebarProps {
	onFacilityClick: (facility: Facility) => void;
}

export function MapSidebar({ onFacilityClick }: MapSidebarProps) {
	const { allFacilities, filteredFacilities, filter, setFilter, resetFilter } =
		useFacilityMapStore();

	const [radius, setRadius] = useState(5);
	const [latInput, setLatInput] = useState("");
	const [lonInput, setLonInput] = useState("");

	const wilayahList = useMemo(
		() => [...new Set(allFacilities.map((f) => f.nama_wilayah))].sort(),
		[allFacilities],
	);

	const kecamatanList = useMemo(() => {
		if (!filter.wilayah) return [];
		const fasilitasDiWilayah = allFacilities.filter(
			(f) => f.nama_wilayah === filter.wilayah,
		);
		return [...new Set(fasilitasDiWilayah.map((f) => f.nama_kecamatan))].sort();
	}, [allFacilities, filter.wilayah]);

	const kelurahanList = useMemo(() => {
		if (!filter.kecamatan) return [];
		const fasilitasDiKecamatan = allFacilities.filter(
			(f) => f.nama_kecamatan === filter.kecamatan,
		);
		return [
			...new Set(fasilitasDiKecamatan.map((f) => f.nama_kelurahan)),
		].sort();
	}, [allFacilities, filter.kecamatan]);

	const jenisList = useMemo(
		() =>
			[...new Set(allFacilities.map((f) => f.jenis_sarana_kesehatan))].sort(),
		[allFacilities],
	);

	const handleGetLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					setLatInput(pos.coords.latitude.toString());
					setLonInput(pos.coords.longitude.toString());
				},
				// FIX: Menggunakan template literals sesuai saran Linter
				(err) => alert(`Gagal mengambil GPS: ${err.message}`),
			);
		} else {
			alert("Browser tidak mendukung GPS.");
		}
	};

	const handleSearchNearby = () => {
		const lat = parseFloat(latInput);
		const lon = parseFloat(lonInput);
		if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
			setFilter({
				wilayah: undefined,
				kecamatan: undefined,
				kelurahan: undefined,
				nearby: { lat, lon, radius },
			});
		} else {
			alert("Masukkan Latitude dan Longitude yang valid.");
		}
	};

	const handleReset = () => {
		resetFilter();
		setLatInput("");
		setLonInput("");
		setRadius(5);
	};

	return (
		<div className="absolute top-6 left-6 w-80 max-h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden z-10 shadow-xl border border-border/40">
			<div className="p-5 border-b border-border shrink-0 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Filter className="text-primary" size={18} />
					<h2 className="text-sm font-semibold text-foreground">
						Filter Fasilitas
					</h2>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-[10px] text-muted-foreground">
						{filteredFacilities.length.toLocaleString("id-ID")} faskes
					</span>
					{(filter.wilayah ||
						filter.kecamatan ||
						filter.kelurahan ||
						filter.jenis ||
						filter.nearby) && (
						<button
							type="button"
							onClick={handleReset}
							className="text-[10px] text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
						>
							Reset
						</button>
					)}
				</div>
			</div>

			<div className="flex-1 overflow-y-auto custom-scrollbar">
				<div className="p-5 border-b border-border/50 space-y-4">
					<div className="flex flex-col gap-3">
						{/* 1. Wilayah */}
						<div className="relative flex flex-col gap-1.5">
							{/* FIX: Tambah htmlFor */}
							<label
								htmlFor="wilayah"
								className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1"
							>
								Wilayah
							</label>
							<div className="relative">
								{/* FIX: Tambah id="wilayah" */}
								<select
									id="wilayah"
									value={filter.wilayah ?? ""}
									onChange={(e) =>
										setFilter({
											wilayah: e.target.value || undefined,
											kecamatan: undefined,
											kelurahan: undefined,
											nearby: undefined,
										})
									}
									className="w-full appearance-none bg-slate-50 dark:bg-surface-low border border-border text-xs rounded-xl pl-3 pr-8 py-2.5 outline-none cursor-pointer focus:border-teal-400 transition-all"
								>
									<option value="">Semua Wilayah</option>
									{wilayahList.map((w) => (
										<option key={w} value={w}>
											{w}
										</option>
									))}
								</select>
								<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
									{/* FIX: Tambah title pada SVG */}
									<svg
										className="w-3.5 h-3.5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Pilih Wilayah</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</div>
						</div>

						{/* 2. Kecamatan */}
						<div className="relative flex flex-col gap-1.5">
							{/* FIX: Tambah htmlFor */}
							<label
								htmlFor="kecamatan"
								className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1"
							>
								Kecamatan
							</label>
							<div className="relative">
								{/* FIX: Tambah id="kecamatan" */}
								<select
									id="kecamatan"
									value={filter.kecamatan ?? ""}
									onChange={(e) =>
										setFilter({
											kecamatan: e.target.value || undefined,
											kelurahan: undefined,
											nearby: undefined,
										})
									}
									disabled={!filter.wilayah}
									className="w-full appearance-none bg-slate-50 dark:bg-surface-low border border-border text-xs rounded-xl pl-3 pr-8 py-2.5 outline-none focus:border-teal-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
								>
									<option value="">
										{filter.wilayah ? "Semua Kec." : "Pilih Wilayah Dulu"}
									</option>
									{kecamatanList.map((k) => (
										<option key={k} value={k}>
											{k}
										</option>
									))}
								</select>
								<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
									{/* FIX: Tambah title pada SVG */}
									<svg
										className="w-3.5 h-3.5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Pilih Kecamatan</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</div>
						</div>

						{/* 3. Kelurahan */}
						<div className="relative flex flex-col gap-1.5">
							{/* FIX: Tambah htmlFor */}
							<label
								htmlFor="kelurahan"
								className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1"
							>
								Kelurahan
							</label>
							<div className="relative">
								{/* FIX: Tambah id="kelurahan" */}
								<select
									id="kelurahan"
									value={filter.kelurahan ?? ""}
									onChange={(e) =>
										setFilter({
											kelurahan: e.target.value || undefined,
											nearby: undefined,
										})
									}
									disabled={!filter.kecamatan}
									className="w-full appearance-none bg-slate-50 dark:bg-surface-low border border-border text-xs rounded-xl pl-3 pr-8 py-2.5 outline-none focus:border-teal-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
								>
									<option value="">
										{filter.kecamatan
											? "Semua Kelurahan"
											: "Pilih Kecamatan Dulu"}
									</option>
									{kelurahanList.map((k) => (
										<option key={k} value={k}>
											{k}
										</option>
									))}
								</select>
								<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
									{/* FIX: Tambah title pada SVG */}
									<svg
										className="w-3.5 h-3.5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Pilih Kelurahan</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</div>
						</div>
					</div>

					{/* ─── FILTER JENIS SARANA ─── */}
					<div className="pt-2">
						<p className="text-[11px] font-medium text-muted-foreground mb-2">
							Jenis Sarana
						</p>
						<div className="flex flex-wrap gap-1.5">
							{jenisList.slice(0, 8).map((jenis) => (
								<button
									key={jenis}
									type="button"
									onClick={() =>
										setFilter({
											jenis: filter.jenis === jenis ? undefined : jenis,
										})
									}
									className={`px-3 py-1 rounded-full text-[10px] font-medium border transition-colors cursor-pointer ${filter.jenis === jenis ? "bg-primary/10 border-primary text-primary" : "bg-transparent border-border text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800"}`}
								>
									{jenis}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Cari Terdekat Area */}
				<div className="p-5 border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/50">
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center gap-2">
							<MapPin className="text-muted-foreground" size={13} />
							<h3 className="text-xs font-semibold text-foreground">
								Cari Terdekat
							</h3>
						</div>
						<button
							type="button"
							onClick={handleGetLocation}
							className="text-[10px] text-teal-600 dark:text-teal-400 hover:opacity-70 font-bold transition-opacity cursor-pointer"
						>
							📍 Gunakan GPS
						</button>
					</div>

					<div className="grid grid-cols-2 gap-2 mb-3">
						<input
							type="text"
							placeholder="Latitude"
							value={latInput}
							onChange={(e) => setLatInput(e.target.value)}
							className="w-full bg-white dark:bg-slate-900 border border-border rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/50 transition-all shadow-sm"
						/>
						<input
							type="text"
							placeholder="Longitude"
							value={lonInput}
							onChange={(e) => setLonInput(e.target.value)}
							className="w-full bg-white dark:bg-slate-900 border border-border rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/50 transition-all shadow-sm"
						/>
					</div>

					<div className="mb-4">
						<div className="flex justify-between items-center mb-1.5">
							<span className="text-[10px] text-muted-foreground">
								Radius Pencarian
							</span>
							<span className="text-[11px] font-bold text-primary">
								{radius} km
							</span>
						</div>
						<input
							type="range"
							min="1"
							max="20"
							value={radius}
							onChange={(e) => setRadius(Number(e.target.value))}
							className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-teal-400 bg-slate-200 dark:bg-slate-800"
						/>
					</div>

					<button
						type="button"
						onClick={handleSearchNearby}
						className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
					>
						<Search size={13} /> Cari
					</button>
				</div>

				{/* Hasil Pencarian List */}
				<div className="p-5">
					<h3 className="text-[11px] font-semibold text-foreground mb-3">
						Daftar Fasilitas ({filteredFacilities.length})
					</h3>
					<div className="space-y-2">
						{filteredFacilities.slice(0, 20).map((faskes) => (
							<button
								key={faskes.id}
								type="button"
								onClick={() => onFacilityClick(faskes)}
								className="w-full text-left border border-border/50 p-3 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
							>
								<div className="flex justify-between items-start mb-0.5">
									<h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
										{faskes.nama_infrastruktur}
									</h4>
									<span
										className="w-2 h-2 rounded-full shrink-0 mt-1 ml-2 shadow-sm"
										style={{
											background: getMarkerColor(faskes.jenis_sarana_kesehatan),
										}}
									/>
								</div>
								<p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium mb-1">
									{faskes.jenis_sarana_kesehatan}
								</p>
								<p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
									{faskes.alamat}
								</p>
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
