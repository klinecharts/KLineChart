import { init } from 'klinecharts';

const chart = init('zoomAtDataIndex-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

setTimeout(() => {
  chart.zoomAtDataIndex(0.8, chart.getDataList().length - 50, 200);
}, 5000)