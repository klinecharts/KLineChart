import { init } from 'klinecharts';

const chart = init(
  'init-options-decimalfold-chart',
  { decimalFold: { type: 'subscript' } }
)

chart.setPrecision({ price: 10 })

fetch('/datas/kline2.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
