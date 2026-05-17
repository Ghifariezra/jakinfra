import { Database, ExternalLink } from "lucide-react";
import { CodeTabs } from "@/components/animate-ui/components/animate/code-tabs";
import { Head } from "@/components/common/head";

const codesObject = {
	cURL: `curl -X GET "https://api.jakinfra.ezdev.xyz/api/v1/facility" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Accept: application/json"`,

	JavaScript: `const response = await fetch(
  "https://api.jakinfra.ezdev.xyz/api/v1/facility",
  {
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Accept": "application/json",
    },
  }
);
const data = await response.json();`,

	Python: `import requests

response = requests.get(
    "https://api.jakinfra.ezdev.xyz/api/v1/facility",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Accept": "application/json",
    },
)
data = response.json()`,
};

export function RouteComponent() {
	return (
		<Head
			title="Tentang Proyek | Mengenal Sistem JakInfra"
			description="Pelajari lebih lanjut tentang misi JakInfra, sumber data yang digunakan, serta teknologi di balik pengembangan WebGIS infrastruktur Jakarta ini."
		>
			<div className="min-h-screen bg-background pt-16">
				<div className="max-w-2xl mx-auto px-6 py-12 space-y-12">
					{/* Hero */}
					<div>
						<h1 className="text-4xl font-semibold text-foreground mb-1">
							Tentang JakInfra
						</h1>
						<div className="w-16 h-0.5 gradient-teal rounded-full mb-6" />
						<p className="text-muted-foreground leading-relaxed">
							Platform visualisasi data spasial modern yang dirancang untuk
							menganalisis dan memetakan infrastruktur kesehatan di wilayah DKI
							Jakarta. Dibangun dengan fokus pada kecepatan, akurasi, dan
							aksesibilitas API bagi para peneliti dan pengembang.
						</p>
					</div>

					{/* Sumber Data */}
					<div className="glass rounded-2xl p-6">
						<div className="flex items-start gap-4 mb-5">
							<div className="w-10 h-10 rounded-xl bg-teal-400/10 flex items-center justify-center shrink-0">
								<Database size={18} className="text-teal-400" />
							</div>
							<div>
								<h2 className="text-base font-semibold text-foreground">
									Sumber Data
								</h2>
								<p className="text-sm text-muted-foreground mt-1 leading-relaxed">
									Data infrastruktur kesehatan bersumber langsung dari portal
									Open Data Jakarta, mencakup rumah sakit, puskesmas, klinik,
									apotek, dan fasilitas medis lainnya.
								</p>
							</div>
						</div>

						{/* Timeline Tahun */}
						<div className="flex items-center gap-3 mb-5 px-1">
							<span className="text-xs text-muted-foreground flex items-center gap-1.5">
								<span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
								2020
							</span>
							<div className="flex-1 h-px bg-linear-to-r from-muted-foreground/20 via-teal-400/60 to-teal-400 rounded-full" />
							<span className="text-xs text-teal-400 flex items-center gap-1.5">
								2026
								<span className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(45,212,191,0.6)] bg-teal-400" />
							</span>
						</div>

						{/* Tombol & Info Update */}
						<div className="flex items-center justify-between">
							<a
								href="https://data.jakarta.go.id"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/40 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
							>
								Lihat Portal Open Data
								<ExternalLink size={13} />
							</a>
							<span className="text-[11px] text-muted-foreground font-medium px-2 py-1 bg-muted/30 rounded-md">
								Update Terakhir: Mei 2026
							</span>
						</div>
					</div>

					{/* Akses API */}
					<div>
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-semibold text-foreground">
								Akses API
							</h2>
							<div className="flex items-center gap-2">
								<span
									className="px-2.5 py-1 rounded-full text-xs font-medium
                border border-amber-500/40 bg-amber-500/10 text-amber-600
                dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400"
								>
									Rate Limited
								</span>
								<span
									className="px-2.5 py-1 rounded-full text-xs font-medium
                border border-teal-600/40 bg-teal-500/10 text-teal-700
                dark:border-teal-400/30 dark:bg-teal-400/10 dark:text-teal-400"
								>
									Cache Enabled
								</span>
							</div>
						</div>
						<CodeTabs
							codes={codesObject}
							lang="bash"
							className="rounded-2xl overflow-hidden border-border/40"
						/>
					</div>
				</div>
			</div>
		</Head>
	);
}
