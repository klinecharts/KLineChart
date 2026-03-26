# 👨‍💻 本地开发

## 摘要
如果你想自己改功能，或者想快速搞懂 KLineChart 的内部实现，这篇文档会给你一条最短路径。

你将获得两类信息：
- 开发闭环：如何在本地快速改、看、验、提。
- 原理主线：一次看懂 `init -> Chart -> Store -> Pane/Widget/View` 的职责分工。

## 须知
### 文件目录说明
<script setup>
import ProjectDirExplain from '../@views/local-development/ProjectDirExplain.vue'
import ProjectModuleExplain from '../@views/local-development/ProjectModuleExplain.vue'
</script>
<ProjectDirExplain/>

### 模块依赖关系
<ProjectModuleExplain/>
上图是按照下层作为上层的容器，从上到下列出图表模块层级。
- `Figure` 基本图形，如圆(circle)，多边形(polygon)，矩形(rect)，文本(text)等。
- `View` 从 `ChartStore` 中获取数据，进行单一业务绘制，如k线柱，面积图，网格线，十字光标线，指标等等。
- `Widget` 创建canvas，将相关的 `View` 进行组装到一起。
- `Pane` 创建dom容器，将`Widget`组装到一起。
- `Chart` 对Pane进行管理，例如删除和添加操作，形成最终的图表。此外，还进行事件分发，对`ChartStore`里面的数据进行操作，根据需要通知下级组件进行更新。

## 5 分钟开发闭环
### 1. 准备环境
- Node.js：`>= 22.0.0`
- 包管理器：`pnpm`（项目强制）

```bash
node -v
pnpm -v
```

### 2. 安装依赖
```bash
# 项目根目录
pnpm install
```

### 3. 先跑一遍基础检查
```bash
pnpm run code-lint
pnpm run build
```

### 4. 选择调试方式
#### 方式 A：在业务工程里实时调试（推荐）
适合持续开发核心功能，改完源码可立即看到效果。

1. 创建一个 Vite 工程（或你自己的业务工程）。
2. 在工程里把 `klinecharts` 映射到本仓库源码入口 `src/index.ts`。

示例（`vite.config.ts`）：
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

#### 方式 B：结合文档站调试示例
适合验证 API 示例和文档内容。

> 文档站在启动时会读取 `dist/umd/klinecharts.min.js`，所以你修改 `src` 后需要先重新构建 UMD。

```bash
# 每次核心代码改动后
pnpm run build-umd:prod

# 启动文档站
pnpm run docs:dev
```

## 命令速查
- `pnpm run code-lint`：代码规范检查。
- `pnpm run clean`：清理 `dist`。
- `pnpm run build-esm`：构建 ESM。
- `pnpm run build-cjs`：构建 CommonJS。
- `pnpm run build-umd:dev`：构建 UMD 开发版。
- `pnpm run build-umd:prod`：构建 UMD 生产版。
- `pnpm run build-umd`：同时构建 UMD 开发/生产版。
- `pnpm run build-core`：构建 ESM + CJS + UMD。
- `pnpm run build-dts`：生成 `d.ts`。
- `pnpm run build`：完整构建（clean + core + dts）。
- `pnpm run docs:dev`：启动文档站。
- `pnpm run docs:build`：构建文档站。

## 原理速通
### 1. 入口与实例生命周期
- 入口在 `src/index.ts`：
  - `init`：创建图表实例并挂载到容器。
  - `dispose`：销毁图表实例并释放关联资源。
  - `register*`：注册扩展（指标、覆盖物、坐标轴、样式、语言等）。
- `Chart` 实例由 `src/Chart.ts` 管理，是运行时核心调度器。

### 2. 数据与状态中枢
- `src/Store.ts` 是状态中心，负责：
  - 数据列表与可见区间计算。
  - 缩放/滚动状态。
  - 样式、格式化、本地化配置。
  - 指标与覆盖物实例管理。
- `Chart` 通过 `Store` 决定何时、以什么粒度更新视图（`UpdateLevel`）。

### 3. 渲染链路（从上到下）
- `Pane`：组织图表区域（主图、指标区、x 轴等）。
- `Widget`：管理 canvas 与交互承载区域。
- `View`：最小绘制单元，读取 `Store` 数据并绘图。
- 例如 K 线主柱绘制逻辑在 `src/view/CandleBarView.ts`。

### 4. 交互事件链路
- 入口在 `src/Event.ts`，统一处理鼠标/触摸/键盘交互。
- 交互行为会驱动 `Store` 更新（滚动、缩放、十字光标、选中态）。
- 之后触发对应层级重绘。

### 5. 扩展机制
扩展都通过 `register*` 注册，内部按模块分层：
- 图形：`src/extension/figure`
- 指标：`src/extension/indicator`
- 覆盖物：`src/extension/overlay`
- 样式：`src/extension/styles`
- 国际化：`src/extension/i18n`
- 坐标轴：`src/extension/x-axis`、`src/extension/y-axis`

## 常见改动入口
- 改 K 线视觉：`src/view/CandleBarView.ts`、`src/common/Styles.ts`
- 改指标逻辑：`src/extension/indicator`、`src/component/Indicator.ts`
- 改画线/覆盖物：`src/extension/overlay`、`src/component/Overlay.ts`
- 改交互行为：`src/Event.ts`、`src/common/EventHandler.ts`
- 改坐标轴：`src/component/XAxis.ts`、`src/component/YAxis.ts`

## 提交前建议
```bash
pnpm run code-lint
pnpm run build
```

如果你同时改了文档，建议再执行：
```bash
pnpm run docs:build
```

## 常见问题排查
- 安装失败并提示包管理器错误：请确认使用的是 `pnpm install`。
- 安装时报 Node 版本不符：请切换到 Node.js `>= 22.0.0`。
- 文档站示例没更新：先执行 `pnpm run build-umd:prod`，再重启 `pnpm run docs:dev`。
