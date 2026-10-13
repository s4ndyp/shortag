import { App, Notice } from "obsidian";

interface GlobalSearchInstance {
	openGlobalSearch(query: string, active?: boolean): void;
}

/** Zelfde gedrag als klikken op een native tag: zoekpaneel met volledige tag. */
export function openTagSearch(app: App, tagWithHash: string): void {
	const body = tagWithHash.startsWith("#")
		? tagWithHash.slice(1)
		: tagWithHash;
	if (!body) return;

	const internal = (
		app as App & {
			internalPlugins: {
				getPluginById(id: string): { instance?: GlobalSearchInstance } | null;
			};
		}
	).internalPlugins.getPluginById("global-search");
	const instance = internal?.instance as GlobalSearchInstance | undefined;
	if (!instance?.openGlobalSearch) {
		new Notice("Schakel de core plugin Zoeken in om tags te doorzoeken.");
		return;
	}

	instance.openGlobalSearch(`tag:#${body}`);
}
