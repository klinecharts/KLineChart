import { init } from 'klinecharts';

const chart = init('setPaneOptions-axis-chart');
chart.createIndicator('MACD');

chart.setPaneOptions({
  id: 'candle_pane',
  axis: {
    name: 'logarithm',
    reverse: true
  }
});

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => {
    chart.applyNewData(dataList);
  });