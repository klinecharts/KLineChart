import { init } from 'klinecharts';

const chart = init('setPrecision-chart');
chart.setPrecision({
  price: 4,
  volume: 4
});
chart.createIndicator('VOL');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
