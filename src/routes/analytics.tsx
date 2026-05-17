import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent } from "@/lib/features/analytics";

export const Route = createFileRoute("/analytics")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Analisis Data & Statistik Fasilitas | JakInfra Analytics",
			},
			{
				name: "description",
				content:
					"Pantau statistik persebaran infrastruktur Jakarta per kecamatan. Visualisasi data komprehensif untuk mendukung pengambilan keputusan berbasis data.",
			},
			{
				property: "og:title",
				content: "Analisis Data & Statistik Fasilitas | JakInfra Analytics",
			},
			{
				property: "og:description",
				content:
					"Pantau statistik persebaran infrastruktur Jakarta per kecamatan. Visualisasi data komprehensif untuk mendukung pengambilan keputusan berbasis data.",
			},
			{
				property: "og:image",
				content: "https://jakinfra.ezdev.xyz/og-image.png",
			},
		],
	}),
});
