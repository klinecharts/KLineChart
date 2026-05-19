# 👨‍💻 本地开发

这篇文档面向想参与 KLineChart 开发、调试源码或理解内部实现的同学。你可以先按“快速开始”跑起来，再根据要改的模块查看后面的架构与入口说明。

## 项目概览

<script setup>
import ProjectDirExplain from '../@views/local-development/ProjectDirExplain.vue'
import ProjectModuleExplain from '../@views/local-development/ProjectModuleExplain.vue'
</script>

### 目录说明

<ProjectDirExplain/>

### 模块关系

<ProjectModuleExplain/>

上图按模块层级展示图表内部结构，下层负责承载和组织上层。

- `Figure`：基础图形，如圆、弧线、多边形、矩形、文本等。
- `View`：最小业务绘制单元，从 `Store` 读取数据并绘制 K 线、面积图、网格线、十字光标、指标等。
- `Widget`：创建和管理 canvas，将相关 `View` 组合在一起。
- `Pane`：创建 DOM 容器，将 `Widget` 组合成主图、指标区、坐标轴等区域。
- `Chart`：管理 `Pane`，处理事件分发，更新 `Store`，并按需通知下层模块刷新。

## 快速开始

### 1. 准备环境

- Node.js：`>= 22.0.0`，可直接使用仓库中的 `.nvmrc`。
- 包管理器：`pnpm`，项目安装阶段会校验，不能使用 npm 或 yarn 安装依赖。

```bash
nvm use
corepack enable
pnpm -v
```

### 2. 安装依赖

在项目根目录执行：

```bash
pnpm install
```

### 3. 跑一次基础检查

```bash
pnpm run code-lint
pnpm run type-check
pnpm run build
```

## 本地调试

### 方式一：使用仓库内置调试页

适合快速验证源码改动。调试页位于 `debug` 目录，入口直接引用 `src/index.ts`，因此不需要先构建 `dist`。

```bash
pnpm run debug
```

启动后按终端提示打开本地地址。你可以在 `debug/main.js` 中修改初始化参数、数据加载方式或交互示例。

### 方式二：在业务工程中联调

适合持续开发核心功能，或在真实业务场景里验证兼容性。推荐在 Vite 工程中把 `klinecharts` 映射到本仓库源码入口：

```ts
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      klinecharts: resolve('/你的本地路径/KLineChart/src/index.ts')
    }
  }
})
```

这样业务工程里的 `import { init } from 'klinecharts'` 会直接使用本地源码。

### 方式三：使用文档站调试示例

适合验证 API 示例、文档内容和站点展示。

文档站启动时会读取 `dist/umd/klinecharts.min.js` 注入页面，所以第一次启动文档站或修改 `src` 后，需要先构建 UMD 生产包：

```bash
pnpm run build-umd:prod
pnpm run docs:dev
```

