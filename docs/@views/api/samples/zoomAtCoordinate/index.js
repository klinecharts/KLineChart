import { init } from 'klinecharts';

const chart = init('zoomAtCoordinate-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

setTimeout(() => {
  chart.zoomAtCoordinate(0.8, { x: 150, y: 150 }, 200);
}, 5000)