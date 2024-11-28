import { init } from 'klinecharts';

const chart = init('setMaxOffsetLeftDistance-chart');
chart.setMaxOffsetLeftDistance(160);

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
