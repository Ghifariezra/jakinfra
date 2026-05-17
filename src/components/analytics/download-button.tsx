import { ChevronDown, Download, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { DownloadFormat } from "@/lib/hooks/use-download";

interface DownloadButtonProps {
	onDownload: (format: DownloadFormat) => void;
	isLoading?: boolean;
	disabled?: boolean;
}

const formats: {
	format: DownloadFormat;
	label: string;
	desc: string;
	icon: string;
}[] = [
	{
		format: "csv",
		label: "CSV",
		desc: "Cocok untuk Excel & analisis dasar",
		icon: "📄",
	},
	{
		format: "excel",
		label: "Excel (.xlsx)",
		desc: "Spreadsheet dengan formatting",
		icon: "📊",
	},
	{ format: "pdf", label: "PDF", desc: "Laporan siap cetak", icon: "📑" },
	{
		format: "json",
		label: "JSON",
		desc: "Untuk developer & integrasi API",
		icon: "🔧",
	},
];

export function DownloadButton({
	onDownload,
	isLoading,
	disabled,
}: DownloadButtonProps) {
	const [open, setOpen] = useState(false);
	const [downloading, setDownloading] = useState<DownloadFormat | null>(null);
	const ref = useRef<HTMLDivElement>(null);

	// Close on outside click
	useEffect(() => {
		function handler(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	async function handleDownload(format: DownloadFormat) {
		setDownloading(format);
		setOpen(false);
		try {
			await onDownload(format);
		} finally {
			setDownloading(null);
		}
	}

	return (
		<div className="relative" ref={ref}>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				disabled={disabled || isLoading}
				className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
			>
				{downloading ? (
					<Loader2 size={13} className="animate-spin" />
				) : (
					<Download size={13} />
				)}
				Unduh Data
				<ChevronDown
					size={11}
					className={`transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>

			{open && (
				<div className="absolute right-0 top-7 z-50 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-lg min-w-55 overflow-hidden">
					<div className="px-3 py-2 border-b border-border/30">
						<p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
							Pilih Format
						</p>
					</div>
					{formats.map((f) => (
						<button
							key={f.format}
							type="button"
							onClick={() => handleDownload(f.format)}
							className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-white/5 dark:hover:bg-white/5 transition-colors text-left cursor-pointer"
						>
							<span className="text-base mt-0.5">{f.icon}</span>
							<div>
								<p className="text-xs font-medium text-foreground">{f.label}</p>
								<p className="text-[10px] text-muted-foreground mt-0.5">
									{f.desc}
								</p>
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
