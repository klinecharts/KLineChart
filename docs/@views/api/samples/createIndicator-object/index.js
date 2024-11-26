import { init } from 'klinecharts';

const chart = init('createIndicator-object-chart');
chart.createIndicator({
  name: 'MA',
  shouldOhlc: false,
  precision: 1,
  calcParams: [10, 30],
  styles: {
    lines: [{ color: '#8fd3e8' }, { color: '#edafda' }]
  }
});

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });