import { init } from 'klinecharts';

const chart = init('scrollToRealTime-chart');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

setTimeout(() => {
  chart.scrollToRealTime(200);
}, 5000)