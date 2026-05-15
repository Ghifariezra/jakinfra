import type { ColumnDef } from "@tanstack/react-table";
import type { StatsDensity } from "@/lib/types/stats.types";

export const kepadatanColumns: ColumnDef<StatsDensity>[] = [
	{
		accessorKey: "nama_kecamatan",
		header: "Kecamatan",
		enableSorting: true,
		cell: ({ getValue }) => (
			<span className="font-medium text-foreground">{getValue<string>()}</span>
		),
	},
	{
		accessorKey: "nama_wilayah",
		header: "Wilayah",
		enableSorting: true,
		cell: ({ getValue }) => (
			<span className="text-muted-foreground">{getValue<string>()}</span>
		),
	},
	{
		accessorKey: "total_fasilitas",
		header: "Total Faskes",
		enableSorting: true,
		cell: ({ getValue }) => (
			<span className="text-muted-foreground">{getValue<number>()} Faskes</span>
		),
	},
	{
		accessorKey: "faskes_per_kelurahan",
		header: "Faskes/Kelurahan",
		enableSorting: true,
		cell: ({ getValue }) => {
			const val = Number(getValue<number>());
			const isGood = val > 2;
			return (
				<div className="flex items-center gap-3">
					<span className="text-foreground font-medium w-8 shrink-0">
						{val.toFixed(1)}
					</span>
					<div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden min-w-12.5 max-w-37.5">
						<div
							className="h-full rounded-full transition-all duration-500"
							style={{
								width: `${Math.min((val / 5) * 100, 100)}%`,
								background: isGood ? "#6bd8cb" : "#ffb59a",
							}}
						/>
					</div>
				</div>
			);
		},
	},
];
