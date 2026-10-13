export type TextDecorationOption =
	| "none"
	| "underline"
	| "line-through"
	| "overline";

export const TEXT_DECORATION_OPTIONS: {
	value: TextDecorationOption;
	label: string;
}[] = [
	{ value: "none", label: "Geen" },
	{ value: "underline", label: "Onderstrepen" },
	{ value: "line-through", label: "Doorhalen" },
	{ value: "overline", label: "Bovenlijn" },
];

export function normalizeTextDecoration(value: string | undefined): TextDecorationOption {
	const allowed = new Set(TEXT_DECORATION_OPTIONS.map((o) => o.value));
	if (value && allowed.has(value as TextDecorationOption)) {
		return value as TextDecorationOption;
	}
	return "none";
}
