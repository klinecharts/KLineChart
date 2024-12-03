import { init } from 'klinecharts';

const chart = init('setPaneOptions-axis-extension-chart');
chart.createIndicator('MACD');

chart.setPaneOptions({
  id: 'candle_pane',
  axis: {
    createTicks: ({ defaultTicks }) => {
      return defaultTicks.map(
        ({ coord, value, text }) => ({ coord, value, text: `$${text}` })
      )
    }
  }
});

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => {
    chart.applyNewData(dataList);
  });