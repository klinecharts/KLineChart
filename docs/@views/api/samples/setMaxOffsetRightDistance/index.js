import { init } from 'klinecharts';

const chart = init('setMaxOffsetRightDistance-chart');
chart.setMaxOffsetRightDistance(160);

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
