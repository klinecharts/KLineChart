import { init, dispose } from 'klinecharts';

const chart = init('dispose-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => {
    chart.applyNewData(dataList);
  });

dispose('dispose-chart');
