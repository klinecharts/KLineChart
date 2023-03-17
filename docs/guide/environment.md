# 🏝️ 环境要求

## 浏览器支持

图表基于 html5 canvas 构建，需要运行在支持 canvas 的浏览器上，如果需要运行在移动端，请用 webview 加载。

## 兼容处理

### [core.js](https://github.com/zloirock/core-js)

图表内部集合使用`Map`，用于兼容不支持的老版浏览器。

```javascript
import 'core.js';
import { init } from 'klincharts';
```

### [Intl.js](https://github.com/andyearnshaw/Intl.js)

图表依赖`Intl`，某些浏览器无此 API。

```javascript
import 'intl';
import 'intl/local-data/jsonp/en';
import { init } from 'klincharts';
```

