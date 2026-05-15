import { Link } from "@tanstack/react-router";
import { Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
	iconSize?: number;
	textClassName?: string;
	className?: string;
}

export function BrandLogo({
	iconSize = 24,
	textClassName,
	className,
}: BrandLogoProps) {
	return (
		<Link
			to="/"
			className={cn(
				"flex items-center gap-2 hover:opacity-80 transition-opacity",
				className,
			)}
		>
			<Hexagon className="text-teal-400" size={iconSize} strokeWidth={2.5} />
			<span className={cn("font-bold tracking-wide", textClassName)}>
				JakInfra
			</span>
		</Link>
	);
}
