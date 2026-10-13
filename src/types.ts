import type { TextDecorationOption } from "./textDecorationOptions";

export interface ShortagStyleSettings {
	textColor: string;
	backgroundColor: string;
	fontWeight: string;
	textDecoration: TextDecorationOption;
	borderRadius: string;
	padding: string;
}

export interface ShortagSettings {
	enabled: boolean;
	/** Minimaal aantal segmenten (gescheiden door separator) voordat wordt afgekort. */
	minSegments: number;
	/** Scheidingsteken in geneste tags (Obsidian standaard: /). */
	separator: string;
	/** Toon het #-teken in de afgekorte weergave. */
	showHash: boolean;
	/** Eigen CSS-styling toepassen (overschrijft Obsidian tag-styling in de editor). */
	applyCustomStyle: boolean;
	style: ShortagStyleSettings;
	ignoreCodeblocks: boolean;
}

export interface NestedTagMatch {
	from: number;
	to: number;
	/** Volledige tagtekst in het document, bv. #project/work/done */
	fullText: string;
	/** Weergavetekst in de editor, bv. #done */
	displayText: string;
}
