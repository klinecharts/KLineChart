# 👨‍💻 Local Development

## Summary
If you want to build features by yourself or quickly understand how KLineChart works internally, this page gives you the shortest path.

You will get two things:
- Development loop: how to change, preview, verify, and submit locally.
- Core architecture: `init -> Chart -> Store -> Pane/Widget/View` in one pass.

## Notes
### Directory overview
<script setup>
import ProjectDirExplain from '../../@views/local-development/ProjectDirExplain.vue'
import ProjectModuleExplain from '../../@views/local-development/ProjectModuleExplain.vue'
</script>
<ProjectDirExplain/>

### Module dependencies
<ProjectModuleExplain/>
The diagram above shows the chart module hierarchy from top to bottom, where the lower layer acts as the container of the upper layer.
- `Figure` Basic shapes such as circle, polygon, rect, text, etc.
- `View` Gets data from `ChartStore` and draws one focused business part, such as candlesticks, area, grid, crosshair, indicator, etc.
- `Widget` Creates canvases and assembles related `View`s.
- `Pane` Creates DOM containers and assembles `Widget`s.
- `Chart` Manages panes (create/remove) to build the final chart, dispatches events, updates `ChartStore`, and notifies lower-level modules to refresh.

## 5-Minute Development Loop
### 1. Prepare environment
- Node.js: `>= 22.0.0`
- Package manager: `pnpm` (required by this project)

```bash
node -v
pnpm -v
```

### 2. Install dependencies
```bash
# Run in project root
pnpm install
```

### 3. Run baseline checks
```bash
pnpm run code-lint
pnpm run build
```

### 4. Choose a debugging workflow
#### Option A: Real-time debugging in your app project (recommended)
Best for continuous core development.

1. Create a Vite project (or use your own app project).
2. Alias `klinecharts` to this repo entry `src/index.ts`.

Example (`vite.config.ts`):
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

#### Option B: Debug with docs site examples
Useful when validating API demos and documentation.

> The docs site reads `dist/umd/klinecharts.min.js` on startup, so after changing `src` you should rebuild UMD first.

```bash
# After each core code change
pnpm run build-umd:prod

# Start docs site
pnpm run docs:dev
```

## Command Quick Reference
- `pnpm run code-lint`: lint source code.
- `pnpm run clean`: clean `dist`.
- `pnpm run build-esm`: build ESM bundle.
- `pnpm run build-cjs`: build CommonJS bundle.
- `pnpm run build-umd:dev`: build UMD dev bundle.
- `pnpm run build-umd:prod`: build UMD prod bundle.
- `pnpm run build-umd`: build both UMD dev/prod bundles.
- `pnpm run build-core`: build ESM + CJS + UMD.
- `pnpm run build-dts`: generate `d.ts`.
- `pnpm run build`: full build (clean + core + dts).
- `pnpm run docs:dev`: run docs site locally.
- `pnpm run docs:build`: build docs site.

## Architecture Quick Tour
### 1. Entry and lifecycle
- Entry is `src/index.ts`:
  - `init`: create chart instance and mount to container.
  - `dispose`: destroy chart instance and release resources.
  - `register*`: register extensions (indicator, overlay, axis, styles, locale, etc.).
- `Chart` in `src/Chart.ts` is the runtime orchestrator.

### 2. Data and state hub
- `src/Store.ts` is the state center:
  - data list and visible-range calculation
  - zoom/scroll state
  - styles/formatters/locale config
  - indicator/overlay instance management
- `Chart` uses `Store` to schedule updates by granularity (`UpdateLevel`).

### 3. Rendering pipeline (top to bottom)
- `Pane`: organizes chart regions (main, indicators, x-axis, etc.).
- `Widget`: owns canvas layers and interaction carriers.
- `View`: smallest rendering unit that reads `Store` and draws.
- Example candlestick rendering logic: `src/view/CandleBarView.ts`.

### 4. Interaction event pipeline
- Entry is `src/Event.ts`, unified handling for mouse/touch/keyboard.
- Interactions drive `Store` updates (scroll, zoom, crosshair, selection state).
- Then corresponding layers are re-rendered.

### 5. Extension mechanism
All extensions are registered through `register*`, grouped by module:
- Figure: `src/extension/figure`
- Indicator: `src/extension/indicator`
- Overlay: `src/extension/overlay`
- Styles: `src/extension/styles`
- i18n: `src/extension/i18n`
- Axis: `src/extension/x-axis`, `src/extension/y-axis`

## Common Modification Entry Points
- Candlestick visuals: `src/view/CandleBarView.ts`, `src/common/Styles.ts`
- Indicator logic: `src/extension/indicator`, `src/component/Indicator.ts`
- Overlay/drawing logic: `src/extension/overlay`, `src/component/Overlay.ts`
- Interaction behavior: `src/Event.ts`, `src/common/EventHandler.ts`
- Axis behavior: `src/component/XAxis.ts`, `src/component/YAxis.ts`

## Before You Submit
```bash
pnpm run code-lint
pnpm run build
```

If you changed docs as well, run:
```bash
pnpm run docs:build
```

## Troubleshooting
- Install failed due to package manager check: use `pnpm install`.
- Install failed due to Node version: switch to Node.js `>= 22.0.0`.
- Docs examples not updated: run `pnpm run build-umd:prod`, then restart `pnpm run docs:dev`.
