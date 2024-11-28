import { init } from 'klinecharts';

const chart = init('setThousandsSeparator-sign-chart',)

chart.setThousandsSeparator({ sign: '' })

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
