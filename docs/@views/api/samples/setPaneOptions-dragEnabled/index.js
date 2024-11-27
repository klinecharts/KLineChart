import { init } from 'klinecharts';

const chart = init('setPaneOptions-dragEnabled-chart');
const paneId = chart.createIndicator('MACD');

chart.setPaneOptions({
  id: paneId,
  dragEnabled: false
})

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });