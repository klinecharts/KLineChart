import { init } from 'klinecharts';

const chart = init('convertToPixel-chart');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => {
    chart.applyNewData(dataList);
    const data = dataList[dataList.length - 20];
    const coordinates = chart.convertToPixel(
      [{ timestamp: data.timestamp, value: data.high }],
      { paneId: 'candle_pane', absolute: false }
    );
  });