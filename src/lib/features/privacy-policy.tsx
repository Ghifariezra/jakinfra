import content from "@docs/PRIVACY-POLICY.md?raw";
import { Head } from "@/components/common/head";
import { MarkdownContent } from "@/components/common/markdown-content";

export function RouteComponent() {
	return (
		<Head
			title="Kebijakan Privasi | JakInfra"
			description="Kebijakan privasi penggunaan platform dan API JakInfra."
		>
			<div className="min-h-screen bg-background pt-16">
				<div className="max-w-2xl mx-auto px-6 py-12">
					<div className="glass rounded-2xl p-8 md:p-10">
						<MarkdownContent content={content} />
					</div>
				</div>
			</div>
		</Head>
	);
}
