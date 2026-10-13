import { Plugin } from "obsidian";
import {
	setShortagApp,
	setShortagSettingsGetter,
	shortagCMPlugin,
} from "./src/editorExtension";
import {
	applyShortagStyles,
	DEFAULT_SETTINGS,
	normalizeSettings,
} from "./src/settings";
import { ShortagSettingTab } from "./src/settingsTab";
import type { ShortagSettings } from "./src/types";

export default class ShortagPlugin extends Plugin {
	settings: ShortagSettings = DEFAULT_SETTINGS;

	async onload(): Promise<void> {
		await this.loadSettings();
		setShortagApp(this.app);
		setShortagSettingsGetter(() => this.settings);
		applyShortagStyles(this.settings);
		this.registerEditorExtension(shortagCMPlugin);
		this.addSettingTab(new ShortagSettingTab(this.app, this));
	}

	onunload(): void {
		document.getElementById("shortag-dynamic-styles")?.remove();
	}

	async loadSettings(): Promise<void> {
		const data = (await this.loadData()) as Partial<ShortagSettings> | null;
		this.settings = normalizeSettings(data);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
		applyShortagStyles(this.settings);
	}
}
