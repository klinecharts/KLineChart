import { init } from 'klinecharts';

const chart = init('zoomAtTimestamp-chart');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

setTimeout(() => {
  const dataList = chart.getDataList();
  chart.zoomAtTimestamp(
    0.8,
    dataList[dataList.length - 50].timestamp,
    200
  );
}, 5000)