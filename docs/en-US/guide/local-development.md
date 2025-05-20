# Local Development

## Introduction
If you see this, you may be interested in improving the KLineChart core. Thank you [@fish2016](https://github.com/fish2016) This document was written.

## Notice
### File directory description
<script setup>
import ProjectDirExplain from '../../@views/local-development/ProjectDirExplain.vue'
import ProjectModuleExplain from '../../@views/local-development/ProjectModuleExplain.vue'
</script>
<ProjectDirExplain/>

### Module dependencies
<ProjectModuleExplain/>
The above diagram shows the hierarchy of chart modules from top to bottom, with the lower layer serving as the upper layer container.
- `Figure` Basic shapes, such as circle, polygon, rect, text, etc.
- `View` Retrieve data from `ChartStore` and perform single business plotting, such as candlesticks, area, grid line, crosshair, indicator, etc
- `Widget` Create canvas and assemble the relevant `View` together.
- `Pane` Create dom container and assemble the `Widget` together.
- `Chart` Manage the Panes, such as deleting and adding operations, to form the final chart. In addition, event distribution is also carried out to manipulate the data in `ChartStore` and notify subordinate components to update as needed.


## Development
### Installation dependencies
Project mandatory use of [pnpm]（https://pnpm.io）As a package manager, it is necessary to use pnpm to install dependencies.
```bash
# Root dir run
pnpm install
```

### Execute command description

- `code-lint`: Run `pnpm run code-lint` verify code rules.
- `clean`: Run `pnpm run clean` clean up the built files.
- `build-esm`: Run `pnpm run build-esm` built esm module.
- `build-cjs`: Run `pnpm run build-cjs` built commonjs module.
- `build-umd:dev`: Run `pnpm run build-umd:dev` built umd development module.
- `build-umd:prod`: Run `pnpm run build-umd:dev` built umd production module.
- `build-umd`: Run `pnpm run build-umd` built umd development and production module。
- `build-core`: Run `pnpm run build-core` built esm, commonjs umd development and umd production module.
- `build-dts`: Run `pnpm run build-dts` generate typescript dependency files.
- `build`: Run `pnpm run build` built esm, commonjs umd development and umd production module and generate typescript dependency files.

### Debug
This project does not have a debugging project and requires the creation of a new project, use `npm link` import，or import `index.ts` debug. You can use [vite](https://vitejs.dev/) create a project.

