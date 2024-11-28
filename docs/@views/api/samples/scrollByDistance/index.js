import { init } from 'klinecharts';

const chart = init('scrollByDistance-chart');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

setTimeout(() => {
  chart.scrollByDistance(200, 200);
}, 5000)