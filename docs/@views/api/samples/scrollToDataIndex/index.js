import { init } from 'klinecharts';

const chart = init('scrollToDataIndex-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

setTimeout(() => {
  chart.scrollToDataIndex(chart.getDataList().length - 100, 200);
}, 5000)