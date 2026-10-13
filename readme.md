# Shortag (Obsidian plugin)

Geneste Obsidian-tags (`#project/work/done`) worden in de **editor** afgekort weergegeven als alleen het **laatste segment** (`#done`). De volledige tag blijft in je Markdown staan; alleen de weergave verandert.

## Functies

- **Afkorting in de editor** — alleen het laatste deel van geneste tags (configureerbaar minimum aantal segmenten).
- **Instellingenpaneel** — aan/uit, scheidingsteken, `#` in weergave, codeblokken overslaan.
- **Eigen styling** — kleur, achtergrond, letterdikte, enz. met `!important` zodat het de standaard tag-styling in de editor overschrijft (optioneel uit te zetten).

## Ontwikkeling (lokaal)

```bash
npm install
npm run build
```

Kopieer `main.js`, `manifest.json` en `styles.css` naar `.obsidian/plugins/shortag/` in je vault, of symlink deze map.

```bash
npm run dev   # watch mode
```

## Build via GitHub Actions

| Workflow | Wanneer | Wat |
|----------|---------|-----|
| **build.yml** | Elke push/PR naar `main` | `npm ci` + `npm run build`. Artefacten: `main.js`, manifest, CSS. |
| **release.yml** | Elke **push naar `main`** | Leest `version` uit `manifest.json`. Bestaat die release nog niet → bouwt en publiceert tag + release. |

**Nieuwe release na merge:**

1. Verhoog `version` in **`manifest.json`** en voeg dezelfde sleutel toe in **`versions.json`**.
2. Merge naar `main`.
3. GitHub Actions maakt release **`x.y.z`** als die nog niet bestaat.

`main.js` staat **niet** in git — alleen TypeScript-bron. Obsidian heeft het gebundelde `main.js` nodig; dat komt uit `npm run build` of een GitHub Release.

## Installeren met BRAT

[BRAT](https://github.com/TfTHacker/obsidian42-brat) installeert plugins rechtstreeks van GitHub.

1. Command palette → **BRAT: Add a beta plugin for testing**
2. Vul in: `s4ndyp/shortag`
3. Zorg dat release **0.1.0** (of nieuwer) bestaat op GitHub.
4. **BRAT: Check for updates to all beta plugins** voor updates.

Plugin-map: `.obsidian/plugins/shortag/` (id uit `manifest.json`).

## Instellingen

**Instellingen → Community plugins → Shortag**

- Weergave (inschakelen, minimum segmenten, scheidingsteken, `#` tonen)
- Codeblokken overslaan
- Styling (eigen CSS waarden)

## Licentie

MIT
