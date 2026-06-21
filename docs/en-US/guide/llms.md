# LLMs.txt

`LLMs.txt` is a plain-text context file for large language models (LLMs) and AI coding assistants. It summarizes KLineChart's project scope, core APIs, documentation entry points, workflows, and troubleshooting notes so models can answer integration, extension, and source-code questions from official facts instead of inventing removed v9 APIs.

## Main content

- Public APIs (`init`, `setDataLoader`, `createIndicator`, etc.) and the `init → setSymbol → setPeriod → setDataLoader` call order
- Data models and `setDataLoader` contracts (`getBars` / `subscribeBar` / `unsubscribeBar`)
- Indexes into official docs and source entry points (`docs/`, `src/index.ts`, `src/Chart.ts`, etc.)
- v9 → v10 migration reference
- Local build, docs server, and troubleshooting notes

## How to use

Add [LLMs.txt](https://github.com/klinecharts/KLineChart/blob/main/llms/llms_en-US.txt) to your project and prompt the AI to read it before answering questions. In AI-powered editors, you can `@`-reference the file directly.
