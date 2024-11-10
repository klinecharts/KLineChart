import { init, registerLocale } from 'klinecharts';

registerLocale('ru-RU', {
  time: 'Время: ',
  open: 'Открой.: ',
  high: 'Высокий: ',
  low: 'Низкий: ',
  close: 'Б: ',
  volume: 'Объем: '
})

const chart = init(
  'init-options-locale-extension-chart',
  { locale: 'ru-RU' }
)

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
