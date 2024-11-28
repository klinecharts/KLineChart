import { init } from 'klinecharts';

const chart = init('setPrecision-chart');
chart.setPrecision({
  price: 4,
  volume: 4
});
chart.createIndicator('VOL');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
