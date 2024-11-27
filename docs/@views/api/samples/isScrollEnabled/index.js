import { init } from 'klinecharts';

const chart = init('isScrollEnabled-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

const enabled = chart.isScrollEnabled();
