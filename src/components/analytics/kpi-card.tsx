import { Loader2 } from "lucide-react";
import { memo } from "react";

interface KpiCardProps {
	icon: React.ElementType;
	label: string;
	value: string | number;
	iconColor: string;
	isLoading?: boolean;
}

export const KpiCard = memo(function KpiCard({
	icon: Icon,
	label,
	value,
	iconColor,
	isLoading,
}: KpiCardProps) {
	return (
		<div className="glass rounded-2xl p-5 flex items-center gap-4">
			<div
				className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
				style={{ background: `${iconColor}18` }}
			>
				<Icon size={20} style={{ color: iconColor }} />
			</div>
			<div>
				<p className="text-xs text-muted-foreground font-medium mb-0.5">
					{label}
				</p>
				<div className="text-2xl font-semibold text-foreground tracking-tight h-8 flex items-center">
					{isLoading ? (
						<Loader2 className="animate-spin text-muted-foreground" size={20} />
					) : (
						value
					)}
				</div>
			</div>
		</div>
	);
});
