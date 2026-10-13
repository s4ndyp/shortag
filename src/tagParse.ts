/** Obsidian-tag body: letters, cijfers, _, -, / (genest). */
const TAG_BODY = String.raw`[\p{L}\p{N}_\-/]+`;

export const NESTED_TAG_REGEX = new RegExp(
	`#(${TAG_BODY})`,
	"gu",
);

const TAG_NODE_NAMES = new Set([
	"TagName",
	"HashtagTag",
	"Hashtag",
	"tag",
	"Tag",
]);

export function isTagSyntaxNode(name: string): boolean {
	if (TAG_NODE_NAMES.has(name)) return true;
	return /tag/i.test(name) && !/paragraph/i.test(name);
}

export function shortenNestedTag(
	fullText: string,
	separator: string,
	minSegments: number,
	showHash: boolean,
): string | null {
	if (!fullText.startsWith("#")) return null;
	const body = fullText.slice(1);
	if (!body) return null;

	const sep = separator || "/";
	const parts = body.split(sep).filter((p) => p.length > 0);
	if (parts.length < minSegments) return null;

	const last = parts[parts.length - 1];
	if (!last) return null;

	return showHash ? `#${last}` : last;
}
