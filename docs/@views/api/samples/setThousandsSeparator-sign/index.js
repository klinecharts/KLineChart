import { init } from 'klinecharts';

const chart = init('setThousandsSeparator-sign-chart',)

chart.setThousandsSeparator({ sign: '' })

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
