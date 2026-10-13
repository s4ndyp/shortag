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
		fontWeight: "500",
		textDecoration: "none",
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
	font-weight: ${s.fontWeight} !important;
	text-decoration: ${s.textDecoration} !important;
	border-radius: ${s.borderRadius};
	padding: ${s.padding};
}`;
}

export function normalizeSettings(
	raw: Partial<ShortagSettings> | null | undefined,
): ShortagSettings {
	const base = Object.assign({}, DEFAULT_SETTINGS, raw);
	if (raw?.style) {
		base.style = Object.assign({}, DEFAULT_SETTINGS.style, raw.style);
		base.style.textColor = toPickerHex(
			raw.style.textColor,
			DEFAULT_TEXT_COLOR_HEX,
		);
		base.style.backgroundColor = toPickerHex(
			raw.style.backgroundColor,
			DEFAULT_BACKGROUND_COLOR_HEX,
		);
	}
	if (typeof raw?.minSegments === "number" && raw.minSegments >= 1) {
		base.minSegments = Math.floor(raw.minSegments);
	}
	if (typeof raw?.separator === "string" && raw.separator.length > 0) {
		base.separator = raw.separator;
	}
	return base;
}
