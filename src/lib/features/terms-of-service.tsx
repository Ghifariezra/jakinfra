import content from "@docs/TERMS-OF-SERVICE.md?raw";
import { Head } from "@/components/common/head";
import { MarkdownContent } from "@/components/common/markdown-content";

export function RouteComponent() {
	return (
		<Head
			title="Syarat & Ketentuan Layanan | JakInfra"
			description="Syarat dan ketentuan layanan yang mengatur penggunaan platform, data geospasial, dan API JakInfra."
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
