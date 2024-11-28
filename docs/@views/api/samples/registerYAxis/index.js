import { init, registerYAxis } from 'klinecharts';

registerYAxis({
  name: 'customYAxisBasic',
  minSpan: () => Math.pow(10, -2),
  displayValueToText: value => `${value.toFixed(2)}%`,
  valueToRealValue: (value, { range }) => (value - range.from) / range.range * range.realRange + range.realFrom,
  realValueToValue: (value, { range }) => (value - range.realFrom) / range.realRange * range.range + range.from,
  createRange: ({ chart, defaultRange }) => {
    const kLineDataList = chart.getDataList()
    const visibleRange = chart.getVisibleRange()
    const kLineData = kLineDataList[visibleRange.from]
    if (kLineData) {
      const realFrom = -200
      const realTo = 200
      const from = realFrom / 100 * kLineData.close + kLineData.close
      const to = realTo / 100 * kLineData.close + kLineData.close
      const realRange = realTo - realFrom
      return {
        from,
        to,
        range: to - from,
        realFrom,
        realTo,
        realRange,
        displayFrom: realFrom,
        displayTo: realTo,
        displayRange: realRange
      }
    }
    return defaultRange
  }
});

const chart = init(
  'custom-y-axis-basic-chart',
  {
    layout: [
      {
        type: 'candle',
        options: {
          axis: {
            name: 'customYAxisBasic',
          }
        }
      }
    ]
  }
);

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
