import { init } from 'klinecharts';

const chart = init('setPaneOptions-axis-basic-chart');
chart.createIndicator('MACD');

chart.setPaneOptions({
  id: 'candle_pane',
  axis: {
    name: 'logarithm',
    reverse: true
  }
});

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => {
    chart.applyNewData(dataList);
  });