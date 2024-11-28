import { init, registerIndicator } from 'klinecharts';

registerIndicator({
  name: 'customIndicatorTooltip',
  shortName: 'Tooltip',
  series: 'price',
  figures: [{
    key: 'close',
    title: 'close: ',
    type: 'line'
  }],
  calc: dataList => dataList.map(data => ({ close: data.close })),
  createTooltipDataSource: ({ indicator, crosshair }) => {
    const result = indicator.result;
    const data = result[crosshair.dataIndex];
    if (data) {
      return {
        legends: [
          { title: 'CLOSE: ', value: data.close },
          { title: 'random: ', value: Math.round(Math.random() * 10) }
        ]
      };
    }
    return {};
  }
});

const chart = init('custom-indicator-tooltip-chart');

chart.createIndicator('customIndicatorTooltip');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
