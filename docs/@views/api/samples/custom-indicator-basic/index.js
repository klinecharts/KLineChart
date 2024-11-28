import { init, registerIndicator } from 'klinecharts';

registerIndicator({
  name: 'customIndicatorBasic',
  shortName: 'Basic',
  series: 'price',
  figures: [{
    key: 'close',
    title: 'close: ',
    type: 'line'
  }],
  calc: dataList => dataList.map(data => ({ close: data.close }))
});

const chart = init('custom-indicator-basic-chart');

chart.createIndicator('customIndicatorBasic');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
