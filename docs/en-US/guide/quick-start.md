# 🚀 Quick start

## Get KLineChart
KLineChart supports multiple download methods, you can get it through package management tools such as `npm` or `yarn`, or through `CDN`.

### Using npm
```bash
npm install klinecharts --save
```
### use yarn
```bash
yarn add klinecharts
```

### Using a CDN
You can use `jsDelivr`, `unpkg` or others, it is recommended to quote from `jsDelivr`.
```bash
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/klinecharts/dist/klinecharts.min.js"></script>
```

## Create the first chart
### Created in the project of package management tools such as `npm` or `yarn`

```javascript
import { init } from 'klinecharts'

// initialize the chart
const chart = init(`${domId}`)

// add data to the chart
chart.applyNewData([
   { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
   { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194 },
   { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197 },
   { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28 },
   { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
   { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
   { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
   { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
   { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
   { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1587660540000, volume: 76 }
])
```

### Created in the normal project
```html
<!DOCTYPE html>
<html lang="en">
   <head>
     <meta charset="utf-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1" />
     <meta name="theme-color" content="#000000" />
     <meta name="keywords" content="Quick Start"/>
     <meta name="description" content="Quick Start"/>
     <title>Quick Start</title>
   </head>
   <body>
     <div id="chart" style="width:600px;height:600px"></div>
     <script>
       window.onload = function () {
         // initialize the chart
         var chart = klinecharts.init('chart')

         // add data to the chart
         chart.applyNewData([
           { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
           { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194 },
           { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197 },
           { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28 },
           { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
           { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
           { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
           { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
           { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
           { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1587660540000, volume: 76 }
         ])
       }
     </script>
   </body>
</html>
```

This completes your first chart creation.