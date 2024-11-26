import { init, registerLocale } from 'klinecharts';

registerLocale('ru-RU', {
  time: 'Время: ',
  open: 'Открой.: ',
  high: 'Высокий: ',
  low: 'Низкий: ',
  close: 'Б: ',
  volume: 'Объем: '
})

const chart = init('setLocale-extension-chart');
chart.setLocale('ru-RU');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
