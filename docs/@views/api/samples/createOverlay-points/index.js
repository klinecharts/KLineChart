import { init } from 'klinecharts';

const chart = init('createOverlay-points-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => {
    chart.applyNewData(dataList);
    const startData = dataList[dataList.length - 50];
    const endData = dataList[dataList.length - 10];
    chart.createOverlay({
      name: 'segment',
      paneId: 'candle_pane',
      points: [
        { timestamp: startData.timestamp, value: startData.high },
        { timestamp: endData.timestamp, value: endData.low }
      ]
    });
  });