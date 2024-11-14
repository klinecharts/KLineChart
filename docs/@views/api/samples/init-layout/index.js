import { init } from 'klinecharts';

const chart = init('init-layout-chart', {
  layout: [
    {
      type: 'candle',
      content: ['MA', { name: 'EMA', calcParams: [10, 30] }],
      options: { order: Number.MIN_SAFE_INTEGER }
    },
    { type: 'indicator', content: ['VOL'], options: { order: 10 }  },
    { type: 'xAxis', options: { order: 9 } }
  ]
})

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
