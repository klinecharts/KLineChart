# 环境要求

图表基于html5 canvas构建，需要运行在支持canvas的浏览器上，如果需要运行在移动端，请用webview加载。


## 兼容处理
如果遇到图表不能加载报错，请尝试以下方案。
### [core.js](https://github.com/zloirock/core-js)
```javascript
import 'core.js'
import { init } from 'klincharts'
```


### [Intl.js](https://github.com/andyearnshaw/Intl.js)
此方案用在无 `window.Intl` 的兼容上，目前只发现手机QQ浏览器无此api。
使用示例：
```javascript
import 'intl'
import 'intl/local-data/jsonp/en'
import { init } from 'klincharts'
```


