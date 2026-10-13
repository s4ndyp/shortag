import { toPickerHex } from "./colorUtils";
import type { ShortagSettings } from "./types";

export const DEFAULT_TEXT_COLOR_HEX = "#7c3aed";
export const DEFAULT_BACKGROUND_COLOR_HEX = "#ede9fe";

export const DEFAULT_SETTINGS: ShortagSettings = {
	enabled: true,
	minSegments: 2,
	separator: "/",
	showHash: true,
	applyCustomStyle: true,
	style: {
		textColor: DEFAULT_TEXT_COLOR_HEX,
		backgroundColor: DEFAULT_BACKGROUND_COLOR_HEX,
		borderRadius: "4px",
		padding: "0 4px",
	},
	ignoreCodeblocks: true,
};

export function applyShortagStyles(settings: ShortagSettings): void {
	const styleId = "shortag-dynamic-styles";
	let el = document.getElementById(styleId) as HTMLStyleElement | null;
	if (!el) {
		el = document.createElement("style");
		el.id = styleId;
		document.head.appendChild(el);
	}

	if (!settings.enabled || !settings.applyCustomStyle) {
		el.textContent = "";
		return;
	}

	const s = settings.style;
	el.textContent = `
.cm-editor .shortag-display {
	color: ${s.textColor} !important;
	background-color: ${s.backgroundColor} !important;
	border-radius: ${s.borderRadius};
	padding: ${s.padding};
}`;
}

export function normalizeSettings(
	raw: Partial<ShortagSettings> | null | undefined,
): ShortagSettings {
	const base = Object.assign({}, DEFAULT_SETTINGS, raw);
	if (raw?.style) {
		const merged = Object.assign({}, DEFAULT_SETTINGS.style, raw.style);
		base.style = {
			textColor: toPickerHex(merged.textColor, DEFAULT_TEXT_COLOR_HEX),
			backgroundColor: toPickerHex(
				merged.backgroundColor,
				DEFAULT_BACKGROUND_COLOR_HEX,
			),
			borderRadius:
				typeof merged.borderRadius === "string" && merged.borderRadius.trim()
					? merged.borderRadius.trim()
					: DEFAULT_SETTINGS.style.borderRadius,
			padding:
				typeof merged.padding === "string" && merged.padding.trim()
					? merged.padding.trim()
					: DEFAULT_SETTINGS.style.padding,
		};
	}
	if (typeof raw?.minSegments === "number" && raw.minSegments >= 1) {
		base.minSegments = Math.floor(raw.minSegments);
	}
	if (typeof raw?.separator === "string" && raw.separator.length > 0) {
		base.separator = raw.separator;
	}
	return base;
}
