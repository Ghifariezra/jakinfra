"use client";

import * as React from "react";
import { CopyButton } from "@/components/animate-ui/components/buttons/copy";
import {
	Tabs,
	TabsContent,
	TabsContents,
	TabsHighlight,
	TabsHighlightItem,
	TabsList,
	type TabsProps,
	TabsTrigger,
} from "@/components/animate-ui/primitives/animate/tabs";
import { cn } from "@/lib/utils";

// ─── Hook: deteksi dark mode dari class di <html> ─────────────────────────────
function useIsDark() {
	const [isDark, setIsDark] = React.useState(() =>
		document.documentElement.classList.contains("dark"),
	);

	React.useEffect(() => {
		const observer = new MutationObserver(() => {
			setIsDark(document.documentElement.classList.contains("dark"));
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});
		return () => observer.disconnect();
	}, []);

	return isDark;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type CodeTabsProps = {
	codes: Record<string, string>;
	lang?: string;
	themes?: { light: string; dark: string };
	copyButton?: boolean;
	onCopiedChange?: (copied: boolean, content?: string) => void;
} & Omit<TabsProps, "children">;

// ─── Component ────────────────────────────────────────────────────────────────

function CodeTabs({
	codes,
	lang = "bash",
	themes = {
		light: "github-light",
		dark: "github-dark",
	},
	className,
	defaultValue,
	value,
	onValueChange,
	copyButton = true,
	onCopiedChange,
	...props
}: CodeTabsProps) {
	const isDark = useIsDark();

	const [highlightedCodes, setHighlightedCodes] = React.useState<Record<
		string,
		string
	> | null>(null);

	const [selectedCode, setSelectedCode] = React.useState<string>(
		value ?? defaultValue ?? Object.keys(codes)[0] ?? "",
	);

	React.useEffect(() => {
		async function loadHighlightedCode() {
			try {
				const { codeToHtml } = await import("shiki");
				const newHighlightedCodes: Record<string, string> = {};

				for (const [command, val] of Object.entries(codes)) {
					const highlighted = await codeToHtml(val, {
						lang,
						themes: {
							light: themes.light,
							dark: themes.dark,
						},
						defaultColor: isDark ? "dark" : "light",
					});
					newHighlightedCodes[command] = highlighted;
				}

				setHighlightedCodes(newHighlightedCodes);
			} catch (error) {
				console.error("Error highlighting codes", error);
				setHighlightedCodes(codes);
			}
		}
		loadHighlightedCode();
	}, [isDark, lang, themes.light, themes.dark, codes]);

	return (
		<Tabs
			data-slot="install-tabs"
			className={cn(
				"w-full gap-0 bg-muted/50 rounded-xl border overflow-hidden",
				className,
			)}
			{...props}
			value={selectedCode}
			onValueChange={(val) => {
				setSelectedCode(val);
				onValueChange?.(val);
			}}
		>
			<TabsHighlight className="absolute z-0 inset-0 rounded-none shadow-none bg-transparent after:content-[''] after:absolute after:inset-x-0 after:h-0.5 after:bottom-0 dark:after:bg-white after:bg-black after:rounded-t-full">
				<TabsList
					data-slot="install-tabs-list"
					className="w-full relative flex items-center justify-between rounded-none h-10 bg-muted border-b border-border/75 dark:border-border/50 text-current py-0 px-4"
				>
					<div className="flex gap-x-3 h-full">
						{highlightedCodes &&
							Object.keys(highlightedCodes).map((code) => (
								<TabsHighlightItem
									key={code}
									value={code}
									className="flex items-center justify-center"
								>
									<TabsTrigger
										value={code}
										className="text-muted-foreground h-full text-sm font-medium data-[state=active]:text-current px-0 cursor-pointer"
									>
										{code}
									</TabsTrigger>
								</TabsHighlightItem>
							))}
					</div>

					{copyButton && highlightedCodes && (
						<CopyButton
							content={codes[selectedCode]}
							size="xs"
							variant="ghost"
							className="-me-2.5 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
							onCopiedChange={onCopiedChange}
						/>
					)}
				</TabsList>
			</TabsHighlight>

			<TabsContents data-slot="install-tabs-contents">
				{highlightedCodes &&
					Object.entries(highlightedCodes).map(([code, val]) => (
						<TabsContent
							data-slot="install-tabs-content"
							key={code}
							className="w-full"
							value={code}
						>
							<div
								className="w-full text-sm overflow-auto flex items-center p-4 [&>pre,&_code]:bg-transparent! [&_code_.line]:px-0! [&>pre,&_code]:[background:transparent_!important] [&>pre,&_code]:border-none [&_code]:text-[13px]!"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output
								dangerouslySetInnerHTML={{ __html: val }}
							/>
						</TabsContent>
					))}
			</TabsContents>
		</Tabs>
	);
}

export { CodeTabs, type CodeTabsProps };
