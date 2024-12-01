import { init } from 'klinecharts';

const chart = init('getSize-chart');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

const bounding = chart.getSize('candle_pane', 'main');