import type { ShortagSettings, StylePresetSlot } from "./types";

export const STYLE_PRESET_COUNT = 2;

export function emptyStylePresets(): (StylePresetSlot | null)[] {
	return Array.from({ length: STYLE_PRESET_COUNT }, (): StylePresetSlot | null => null);
}

export function captureStylePreset(settings: ShortagSettings): StylePresetSlot {
	return {
		applyCustomStyle: settings.applyCustomStyle,
		style: { ...settings.style },
		savedAt: Date.now(),
	};
}

export function applyStylePreset(
	settings: ShortagSettings,
	preset: StylePresetSlot,
): void {
	settings.applyCustomStyle = preset.applyCustomStyle;
	settings.style = { ...preset.style };
}

export function presetSummary(preset: StylePresetSlot | null): string {
	if (!preset) return "Leeg — sla eerst de huidige styling op.";
	const s = preset.style;
	const when = preset.savedAt
		? new Date(preset.savedAt).toLocaleString()
		: "onbekend moment";
	return `${s.textColor} / ${s.backgroundColor} · radius ${s.borderRadius} · padding ${s.padding}${preset.applyCustomStyle ? "" : " (eigen styling uit)"} — opgeslagen ${when}`;
}
