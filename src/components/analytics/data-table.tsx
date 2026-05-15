import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useState } from "react";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DataTableProps<TData> {
	columns: ColumnDef<TData>[];
	data: TData[];
	isLoading?: boolean;
	pageSize?: number;
	emptyMessage?: string;
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
	if (sorted === "asc")
		return <ChevronUp size={13} className="text-teal-400 shrink-0" />;
	if (sorted === "desc")
		return <ChevronDown size={13} className="text-teal-400 shrink-0" />;
	return (
		<ArrowUpDown size={13} className="text-muted-foreground/40 shrink-0" />
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DataTable<TData>({
	columns,
	data,
	isLoading = false,
	pageSize = 10,
	emptyMessage = "Tidak ada data tersedia.",
}: DataTableProps<TData>) {
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize },
		},
	});

	const { pageIndex } = table.getState().pagination;
	const pageCount = table.getPageCount();

	return (
		<div className="space-y-3">
			<div className="w-full overflow-x-auto rounded-xl border border-border/30">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="border-b border-border/40 hover:bg-transparent"
							>
								{headerGroup.headers.map((header) => {
									const canSort = header.column.getCanSort();
									const sorted = header.column.getIsSorted();
									return (
										<TableHead
											key={header.id}
											className="text-xs font-medium text-muted-foreground py-3 px-4"
										>
											{header.isPlaceholder ? null : canSort ? (
												<button
													type="button"
													onClick={header.column.getToggleSortingHandler()}
													className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer select-none"
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													<SortIcon sorted={sorted} />
												</button>
											) : (
												flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)
											)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="py-10 text-center text-muted-foreground"
								>
									<Loader2
										className="animate-spin inline-block mr-2"
										size={16}
									/>
									Memuat data...
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="py-10 text-center text-muted-foreground text-sm"
								>
									{emptyMessage}
								</TableCell>
							</TableRow>
						) : (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className="border-b border-border/20 hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="py-3.5 px-4 text-sm">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination — hanya tampil jika ada lebih dari 1 halaman */}
			{pageCount > 1 && (
				<div className="flex items-center justify-between px-1">
					<p className="text-xs text-muted-foreground">
						Halaman {pageIndex + 1} dari {pageCount}
					</p>
					<Pagination>
						<PaginationContent className="gap-1">
							<PaginationItem>
								<PaginationPrevious
									onClick={() => table.previousPage()}
									aria-disabled={!table.getCanPreviousPage()}
									className={
										!table.getCanPreviousPage()
											? "pointer-events-none opacity-40 cursor-not-allowed"
											: "cursor-pointer hover:bg-white/10 transition-colors"
									}
								/>
							</PaginationItem>
							<PaginationItem>
								<PaginationNext
									onClick={() => table.nextPage()}
									aria-disabled={!table.getCanNextPage()}
									className={
										!table.getCanNextPage()
											? "pointer-events-none opacity-40 cursor-not-allowed"
											: "cursor-pointer hover:bg-white/10 transition-colors"
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</div>
	);
}
