import { init } from 'klinecharts';

const chart = init('createIndicator-paneOptions-chart');
chart.createIndicator('VOL', false, { height: 200 });

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });