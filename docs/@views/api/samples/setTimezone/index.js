import { init } from 'klinecharts';

const chart = init('setTimezone-chart');

chart.setTimezone('Europe/Berlin');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
