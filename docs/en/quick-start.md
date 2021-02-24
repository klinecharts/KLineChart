# Quick start

## Installation
### Use npm
```bash
npm install klinecharts --save
```
### Use yarn
```bash
yarn add klinecharts
```


## Introduction
```javascript
// Full introduction, including all built-in technical indicators and drawing marks
import { init } from 'klinecharts'

// Introduce some functions, excluding built-in drawing markers
import { init } from 'klinecharts/index.blank'

// Introduce basic functions, excluding built-in technical indicators and drawing marks
import { init } from 'klinecharts/index.simple'

// Use one of the above three methods as needed
```


## Create the first chart
```javascript
import { init } from 'klinecharts'

// Initialize the chart
const chart = init(`${domId}`)

// add data to the chart
chart.applyNewData([
  {close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
  {close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194 },
  {close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197 },
  {close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28 },
  {close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
  {close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
  {close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
  {close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
  {close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
  {close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1587660540000, volume: 76}
])

```
