import { init } from 'klinecharts';

const chart = init('overrideIndicator-paneId-chart');
chart.createIndicator('MA', false, { id: 'candle_pane' });
chart.createIndicator('MA');
chart.overrideIndicator({
  name: 'MA',
  shouldOhlc: false,
  precision: 1,
  calcParams: [10, 30],
  styles: {
    lines: [
      { color: '#8fd3e8' },
      { color: '#edafda' }
    ]
  }
}, 'candle_pane');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });