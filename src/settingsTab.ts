import {
	App,
	ColorComponent,
	PluginSettingTab,
	Setting,
	TextComponent,
} from "obsidian";
import type ShortagPlugin from "../main";
import { isHexColor, toPickerHex } from "./colorUtils";
import {
	DEFAULT_BACKGROUND_COLOR_HEX,
	DEFAULT_TEXT_COLOR_HEX,
} from "./settings";

export class ShortagSettingTab extends PluginSettingTab {
	plugin: ShortagPlugin;

	constructor(app: App, plugin: ShortagPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h3", { text: "Weergave" });

		new Setting(containerEl)
			.setName("Plugin inschakelen")
			.setDesc("Geneste tags afgekort tonen in de editor (bron blijft volledig).")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enabled)
					.onChange(async (v) => {
						this.plugin.settings.enabled = v;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Minimaal aantal segmenten")
			.setDesc(
				"Alleen afkorten als de tag minstens zoveel delen heeft (bijv. 2 → #a/b wordt #b).",
			)
			.addSlider((slider) =>
				slider
					.setLimits(2, 6, 1)
					.setValue(this.plugin.settings.minSegments)
					.setDynamicTooltip()
					.onChange(async (v) => {
						this.plugin.settings.minSegments = v;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Scheidingsteken")
			.setDesc("Teken tussen geneste tag-delen (Obsidian standaard: /).")
			.addText((text) =>
				text
					.setPlaceholder("/")
					.setValue(this.plugin.settings.separator)
					.onChange(async (v) => {
						const trimmed = v.trim();
						this.plugin.settings.separator = trimmed || "/";
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("# tonen in afkorting")
			.setDesc("Voeg een hekje toe vóór het laatste segment in de weergave.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showHash)
					.onChange(async (v) => {
						this.plugin.settings.showHash = v;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Codeblokken overslaan")
			.setDesc("Geen afkorting in fenced code, inline code of codeblokken.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.ignoreCodeblocks)
					.onChange(async (v) => {
						this.plugin.settings.ignoreCodeblocks = v;
						await this.plugin.saveSettings();
					}),
			);

		containerEl.createEl("h3", { text: "Styling" });

		new Setting(containerEl)
			.setName("Eigen styling toepassen")
			.setDesc(
				"Overschrijft kleur en achtergrond van afgekorte tags in de editor. Letterdikte en decoratie blijven zoals bij normale tags.",
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.applyCustomStyle)
					.onChange(async (v) => {
						this.plugin.settings.applyCustomStyle = v;
						await this.plugin.saveSettings();
					}),
			);

		this.addStyleColorSetting(
			"Tekstkleur",
			"textColor",
			DEFAULT_TEXT_COLOR_HEX,
			"Kleur via het rondje of typ een hex-waarde (bijv. #7c3aed).",
		);
		this.addStyleColorSetting(
			"Achtergrondkleur",
			"backgroundColor",
			DEFAULT_BACKGROUND_COLOR_HEX,
			"Achtergrond via het rondje of typ een hex-waarde.",
		);
		this.addStyleTextSetting("Hoekradius", "borderRadius", "4px");
		this.addStyleTextSetting("Padding", "padding", "0 4px");
	}

	private addStyleColorSetting(
		name: string,
		key: "textColor" | "backgroundColor",
		fallbackHex: string,
		desc?: string,
	): void {
		const setting = new Setting(this.containerEl).setName(name);
		if (desc) setting.setDesc(desc);

		let pickerRef: ColorComponent | undefined;
		let textRef: TextComponent | undefined;

		setting.addColorPicker((picker) => {
			pickerRef = picker;
			picker
				.setValue(
					toPickerHex(this.plugin.settings.style[key], fallbackHex),
				)
				.onChange(async (hex) => {
					this.plugin.settings.style[key] = hex;
					textRef?.setValue(hex);
					await this.plugin.saveSettings();
				});
		});

		setting.addText((text) => {
			textRef = text;
			text
				.setPlaceholder(fallbackHex)
				.setValue(this.plugin.settings.style[key])
				.onChange(async (raw) => {
					const trimmed = raw.trim();
					if (!isHexColor(trimmed)) return;
					const hex = toPickerHex(trimmed, fallbackHex);
					this.plugin.settings.style[key] = hex;
					pickerRef?.setValue(hex);
					text.setValue(hex);
					await this.plugin.saveSettings();
				});
		});
	}

	private addStyleTextSetting(
		name: string,
		key: keyof ShortagPlugin["settings"]["style"],
		placeholder?: string,
	): void {
		new Setting(this.containerEl)
			.setName(name)
			.addText((text) =>
				text
					.setPlaceholder(placeholder ?? "")
					.setValue(this.plugin.settings.style[key])
					.onChange(async (v) => {
						this.plugin.settings.style[key] = v;
						await this.plugin.saveSettings();
					}),
			);
	}
}
