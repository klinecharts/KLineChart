import { init } from 'klinecharts';

const chart = init('createIndicator-paneOptions-basic-chart');
chart.createIndicator('VOL', false, { height: 200, dragEnabled: false });

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });