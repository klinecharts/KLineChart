# 本地开发

## 摘要
如果你看到此处，你可能会对改进 KLineChart 核心感兴趣。感谢 [@fish2016](https://github.com/fish2016) 编写的此文档。

## 须知
### 文件目录说明
<script setup>
import ProjectDirExplain from '../components/ProjectDirExplain.vue'
import ProjectModuleExplain from '../components/ProjectModuleExplain.vue'
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


## 开发
### 安装依赖
项目采用依赖 [Node.js](https://nodejs.org) 的包管理器管理，所以需要 [Node.js](https://nodejs.org) 环境。
你可以使用 npm，pnpm 或者 yarn 来安装依赖。
```bash
# 项目根目录下执行
npm install
```

### NPM 执行命令说明

- `lint`：运行 `npm run lint` 检验代码规则。
- `clean`：运行 `npm run clean` 进行清理打包好的文件。
- `build-esm`：运行 `npm run build-esm` 打包成 esm 模块。
- `build-cjs`：运行 `npm run build-cjs` 打包成 commonjs 模块。
- `build-umd:dev`：运行 `npm run build-umd:dev` 打包成 umd 开发环境模块。
- `build-umd:prod`：运行 `npm run build-umd:dev` 打包成 umd 生产环境模块。
- `build-umd`：运行 `npm run build-umd` 同时打包 umd 开发环境和生产环境模块。
- `build-core`：运行 `npm run build-core` 同时打包 esm 模块，commonjs 模块，umd 开发环境和生产环境模块。
- `build-dts`：运行 `npm run build-dts` 生成 typescript 依赖文件。
- `build`：运行 `npm run build` 同时打包 esm 模块，commonjs 模块，umd 开发环境和生产环境模块并生成 typescript 依赖文件。

### 调试
此项目没有调试项目，需要创建新的工程，用 `npm link` 引入，或者直接引入 `index.ts` 入口文件的方式进行调试。你可以使用 [vite](https://cn.vitejs.dev/) 进行项目创建。

