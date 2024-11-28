import { init } from 'klinecharts';

const chart = init('executeAction-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => {
    chart.applyNewData(dataList);
    chart.executeAction(
      'onCrosshairChange',
      { x: 200, y: 200, paneId: 'candle_pane' }
    );
  });