import { syntaxTree } from "@codemirror/language";
import {
	Decoration,
	DecorationSet,
	EditorView,
	PluginValue,
	ViewPlugin,
	ViewUpdate,
} from "@codemirror/view";
import { buildDecorations } from "./decorations";
import { DEFAULT_SETTINGS } from "./settings";
import {
	isTagSyntaxNode,
	NESTED_TAG_REGEX,
	shortenNestedTag,
} from "./tagParse";
import type { NestedTagMatch, ShortagSettings } from "./types";

export type SettingsGetter = () => ShortagSettings;

function overlapsExisting(
	from: number,
	to: number,
	matches: NestedTagMatch[],
): boolean {
	return matches.some((m) => from < m.to && to > m.from);
}

export class ShortagCMPlugin implements PluginValue {
	decorations: DecorationSet = Decoration.none;

	constructor(
		private view: EditorView,
		private getSettings: SettingsGetter,
	) {
		this.refresh(view);
	}

	private isInCodeblock(view: EditorView, position: number): boolean {
		if (!this.getSettings().ignoreCodeblocks) return false;
		const tree = syntaxTree(view.state);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let node: any = tree.resolve(position, 1);
		while (node) {
			const name: string = node.name ?? "";
			if (
				name === "FencedCode" ||
				name === "CodeBlock" ||
				name === "InlineCode" ||
				name === "CodeText" ||
				name.includes("Code") ||
				name.includes("code")
			) {
				return true;
			}
			node = node.parent;
		}
		return false;
	}

	private tryAddMatch(
		matches: NestedTagMatch[],
		view: EditorView,
		from: number,
		to: number,
	): void {
		const settings = this.getSettings();
		if (!settings.enabled) return;
		if (from >= to) return;
		if (this.isInCodeblock(view, from)) return;
		if (overlapsExisting(from, to, matches)) return;

		const fullText = view.state.doc.sliceString(from, to);
		const displayText = shortenNestedTag(
			fullText,
			settings.separator,
			settings.minSegments,
			settings.showHash,
		);
		if (!displayText || displayText === fullText) return;

		matches.push({ from, to, fullText, displayText });
	}

	private scanSyntaxTreeTags(
		view: EditorView,
		matches: NestedTagMatch[],
		rangeFrom: number,
		rangeTo: number,
	): void {
		syntaxTree(view.state).iterate({
			from: rangeFrom,
			to: rangeTo,
			enter: (node) => {
				if (!isTagSyntaxNode(node.name)) return;
				this.tryAddMatch(matches, view, node.from, node.to);
			},
		});
	}

	private scanRegexTags(
		view: EditorView,
		matches: NestedTagMatch[],
		rangeFrom: number,
		rangeTo: number,
	): void {
		const settings = this.getSettings();
		const text = view.state.doc.sliceString(rangeFrom, rangeTo);
		NESTED_TAG_REGEX.lastIndex = 0;
		let exec: RegExpExecArray | null;
		while ((exec = NESTED_TAG_REGEX.exec(text)) !== null) {
			const from = exec.index + rangeFrom;
			const to = from + exec[0].length;
			const displayText = shortenNestedTag(
				exec[0],
				settings.separator,
				settings.minSegments,
				settings.showHash,
			);
			if (!displayText) continue;
			this.tryAddMatch(matches, view, from, to);
		}
	}

	private scanNestedTags(view: EditorView): NestedTagMatch[] {
		const matches: NestedTagMatch[] = [];
		for (const range of view.visibleRanges) {
			this.scanSyntaxTreeTags(view, matches, range.from, range.to);
			this.scanRegexTags(view, matches, range.from, range.to);
		}
		matches.sort((a, b) => a.from - b.from);
		return matches;
	}

	private refresh(view: EditorView): void {
		const settings = this.getSettings();
		const matches = this.scanNestedTags(view);
		this.decorations = buildDecorations(matches, settings);
	}

	update(update: ViewUpdate): void {
		if (
			update.docChanged ||
			update.viewportChanged ||
			update.geometryChanged ||
			update.heightChanged
		) {
			this.refresh(update.view);
		}
	}
}

let settingsGetter: SettingsGetter = () => DEFAULT_SETTINGS;

export function setShortagSettingsGetter(getter: SettingsGetter): void {
	settingsGetter = getter;
}

export const shortagCMPlugin = ViewPlugin.fromClass(
	class extends ShortagCMPlugin {
		constructor(view: EditorView) {
			super(view, settingsGetter);
		}
	},
	{
		decorations: (v) => v.decorations,
	},
);
