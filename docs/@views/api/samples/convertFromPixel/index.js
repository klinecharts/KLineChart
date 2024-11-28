import { init } from 'klinecharts';

const chart = init('convertFromPixel-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => {
    chart.applyNewData(dataList);
    const points = chart.convertFromPixel(
      [{ x: 200, y: 200 }],
      { paneId: 'candle_pane', absolute: false }
    );
  });