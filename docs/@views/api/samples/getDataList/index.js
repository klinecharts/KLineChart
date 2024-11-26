import { init } from 'klinecharts';

const chart = init('getDataList-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

const dataList = chart.getDataList()