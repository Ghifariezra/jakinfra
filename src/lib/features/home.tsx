import { Link } from "@tanstack/react-router";
import { Activity, ArrowRight, Building2, Globe2, MapPin } from "lucide-react";
import { useMemo } from "react";
import { Head } from "@/components/common/head";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FEATURES_DATA } from "../data/home";
import { useStatsSummary } from "../hooks/use-stats";

export function Index() {
	const {
		data: statsSummary,
		isLoading: isStatsLoading,
		error: statsError,
	} = useStatsSummary();

	const STATS_DATA = useMemo(() => {
		if (isStatsLoading || statsError || !statsSummary) {
			return [
				{ id: 1, label: "Total Fasilitas", value: "3.412", icon: Activity },
				{ id: 2, label: "Wilayah", value: "6", icon: Globe2 },
				{ id: 3, label: "Kecamatan", value: "44", icon: Building2 },
				{ id: 4, label: "Kelurahan", value: "267", icon: MapPin },
			];
		}

		return [
			{
				id: 1,
				label: "Total Fasilitas",
				value: statsSummary.total_fasilitas,
				icon: Activity,
			},
			{
				id: 2,
				label: "Wilayah",
				value: statsSummary.total_wilayah,
				icon: Globe2,
			},
			{
				id: 3,
				label: "Kecamatan",
				value: statsSummary.total_kecamatan,
				icon: Building2,
			},
			{
				id: 4,
				label: "Kelurahan",
				value: statsSummary.total_kelurahan,
				icon: MapPin,
			},
		];
	}, [statsSummary, isStatsLoading, statsError]);

	return (
		<Head
			title="JakInfra | Portal Visualisasi Infrastruktur DKI Jakarta"
			description="Portal pintar untuk memonitoring persebaran infrastruktur di Jakarta. Temukan data akurat mengenai fasilitas publik dalam satu platform."
		>
			{/* Wrapper utama dengan efek glow di bagian atas tengah 
              menggunakan radial-gradient bawaan Tailwind
            */}
			<div className="relative min-h-screen flex flex-col items-center px-6 pt-20 pb-24 overflow-hidden bg-background">
				{/* Efek Cahaya (Glow) Latar Belakang */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-125 bg-[radial-gradient(ellipse_at_top,var(--glow-primary)_0%,transparent_70%)] opacity-50 -z-10 pointer-events-none" />

				{/* Efek Dot Pattern (Opsional, untuk tekstur) */}
				<div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] bg-size-[24px_24px] opacity-20 -z-10 pointer-events-none dark:bg-[radial-gradient(#ffffff11_1px,transparent_1px)]" />

				{/* --- HERO SECTION --- */}
				<div className="flex flex-col items-center text-center mt-12 mb-20 max-w-3xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
					{/* Headline */}
					<h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
						Peta Infrastruktur <br />
						<span className="gradient-text-teal">Jakarta</span>
					</h1>

					{/* Subheadline */}
					<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
						Visualisasi data fasilitas publik, kesehatan, dan pendidikan DKI
						Jakarta secara interaktif. Platform geospasial untuk analisis dan
						pengambilan keputusan strategis.
					</p>

					{/* Call to Actions */}
					<div className="flex flex-col sm:flex-row items-center gap-4">
						<Link
							to="/map"
							className="gradient-teal glow-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95"
						>
							Buka Peta
							<ArrowRight size={18} />
						</Link>
						<Link
							to="/analytics"
							className="glass px-8 py-3.5 rounded-full font-medium text-foreground flex items-center gap-2 hover:bg-foreground/5 transition-all active:scale-95"
						>
							Lihat Analitik
						</Link>
					</div>
				</div>

				{/* --- STATS SECTION --- */}
				<div className="w-full max-w-5xl glass rounded-3xl p-8 mb-24 z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-border/50 text-center md:text-left">
						{STATS_DATA.map((stat) => {
							const Icon = stat.icon;
							return (
								<div
									key={stat.id}
									className="md:px-6 flex flex-col items-center md:items-start gap-3"
								>
									<div className="flex items-center gap-2 text-muted-foreground font-medium">
										<Icon size={18} className="text-teal-400" />
										<span>{stat.label}</span>
									</div>
									<span className="text-4xl font-bold text-foreground">
										{stat.value}
									</span>
								</div>
							);
						})}
					</div>
				</div>

				{/* --- FEATURES SECTION --- */}
				<div className="w-full max-w-6xl z-10 flex flex-col items-center text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
						Fitur Utama
					</h2>
					<p className="text-muted-foreground max-w-xl mb-12">
						Eksplorasi data infrastruktur dengan alat analisis spasial yang kuat
						dan antarmuka yang intuitif.
					</p>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
						{FEATURES_DATA.map((feature) => {
							const Icon = feature.icon;
							return (
								<div
									key={feature.id}
									className="glass rounded-2xl p-8 hover:glow-primary transition-shadow duration-300 group"
								>
									<div className="w-12 h-12 rounded-full glass flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
										<Icon className="text-teal-400" size={24} />
									</div>
									<h3 className="text-xl font-semibold text-foreground mb-3">
										{feature.title}
									</h3>
									<p className="text-muted-foreground leading-relaxed">
										{feature.description}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			<BackgroundBeams className="opacity-60" />
		</Head>
	);
}
