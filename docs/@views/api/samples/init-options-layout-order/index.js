import { init } from 'klinecharts';

const chart = init('init-options-layout-order-chart', {
  layout: [
    { type: 'candle', options: { order: Number.MIN_SAFE_INTEGER }},
    { type: 'indicator', content: ['VOL'], options: { order: 10 } },
    { type: 'xAxis', options: { order: 9 } },
  ]
})

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
