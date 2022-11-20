# 🏝️ Environment

## Browser support

The chart is built based on html5 canvas and needs to run on a browser that supports canvas. If it needs to run on the mobile terminal, please use webview to load it.

## Polyfill

### [core.js](https://github.com/zloirock/core-js)

The internal collection of the chart uses `Map` for compatibility with unsupported older browsers.

```js
import 'core.js';
import { init } from 'klincharts';
```

### [Intl.js](https://github.com/andyearnshaw/Intl.js)

Charts rely on `Intl`, some browsers do not have this API.

```js
import 'intl';
import 'intl/local-data/jsonp/en';
import { init } from 'klincharts';
