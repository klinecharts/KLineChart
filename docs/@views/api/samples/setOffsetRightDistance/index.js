import { init } from 'klinecharts';

const chart = init('setOffsetRightDistance-chart');
chart.setOffsetRightDistance(120);

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
