# LLMs.txt

`LLMs.txt` 是面向大语言模型（LLM）和 AI 编码助手的上下文文件，以纯文本汇总 KLineChart 的项目定位、核心 API、文档入口、工作流与排错要点，帮助模型在回答集成、扩展和源码相关问题时尽量基于官方事实，而不是编造已废弃的 v9 接口。

## 主要内容
- 对外核心 API（`init`、`setDataLoader`、`createIndicator` 等）及 `init → setSymbol → setPeriod → setDataLoader` 调用顺序
- 数据模型与 `setDataLoader` 约定（`getBars` / `subscribeBar` / `unsubscribeBar`）
- 官方文档与源码入口索引（`docs/`、`src/index.ts`、`src/Chart.ts` 等）
- v9 → v10 迁移对照
- 本地构建、文档服务与常见问题排错

## 如何使用
将 [LLMs.txt](https://github.com/klinecharts/KLineChart/blob/main/llms/llms.txt) 放入需要使用的项目中，提示词提示 AI 先读取该文件再处理问题，如果是在 AI 编辑器中可直接使用 `@` 引用该文件。
