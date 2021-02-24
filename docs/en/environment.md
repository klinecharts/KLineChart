# Environment
The chart is built on html5 canvas and needs to run on a browser that supports canvas. If you need to run on a mobile terminal, please load it with webview.


## Compatible processing
If you encounter an error that the chart cannot be loaded, please try the following solutions.
### [core.js](https://github.com/zloirock/core-js)
```javascript
import 'core.js'
import { init } from 'klincharts'
```


### [Intl.js](https://github.com/andyearnshaw/Intl.js)
This solution is used for compatibility without `window.Intl`, and currently only the mobile QQ browser has no such api.
Use example:
```javascript
import 'intl'
import 'intl/local-data/jsonp/en'
import { init } from 'klincharts'
```
