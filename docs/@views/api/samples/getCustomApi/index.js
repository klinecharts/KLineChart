import { init } from 'klinecharts';

const chart = init('getCustomApi-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

const customApi = chart.getCustomApi()