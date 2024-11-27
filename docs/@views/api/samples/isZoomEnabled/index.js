import { init } from 'klinecharts';

const chart = init('isZoomEnabled-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

const enabled = chart.isZoomEnabled();
