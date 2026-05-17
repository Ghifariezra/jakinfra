import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
	h1: ({ children }) => (
		<h1 className="text-3xl font-semibold text-foreground mb-2 pb-3 border-b border-border/40">
			{children}
		</h1>
	),
	h2: ({ children }) => (
		<h2 className="text-lg font-semibold text-foreground mt-10 mb-3">
			{children}
		</h2>
	),
	p: ({ children }) => (
		<p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
	),
	ul: ({ children }) => <ul className="space-y-1.5 mb-4 ml-4">{children}</ul>,
	li: ({ children }) => (
		<li className="text-muted-foreground flex gap-2">
			<span className="text-teal-400 mt-1 shrink-0">•</span>
			<span>{children}</span>
		</li>
	),
	strong: ({ children }) => (
		<strong className="text-foreground font-bold">{children}</strong>
	),
	em: ({ children }) => (
		<em className="text-muted-foreground/70 not-italic text-sm">{children}</em>
	),
	a: ({ href, children }) => (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="text-teal-400 hover:text-teal-300 underline underline-offset-4 transition-colors"
		>
			{children}
		</a>
	),
	code: ({ children }) => (
		<code
			className="
            bg-teal-950/60 dark:bg-teal-400/10
            text-teal-300 dark:text-teal-300
            border border-teal-400/20
            px-1.5 py-0.5 rounded text-xs font-mono
        "
		>
			{children}
		</code>
	),
	hr: () => <hr className="border-border/40 my-8" />,
	blockquote: ({ children }) => (
		<blockquote
			className="
            border-l-2 border-teal-400
            pl-4 py-2 my-4
            rounded-r-lg
            bg-slate-100 dark:bg-teal-400/10
            text-slate-600 dark:text-slate-300
        "
		>
			{children}
		</blockquote>
	),
};

export function MarkdownContent({ content }: { content: string }) {
	return (
		<ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
			{content}
		</ReactMarkdown>
	);
}
