import { init } from 'klinecharts';

const chart = init('subscribeAction-chart');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => {
    chart.applyNewData(dataList);
  });

chart.subscribeAction(
  'onCrosshairChange',
  (data) => {}
);