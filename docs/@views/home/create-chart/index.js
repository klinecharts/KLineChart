import { init } from 'klinecharts';

const chart = init('k-line-chart');

chart.createIndicator(
  'MA',
  false,
  { id: 'candle_pane' }
);
chart.createIndicator('VOL');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
