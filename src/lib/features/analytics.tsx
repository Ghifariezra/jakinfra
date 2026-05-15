/** biome-ignore-all lint/suspicious/noArrayIndexKey: ... */

import {
	AlertTriangle,
	Building2,
	Download,
	Heart,
	LayoutGrid,
	Loader2,
	MapPin,
} from "lucide-react";
import { useMemo } from "react";
import {
	Bar,
	BarChart,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";
import { DataTable } from "@/components/analytics/data-table";
import { kepadatanColumns } from "@/components/analytics/kepadatan-columns";
import { KpiCard } from "@/components/analytics/kpi-card";
import { SectionCard } from "@/components/analytics/section-card";
import { Head } from "@/components/common/head";
import { Badge } from "@/components/ui/badge";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	useStatsBlankSpot,
	useStatsDensity,
	useStatsJenis,
	useStatsSummary,
	useStatsWilayah,
} from "@/lib/hooks/use-stats";

// ─── Constants ────────────────────────────────────────────────────────────────

const barChartConfig = {
	total: { label: "Fasilitas", color: "#6bd8cb" },
} satisfies ChartConfig;

const PIE_COLORS = [
	"#6bd8cb",
	"#5de6ff",
	"#ffb59a",
	"#89f5e7",
	"#ff9b7d",
	"#4bc2f1",
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function RouteComponent() {
	const { data: summary, isLoading: loadingSummary } = useStatsSummary();
	const { data: rawWilayah, isLoading: loadingWilayah } = useStatsWilayah();
	const { data: rawJenis, isLoading: loadingJenis } = useStatsJenis();
	const { data: rawDensity, isLoading: loadingDensity } = useStatsDensity({
		order: "desc",
	});
	const { data: rawBlankSpots, isLoading: loadingBlank } = useStatsBlankSpot();

	// Transform bar chart data
	const distribusiWilayah = useMemo(() => {
		if (!rawWilayah) return [];
		return rawWilayah
			.map((w) => ({ nama: w.nama_wilayah, total: Number(w.total_fasilitas) }))
			.sort((a, b) => b.total - a.total);
	}, [rawWilayah]);

	const maxBar =
		distribusiWilayah.length > 0
			? Math.max(...distribusiWilayah.map((d) => d.total))
			: 100;

	// Transform pie chart data
	const sebaranJenis = useMemo(() => {
		if (!rawJenis) return [];
		return rawJenis
			.map((j, i) => ({
				name: j.jenis_sarana_kesehatan,
				value: Number(j.jumlah),
				fill: PIE_COLORS[i % PIE_COLORS.length],
			}))
			.sort((a, b) => b.value - a.value);
	}, [rawJenis]);

	const pieChartConfig = useMemo(() => {
		const config: Record<string, { label: string; color: string }> = {};
		for (const j of sebaranJenis) {
			config[j.name] = { label: j.name, color: j.fill };
		}
		return config;
	}, [sebaranJenis]);

	// Group blank spots by kelurahan
	const groupedBlankSpots = useMemo(() => {
		if (!rawBlankSpots) return [];
		const grouped = rawBlankSpots.reduce(
			(acc, curr) => {
				if (!acc[curr.kelurahan_id]) {
					acc[curr.kelurahan_id] = {
						wilayah: curr.nama_wilayah,
						kecamatan: curr.nama_kecamatan,
						kelurahan: curr.nama_kelurahan,
						missing: [],
					};
				}
				acc[curr.kelurahan_id].missing.push(curr.jenis_sarana_kesehatan);
				return acc;
			},
			{} as Record<
				string,
				{
					wilayah: string;
					kecamatan: string;
					kelurahan: string;
					missing: string[];
				}
			>,
		);
		return Object.values(grouped);
	}, [rawBlankSpots]);

	// Stable empty array for DataTable when loading
	const densityData = rawDensity ?? [];

	return (
		<Head
			title="Analisis Data & Statistik Fasilitas | JakInfra Analytics"
			description="Pantau statistik persebaran infrastruktur Jakarta per kecamatan."
		>
			<div className="min-h-screen bg-background">
				<div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
					{/* Header */}
					<div>
						<h1 className="text-2xl font-semibold text-foreground">
							Analitik Infrastruktur
						</h1>
						<p className="text-sm text-muted-foreground mt-1">
							Data periode {summary?.periode_awal ?? "2020"}–
							{summary?.periode_akhir ?? "2024"} · Di-update realtime
						</p>
					</div>

					{/* KPI Cards */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						<KpiCard
							icon={LayoutGrid}
							label="Total Fasilitas"
							value={summary?.total_fasilitas?.toLocaleString("id-ID") ?? 0}
							iconColor="#6bd8cb"
							isLoading={loadingSummary}
						/>
						<KpiCard
							icon={MapPin}
							label="Total Wilayah"
							value={summary?.total_wilayah?.toLocaleString("id-ID") ?? 0}
							iconColor="#5de6ff"
							isLoading={loadingSummary}
						/>
						<KpiCard
							icon={Building2}
							label="Total Kecamatan"
							value={summary?.total_kecamatan?.toLocaleString("id-ID") ?? 0}
							iconColor="#ffb59a"
							isLoading={loadingSummary}
						/>
						<KpiCard
							icon={Heart}
							label="Total Kelurahan"
							value={summary?.total_kelurahan?.toLocaleString("id-ID") ?? 0}
							iconColor="#89f5e7"
							isLoading={loadingSummary}
						/>
					</div>

					{/* Charts Row */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{/* Bar Chart */}
						<SectionCard>
							<h2 className="text-sm font-semibold text-foreground mb-5">
								Distribusi per Wilayah
							</h2>
							{loadingWilayah ? (
								<div className="h-56 flex items-center justify-center">
									<Loader2
										className="animate-spin text-muted-foreground"
										size={24}
									/>
								</div>
							) : (
								<ChartContainer config={barChartConfig} className="h-56 w-full">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={distribusiWilayah}
											layout="vertical"
											margin={{ left: 0, right: 24, top: 0, bottom: 0 }}
											barSize={10}
										>
											<XAxis
												type="number"
												hide
												domain={[0, maxBar + maxBar * 0.1]}
											/>
											<YAxis
												type="category"
												dataKey="nama"
												width={96}
												tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
												tickLine={false}
												axisLine={false}
											/>
											<ChartTooltip
												content={<ChartTooltipContent />}
												cursor={{ fill: "rgba(107,216,203,0.05)" }}
											/>
											<Bar
												dataKey="total"
												radius={[0, 6, 6, 0]}
												label={{
													position: "right",
													fontSize: 12,
													fill: "var(--muted-foreground)",
												}}
											>
												{distribusiWilayah.map((_, i) => (
													<Cell
														key={`bar-${i}`}
														fill={
															i === 0
																? "#6bd8cb"
																: `rgba(107,216,203,${Math.max(0.2, 0.85 - i * 0.12)})`
														}
													/>
												))}
											</Bar>
										</BarChart>
									</ResponsiveContainer>
								</ChartContainer>
							)}
						</SectionCard>

						{/* Pie Chart */}
						<SectionCard>
							<h2 className="text-sm font-semibold text-foreground mb-5">
								Sebaran Jenis Sarana
							</h2>
							{loadingJenis ? (
								<div className="h-56 flex items-center justify-center">
									<Loader2
										className="animate-spin text-muted-foreground"
										size={24}
									/>
								</div>
							) : (
								<>
									<ChartContainer
										config={pieChartConfig}
										className="h-56 w-full"
									>
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Pie
													data={sebaranJenis}
													cx="40%"
													cy="50%"
													innerRadius={64}
													outerRadius={96}
													paddingAngle={3}
													dataKey="value"
													startAngle={90}
													endAngle={-270}
												>
													{sebaranJenis.map((entry, i) => (
														<Cell key={`cell-${i}`} fill={entry.fill} />
													))}
												</Pie>
												<ChartTooltip content={<ChartTooltipContent />} />
											</PieChart>
										</ResponsiveContainer>
									</ChartContainer>
									{/* Legend */}
									<div className="flex flex-col gap-2 absolute right-8 top-1/2 -translate-y-1/2 max-h-48 overflow-y-auto pr-2">
										{sebaranJenis.map((item) => (
											<div key={item.name} className="flex items-center gap-2">
												<span
													className="w-2.5 h-2.5 rounded-full shrink-0"
													style={{ background: item.fill }}
												/>
												<span
													className="text-xs text-muted-foreground max-w-25 truncate"
													title={item.name}
												>
													{item.name}
												</span>
											</div>
										))}
									</div>
									{/* Center label */}
									<div className="absolute left-[40%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
										<p className="text-xl font-semibold text-foreground">
											{summary?.total_fasilitas
												? summary.total_fasilitas > 1000
													? `${(summary.total_fasilitas / 1000).toFixed(1)}K`
													: summary.total_fasilitas
												: "0"}
										</p>
										<p className="text-xs text-muted-foreground">Total</p>
									</div>
								</>
							)}
						</SectionCard>
					</div>

					{/* Kepadatan Table — pakai DataTable reusable */}
					<SectionCard>
						<div className="flex items-center justify-between mb-5">
							<h2 className="text-sm font-semibold text-foreground">
								Kepadatan per Kecamatan (Faskes Tersedia)
							</h2>
							<button
								type="button"
								className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors"
								onClick={() =>
									alert("Fitur unduh CSV sedang dalam pengembangan.")
								}
							>
								<Download size={13} />
								Unduh CSV
							</button>
						</div>
						<DataTable
							columns={kepadatanColumns}
							data={densityData}
							isLoading={loadingDensity}
							pageSize={10}
							emptyMessage="Tidak ada data kepadatan tersedia."
						/>
					</SectionCard>

					{/* Blank Spots */}
					<div>
						<div className="flex items-center gap-2 mb-4">
							<AlertTriangle size={16} className="text-amber-400" />
							<h2 className="text-sm font-semibold text-amber-400">
								Kelurahan Blank Spot (Minim Sarana)
							</h2>
						</div>
						{loadingBlank ? (
							<div className="flex items-center justify-center p-8 border border-amber-400/10 rounded-2xl glass">
								<Loader2 className="animate-spin text-amber-400" size={24} />
							</div>
						) : groupedBlankSpots.length === 0 ? (
							<div className="glass rounded-2xl p-5 border border-border/10 text-center text-muted-foreground text-sm">
								Semua kelurahan memiliki layanan/sarana (Tidak ada blank spot).
							</div>
						) : (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{groupedBlankSpots.slice(0, 9).map((spot, idx) => (
										<div
											key={idx}
											className="glass rounded-2xl p-5 border border-amber-400/10"
										>
											<div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 truncate">
												<span>{spot.wilayah}</span>
												<span className="text-border">›</span>
												<span className="truncate">{spot.kecamatan}</span>
											</div>
											<p className="text-sm font-semibold text-foreground mb-3 line-clamp-1">
												{spot.kelurahan}
											</p>
											<div className="flex flex-wrap gap-2">
												{spot.missing.map((m, i) => (
													<Badge
														key={i}
														variant="outline"
														className="text-[10px] py-0 border-border/40 text-muted-foreground gap-1 rounded-full"
													>
														<span className="text-rose-400 font-bold mr-0.5">
															×
														</span>
														{m}
													</Badge>
												))}
											</div>
										</div>
									))}
								</div>
								{groupedBlankSpots.length > 9 && (
									<p className="mt-4 text-center text-xs text-muted-foreground">
										Menampilkan 9 dari {groupedBlankSpots.length} blank spot.
									</p>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</Head>
	);
}
