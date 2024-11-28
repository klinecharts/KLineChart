import { init } from 'klinecharts';

const chart = init('overrideOverlay-basic-chart');
const paneId = chart.createIndicator({
  name: 'MA',
  calcParams: [5],
  shouldOhlc: false
});

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => {
    chart.applyNewData(dataList);
    const startData = dataList[dataList.length - 50];
    const endData = dataList[dataList.length - 10];
    const id = chart.createOverlay({
      name: 'segment',
      paneId: 'candle_pane',
      points: [
        { timestamp: startData.timestamp, value: startData.high },
        { timestamp: endData.timestamp, value: endData.low }
      ]
    });
    chart.createOverlay({
      name: 'priceLine',
      paneId,
      points: [
        { timestamp: startData.timestamp, value: startData.high },
        { timestamp: endData.timestamp, value: endData.low }
      ]
    });

    chart.overrideOverlay({
      id,
      styles: {
        line: { color: '#D0648A' }
      }
    });
  });