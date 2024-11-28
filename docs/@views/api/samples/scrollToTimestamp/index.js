import { init } from 'klinecharts';

const chart = init('scrollToTimestamp-chart');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

setTimeout(() => {
  const dataList = chart.getDataList()
  chart.scrollToTimestamp(dataList[dataList.length - 100].timestamp, 200);
}, 5000)