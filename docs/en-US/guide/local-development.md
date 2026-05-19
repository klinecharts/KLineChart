# 👨‍💻 Local Development

This page is for contributors who want to develop KLineChart, debug source code, or understand how the project works internally. Start with the quick setup, then use the architecture and entry-point notes when you need to change a specific module.

## Project Overview

<script setup>
import ProjectDirExplain from '../../@views/local-development/ProjectDirExplain.vue'
import ProjectModuleExplain from '../../@views/local-development/ProjectModuleExplain.vue'
</script>

### Directory Overview

<ProjectDirExplain/>

### Module Relationships

<ProjectModuleExplain/>

The diagram above shows the internal hierarchy. Lower layers host and organize upper layers.

- `Figure`: basic shapes such as circle, arc, polygon, rect, and text.
- `View`: the smallest business drawing unit. It reads data from `Store` and draws candlesticks, area charts, grid lines, crosshairs, indicators, and more.
- `Widget`: creates and manages canvas layers, then combines related `View`s.
- `Pane`: creates DOM containers and combines `Widget`s into regions such as the main chart, indicator panes, and axes.
- `Chart`: manages `Pane`s, dispatches events, updates `Store`, and notifies lower layers to refresh when needed.

## Quick Start

### 1. Prepare Environment

- Node.js: `>= 22.0.0`. You can use the repository `.nvmrc` directly.
- Package manager: `pnpm`. The project validates this during installation, so do not install dependencies with npm or yarn.

```bash
nvm use
corepack enable
pnpm -v
```

### 2. Install Dependencies

Run in the project root:

```bash
pnpm install
```

### 3. Run Baseline Checks

```bash
pnpm run code-lint
pnpm run type-check
pnpm run build
```

## Local Debugging

### Option 1: Use the Built-in Debug Page

Best for quickly validating source changes. The debug page lives in `debug` and imports `src/index.ts` directly, so you do not need to build `dist` first.

```bash
pnpm run debug
```

After startup, open the local URL shown in the terminal. You can edit `debug/main.js` to change initialization options, data loading, or interaction examples.

### Option 2: Debug in an App Project

Best for continuous core development or validating behavior in a real app. In a Vite project, alias `klinecharts` to this repository's source entry:

```ts
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      klinecharts: resolve('/your-local-path/KLineChart/src/index.ts')
    }
  }
})
```

Then `import { init } from 'klinecharts'` in your app will use the local source code directly.

### Option 3: Debug with the Docs Site

Best for validating API examples, documentation content, and site rendering.

The docs site reads `dist/umd/klinecharts.min.js` and injects it into the page. Before starting the docs site for the first time, or after changing `src`, build the production UMD bundle:

```bash
pnpm run build-umd:prod
pnpm run docs:dev
```

The docs site uses port `8888` by default.

## Common Commands

| Command | Description |
| --- | --- |
| `pnpm run debug` | Start the built-in debug page, using `src` directly |
| `pnpm run code-lint` | Run ESLint on `src/**/*.ts` |
| `pnpm run type-check` | Run TypeScript type checking |
| `pnpm run clean` | Clean `dist` |
| `pnpm run build-esm` | Build the ESM output |
| `pnpm run build-cjs` | Build the CommonJS output |
| `pnpm run build-umd:dev` | Build the UMD development output |
| `pnpm run build-umd:prod` | Build the UMD production output |
| `pnpm run build-umd` | Build both UMD development and production outputs |
| `pnpm run build-core` | Build ESM, CommonJS, and UMD outputs |
| `pnpm run build-dts` | Generate `dist/index.d.ts` |
| `pnpm run build` | Full build: clean, build core outputs, and generate declarations |
| `pnpm run docs:dev` | Start the docs site |
| `pnpm run docs:build` | Build the docs site. This builds the production UMD bundle first |
| `pnpm run docs:preview` | Preview the built docs site |

## Architecture Tour

### Entry and Lifecycle

- Public exports live in `src/index.ts`.
- `init` creates a chart instance and mounts it to a container.
- `dispose` destroys a chart instance and releases resources.
- `registerFigure`, `registerIndicator`, `registerOverlay`, `registerXAxis`, `registerYAxis`, `registerStyles`, and `registerLocale` register extension capabilities.
- `src/Chart.ts` is the runtime orchestrator for panes, events, updates, and instance APIs.

### Data and State

- `src/Store.ts` is the state hub. It manages the data list, visible range, zoom and scroll state, styles, formatters, locale, indicators, and overlays.
- Interactions or API calls usually update `Store` first, then use `UpdateLevel` to control the refresh granularity.
- Data integration types live in `src/common/Data.ts`, `src/common/DataLoader.ts`, and `src/Options.ts`.

### Rendering Pipeline

- `Pane`: organizes chart regions such as the main chart, indicator panes, and x-axis area.
- `Widget`: manages canvas layers and interaction carrier areas.
- `View`: reads `Store` and component state, then performs the actual drawing.
- Start with `src/view/CandleBarView.ts` for candlestick bars and `src/view/IndicatorView.ts` for indicators.

### Event Pipeline

- `src/Event.ts` handles mouse, touch, wheel, and keyboard events.
- `src/common/EventHandler.ts` wraps low-level event listeners and gesture recognition.
- Events drive scroll, zoom, crosshair, overlay selection, and drag state changes, then trigger the relevant regions to redraw.

### Extension Mechanism

Extension capabilities are grouped under `src/extension`:

- `figure`: basic figure templates.
- `indicator`: technical indicator templates.
- `overlay`: drawing and overlay templates.
- `styles`: style extensions.
- `i18n`: locale configuration.
- `x-axis`, `y-axis`: axis extensions.

## Common Change Entry Points

| Goal | Main Entry Points |
| --- | --- |
| Change public APIs such as init, dispose, and registration | `src/index.ts`, `src/Chart.ts` |
| Change data loading or visible-range logic | `src/Store.ts`, `src/common/DataLoader.ts`, `src/common/VisibleRange.ts` |
| Change candlestick visuals | `src/view/CandleBarView.ts`, `src/view/CandleAreaView.ts`, `src/common/Styles.ts` |
| Change indicator logic | `src/extension/indicator`, `src/component/Indicator.ts`, `src/view/IndicatorView.ts` |
| Change drawings or overlays | `src/extension/overlay`, `src/component/Overlay.ts`, `src/view/OverlayView.ts` |
| Change interaction behavior | `src/Event.ts`, `src/common/EventHandler.ts` |
| Change axes | `src/component/XAxis.ts`, `src/component/YAxis.ts`, `src/view/XAxisView.ts`, `src/view/YAxisView.ts` |
| Change default styles | `src/common/Styles.ts`, `src/extension/styles` |
| Change the docs site | `docs`, `docs/.vitepress`, `docs/@views` |
| Change the build flow | `scripts/build`, `package.json` |

## Before Submitting

For normal source changes, run:

```bash
pnpm run code-lint
pnpm run type-check
pnpm run build
```

If you changed documentation as well, also run:

```bash
pnpm run docs:build
```

## Troubleshooting

- Installation fails because the package manager is incorrect: use `pnpm install`.
- Installation fails because the Node.js version is unsupported: switch to Node.js `>= 22.0.0`, or run `nvm use`.
- `pnpm run docs:dev` fails because `dist/umd/klinecharts.min.js` does not exist: run `pnpm run build-umd:prod` first.
- Docs examples do not reflect source changes: run `pnpm run build-umd:prod`, then restart `pnpm run docs:dev`.
- You only want to validate source changes without building: use `pnpm run debug`, which loads `src/index.ts` directly.
