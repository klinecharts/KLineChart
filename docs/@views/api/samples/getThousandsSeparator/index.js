import { init } from 'klinecharts';

const chart = init('getThousandsSeparator-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

const thousandsSeparator = chart.getThousandsSeparator();
