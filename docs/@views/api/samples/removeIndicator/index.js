import { init } from 'klinecharts';

const chart = init('removeIndicator-chart');
chart.createIndicator('MA', false, { id: 'candle_pane' });
chart.createIndicator('VOL');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

setTimeout(() => {
  chart.removeIndicator({ name: 'MA' });
}, 5000)