# Local Development

## Introduction
If you see this, you may be interested in improving the KLineChart core. Thank you [@fish2016](https://github.com/fish2016) This document was written.

## Notice
### File directory description
<script setup>
import ProjectDirExplain from '../../components/ProjectDirExplain.vue'
import ProjectModuleExplain from '../../components/ProjectModuleExplain.vue'
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
The project adopts a dependency [Node.js](https://nodejs.org) The package manager for management requires [Node.js](https://nodejs.org) environment.
You can use npm, pnpm, or yarn to install dependencies.
```bash
# Root dir run
npm install
```

### NPM Execute command description

- `lint`: Run `npm run lint` verify code rules.
- `clean`: Run `npm run clean` clean up the built files.
- `build-esm`: Run `npm run build-esm` built esm module.
- `build-cjs`: Run `npm run build-cjs` built commonjs module.
- `build-umd:dev`: Run `npm run build-umd:dev` built umd development module.
- `build-umd:prod`: Run `npm run build-umd:dev` built umd production module.
- `build-umd`: Run `npm run build-umd` built umd development and production module。
- `build-core`: Run `npm run build-core` built esm, commonjs umd development and umd production module.
- `build-dts`: Run `npm run build-dts` generate typescript dependency files.
- `build`: Run `npm run build` built esm, commonjs umd development and umd production module and generate typescript dependency files.

### Debug
This project does not have a debugging project and requires the creation of a new project, use `npm link` import，or import `index.ts` debug. You can use [vite](https://vitejs.dev/) create a project.

