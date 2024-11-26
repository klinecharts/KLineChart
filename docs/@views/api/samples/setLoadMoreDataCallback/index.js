import { init } from 'klinecharts';

const chart = init('setLoadMoreDataCallback-chart');
chart.setLoadMoreDataCallback(({ type, data, callback }) => {
  if (type === 'forward') {
    console.log(type)
    fetch('/datas/kline.json')
      .then(res => res.json())
      .then(dataList => {
        callback(dataList.slice(0, 300));
      });
  } else {
    fetch('/datas/kline.json')
      .then(res => res.json())
      .then(dataList => {
        callback(dataList.slice(600));
      });
  }
});

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => {
    chart.applyNewData(dataList.slice(300, 600), true);
  });
