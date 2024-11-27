import { init } from 'klinecharts';

const chart = init('setPaneOptions-state-chart');
chart.createIndicator('MACD');

chart.setPaneOptions({
  id: 'candle_pane',
  state: 'minimize'
})

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });