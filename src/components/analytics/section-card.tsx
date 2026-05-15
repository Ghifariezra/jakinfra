import { memo, type ReactNode } from "react";

interface SectionCardProps {
	children: ReactNode;
	className?: string;
}

export const SectionCard = memo(function SectionCard({
	children,
	className = "",
}: SectionCardProps) {
	return (
		<div className={`glass rounded-2xl p-6 relative ${className}`}>
			{children}
		</div>
	);
});
