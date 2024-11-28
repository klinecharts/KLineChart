import { init } from 'klinecharts';

const chart = init('getConvertPictureUrl-chart');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

const url = chart.getConvertPictureUrl(true, 'png', '#FFFFFF');
