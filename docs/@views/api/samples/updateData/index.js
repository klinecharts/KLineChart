import { init } from 'klinecharts';

const chart = init('updateData-chart');

function update () {
  const data = {
    timestamp: 1602259200000,
    open: 11084,
    high: 11489.6,
    low: 11015.4,
    close: 11349.5,
    volume: 38345
  }
  data.close += (Math.random() - 0.5) * 20;
  data.high = Math.max(data.high, data.close);
  data.low = Math.min(data.low, data.close);
  chart.updateData(data);
  setTimeout(() => {
    update()
  }, 200)
}

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => {
    chart.applyNewData(dataList);
    update()
  });