import { init } from 'klinecharts';

const chart = init('getIndicators-chart');
chart.createIndicator('MA', false, { id: 'candle_pane' });
chart.createIndicator('VOL');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

const indicators = chart.getIndicators({
  paneId: 'candle_pane',
  name: 'MA'
})