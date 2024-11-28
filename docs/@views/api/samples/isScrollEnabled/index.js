import { init } from 'klinecharts';

const chart = init('isScrollEnabled-chart');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

const enabled = chart.isScrollEnabled();