文档站默认端口是 `8888`。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm run debug` | 启动仓库内置调试页，直接使用 `src` 源码 |
| `pnpm run code-lint` | 使用 ESLint 检查 `src/**/*.ts` |
| `pnpm run type-check` | 执行 TypeScript 类型检查 |
| `pnpm run clean` | 清理 `dist` |
| `pnpm run build-esm` | 构建 ESM 产物 |
| `pnpm run build-cjs` | 构建 CommonJS 产物 |
| `pnpm run build-umd:dev` | 构建 UMD 开发版 |
| `pnpm run build-umd:prod` | 构建 UMD 生产版 |
| `pnpm run build-umd` | 构建 UMD 开发版和生产版 |
| `pnpm run build-core` | 构建 ESM、CommonJS 和 UMD |
| `pnpm run build-dts` | 生成 `dist/index.d.ts` |
| `pnpm run build` | 完整构建：清理、构建核心产物、生成类型声明 |
| `pnpm run docs:dev` | 启动文档站 |
| `pnpm run docs:build` | 构建文档站，会先构建 UMD 生产包 |
| `pnpm run docs:preview` | 预览已构建的文档站 |

## 架构速读

### 入口与生命周期

- 对外入口在 `src/index.ts`。
- `init` 负责创建图表实例并挂载到容器。
- `dispose` 负责销毁图表实例并释放资源。
- `registerFigure`、`registerIndicator`、`registerOverlay`、`registerXAxis`、`registerYAxis`、`registerStyles`、`registerLocale` 负责注册扩展能力。
- `src/Chart.ts` 是运行时调度核心，负责组织窗格、事件、更新和实例 API。

### 数据与状态

- `src/Store.ts` 是状态中心，维护数据列表、可见范围、缩放滚动状态、样式、格式化、本地化、指标和覆盖物实例。
- 交互或 API 调用通常先改变 `Store`，再通过 `UpdateLevel` 控制刷新粒度。
- 数据接入相关类型在 `src/common/Data.ts`、`src/common/DataLoader.ts` 和 `src/Options.ts`。

### 渲染链路

- `Pane`：组织图表区域，如主图、指标区、x 轴区。
- `Widget`：管理 canvas 层和交互承载区域。
- `View`：读取 `Store` 和组件状态，完成具体绘制。
- K 线柱绘制可从 `src/view/CandleBarView.ts` 开始看，指标绘制可从 `src/view/IndicatorView.ts` 开始看。

### 事件链路

- `src/Event.ts` 统一处理鼠标、触摸、滚轮、键盘等事件。
- `src/common/EventHandler.ts` 封装底层事件监听与手势识别。
- 事件会驱动滚动、缩放、十字光标、覆盖物选中和拖拽等状态变化，然后触发对应区域重绘。

### 扩展机制

扩展能力集中在 `src/extension`：

- `figure`：基础图形模板。
- `indicator`：技术指标模板。
- `overlay`：画线和覆盖物模板。
- `styles`：样式扩展。
- `i18n`：多语言配置。
- `x-axis`、`y-axis`：坐标轴扩展。

## 常见改动入口

| 目标 | 主要入口 |
| --- | --- |
| 修改初始化、销毁、注册等对外 API | `src/index.ts`、`src/Chart.ts` |
| 修改数据加载或可见范围逻辑 | `src/Store.ts`、`src/common/DataLoader.ts`、`src/common/VisibleRange.ts` |
| 修改 K 线视觉 | `src/view/CandleBarView.ts`、`src/view/CandleAreaView.ts`、`src/common/Styles.ts` |
| 修改指标逻辑 | `src/extension/indicator`、`src/component/Indicator.ts`、`src/view/IndicatorView.ts` |
| 修改画线或覆盖物 | `src/extension/overlay`、`src/component/Overlay.ts`、`src/view/OverlayView.ts` |
| 修改交互行为 | `src/Event.ts`、`src/common/EventHandler.ts` |
| 修改坐标轴 | `src/component/XAxis.ts`、`src/component/YAxis.ts`、`src/view/XAxisView.ts`、`src/view/YAxisView.ts` |
| 修改样式默认值 | `src/common/Styles.ts`、`src/extension/styles` |
| 修改文档站 | `docs`、`docs/.vitepress`、`docs/@views` |
| 修改构建流程 | `scripts/build`、`package.json` |

## 提交前检查

普通源码改动建议执行：

```bash
pnpm run code-lint
pnpm run type-check
pnpm run build
```

如果同时修改了文档，建议再执行：

```bash
pnpm run docs:build
```

## 常见问题

- 安装失败并提示包管理器不正确：请使用 `pnpm install`。
- 安装失败并提示 Node.js 版本不符合要求：请切换到 Node.js `>= 22.0.0`，或执行 `nvm use`。
- `pnpm run docs:dev` 启动失败并提示找不到 `dist/umd/klinecharts.min.js`：先执行 `pnpm run build-umd:prod`。
- 修改源码后文档站示例没有更新：重新执行 `pnpm run build-umd:prod`，再重启 `pnpm run docs:dev`。
- 只想验证源码改动但不想构建：优先使用 `pnpm run debug`，它会直接加载 `src/index.ts`。
