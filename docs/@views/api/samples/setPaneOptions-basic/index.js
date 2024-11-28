import { init } from 'klinecharts';

const chart = init('setPaneOptions-basic-chart');
const paneId = chart.createIndicator('VOL');

chart.setPaneOptions({
  id: paneId,
  height: 160
})

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });