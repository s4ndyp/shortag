import {
	Decoration,
	DecorationSet,
	WidgetType,
} from "@codemirror/view";
import type { NestedTagMatch } from "./types";
import type { ShortagSettings } from "./types";

class ShortTagWidget extends WidgetType {
	constructor(
		readonly displayText: string,
		readonly applyCustomStyle: boolean,
	) {
		super();
	}

	toDOM(): HTMLElement {
		const span = document.createElement("span");
		span.className = "shortag-display";
		if (!this.applyCustomStyle) {
			span.classList.add("shortag-display-native");
		}
		span.textContent = this.displayText;
		span.setAttribute("aria-label", this.displayText);
		return span;
	}

	ignoreEvent(): boolean {
		return true;
	}

	eq(other: ShortTagWidget): boolean {
		return (
			other.displayText === this.displayText &&
			other.applyCustomStyle === this.applyCustomStyle
		);
	}
}

export function buildDecorations(
	matches: NestedTagMatch[],
	settings: ShortagSettings,
): DecorationSet {
	if (!settings.enabled || matches.length === 0) {
		return Decoration.none;
	}

	const items: ReturnType<Decoration["range"]>[] = [];

	for (const match of matches) {
		items.push(
			Decoration.replace({
				widget: new ShortTagWidget(
					match.displayText,
					settings.applyCustomStyle,
				),
				inclusive: false,
			}).range(match.from, match.to),
		);
	}

	return Decoration.set(items, true);
}
