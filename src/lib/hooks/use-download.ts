import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export type DownloadFormat = "csv" | "excel" | "pdf" | "json";

interface DownloadOptions<T> {
	data: T[];
	filename?: string;
	columns: {
		key: keyof T;
		label: string;
	}[];
	title?: string;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

const META = {
	source: "JakInfra — jakinfra.ezdev.xyz",
	data_source: "Portal Open Data DKI Jakarta — data.jakarta.go.id",
	processed_by: "Ghifariezra (github.com/Ghifariezra)",
	license: "CC BY 4.0 — Wajib mencantumkan kredit author",
	exported_at: () =>
		new Date().toLocaleString("id-ID", {
			day: "numeric",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			timeZoneName: "short",
		}),
} as const;

// ─── CSV ──────────────────────────────────────────────────────────────────────

function downloadCSV<T>(options: DownloadOptions<T>) {
	const { data, filename = "data", columns, title } = options;

	const metaRows = [
		`# ${title ?? filename}`,
		`# Sumber: ${META.source}`,
		`# Data Asli: ${META.data_source}`,
		`# Strukturisasi: ${META.processed_by}`,
		`# Lisensi: ${META.license}`,
		`# Diekspor: ${META.exported_at()}`,
		`# Total Data: ${data.length} baris`,
		"#",
	];

	const header = columns.map((c) => c.label).join(",");
	const rows = data.map((row) =>
		columns
			.map((c) => {
				const val = String(row[c.key] ?? "");
				return val.includes(",") || val.includes('"')
					? `"${val.replace(/"/g, '""')}"`
					: val;
			})
			.join(","),
	);

	const csv = [...metaRows, header, ...rows].join("\n");
	const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
	triggerDownload(blob, `${filename}.csv`);
}

// ─── Excel ────────────────────────────────────────────────────────────────────

function downloadExcel<T>(options: DownloadOptions<T>) {
	const { data, filename = "data", columns, title } = options;

	const wb = XLSX.utils.book_new();

	// ── Sheet 1: Data ──
	const wsData = [
		columns.map((c) => c.label),
		...data.map((row) => columns.map((c) => row[c.key] ?? "")),
	];
	const ws = XLSX.utils.aoa_to_sheet(wsData);
	ws["!cols"] = columns.map((c) => ({ wch: Math.max(c.label.length, 14) }));
	XLSX.utils.book_append_sheet(wb, ws, title?.slice(0, 30) ?? "Data");

	// ── Sheet 2: Metadata ──
	const metaSheet = XLSX.utils.aoa_to_sheet([
		["Field", "Value"],
		["Judul", title ?? filename],
		["Sumber Platform", META.source],
		["Sumber Data Asli", META.data_source],
		["Strukturisasi", META.processed_by],
		["Lisensi", META.license],
		["Diekspor Pada", META.exported_at()],
		["Total Data", `${data.length} baris`],
	]);
	metaSheet["!cols"] = [{ wch: 22 }, { wch: 55 }];
	XLSX.utils.book_append_sheet(wb, metaSheet, "Metadata");

	XLSX.writeFile(wb, `${filename}.xlsx`);
}

// ─── PDF ──────────────────────────────────────────────────────────────────────

function downloadPDF<T>(options: DownloadOptions<T>) {
	const { data, filename = "data", columns, title } = options;

	const doc = new jsPDF({ orientation: "landscape" });
	const pageW = doc.internal.pageSize.getWidth();

	// ── Header bar ──
	doc.setFillColor(107, 216, 203);
	doc.rect(0, 0, pageW, 18, "F");

	doc.setFontSize(13);
	doc.setTextColor(0, 55, 50);
	doc.setFont("helvetica", "bold");
	doc.text(title ?? filename, 14, 12);

	// ── Subtitle ──
	doc.setFontSize(7.5);
	doc.setTextColor(80, 80, 80);
	doc.setFont("helvetica", "normal");
	doc.text(`Diekspor: ${META.exported_at()}`, 14, 24);
	doc.text(`Total: ${data.length} baris`, 14, 29);

	// ── Data table ──
	autoTable(doc, {
		startY: 34,
		head: [columns.map((c) => c.label)],
		body: data.map((row) => columns.map((c) => String(row[c.key] ?? ""))),
		styles: { fontSize: 8, cellPadding: 3 },
		headStyles: {
			fillColor: [107, 216, 203],
			textColor: [0, 55, 50],
			fontStyle: "bold",
		},
		alternateRowStyles: { fillColor: [245, 250, 249] },
		margin: { left: 14, right: 14 },
	});

	// ── Footer metadata di halaman terakhir ──
	const finalY =
		(doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
			?.finalY ?? 34;

	if (finalY + 30 < doc.internal.pageSize.getHeight()) {
		doc.setDrawColor(200, 200, 200);
		doc.setLineWidth(0.3);
		doc.line(14, finalY + 8, pageW - 14, finalY + 8);

		doc.setFontSize(7);
		doc.setTextColor(140, 140, 140);
		const footerLines = [
			`Sumber: ${META.source}`,
			`Data Asli: ${META.data_source}`,
			`Strukturisasi: ${META.processed_by}`,
			`Lisensi: ${META.license}`,
		];
		footerLines.forEach((line, i) => {
			doc.text(line, 14, finalY + 14 + i * 4.5);
		});
	}

	doc.save(`${filename}.pdf`);
}

// ─── JSON ─────────────────────────────────────────────────────────────────────

function downloadJSON<T>(options: DownloadOptions<T>) {
	const { data, filename = "data", columns, title } = options;

	const filtered = data.map((row) =>
		Object.fromEntries(columns.map((c) => [c.key, row[c.key] ?? null])),
	);

	const payload = {
		_metadata: {
			title: title ?? filename,
			source: META.source,
			data_source: META.data_source,
			processed_by: META.processed_by,
			license: META.license,
			exported_at: new Date().toISOString(),
			total: filtered.length,
			columns: columns.map((c) => ({ key: c.key, label: c.label })),
		},
		data: filtered,
	};

	const blob = new Blob([JSON.stringify(payload, null, 2)], {
		type: "application/json",
	});
	triggerDownload(blob, `${filename}.json`);
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

function triggerDownload(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

// ─── Main Hook ────────────────────────────────────────────────────────────────

export function useDownload() {
	function download<T>(format: DownloadFormat, options: DownloadOptions<T>) {
		switch (format) {
			case "csv":
				downloadCSV(options);
				break;
			case "excel":
				downloadExcel(options);
				break;
			case "pdf":
				downloadPDF(options);
				break;
			case "json":
				downloadJSON(options);
				break;
		}
	}

	return { download };
}
