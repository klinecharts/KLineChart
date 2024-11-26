import { init } from 'klinecharts';

const chart = init('getTimezone-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

const timezone = chart.getTimezone();
