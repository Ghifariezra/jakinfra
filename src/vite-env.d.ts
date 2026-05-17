/// <reference types="vite/client" />

declare module "*.md?raw" {
	const content: string;
	export default content;
}

// atau lebih simpel
declare module "*?raw" {
	const content: string;
	export default content;
}

declare module "*.gpx?raw" {
	const content: string;
	export default content;
}
