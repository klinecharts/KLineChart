import { init } from 'klinecharts';

const chart = init('setRightMinVisibleBarCount-chart');
chart.setRightMinVisibleBarCount(6);

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
