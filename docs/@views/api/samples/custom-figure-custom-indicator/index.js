import { init, registerFigure, registerIndicator } from 'klinecharts'

registerFigure({
  name: 'diamond',
  draw: (ctx, attrs, styles) => {
    const { x, y, width, height } = attrs
    const { color } = styles
    ctx.beginPath()
    ctx.moveTo(x - width / 2, y)
    ctx.lineTo(x, y - height / 2)
    ctx.lineTo(x + width / 2, y)
    ctx.lineTo(x, y + height / 2)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  },
  checkEventOn: (coordinate, attrs) => {
    const { x, y } = coordinate
    const { width, height } = attrs
    return Math.abs(x * height) + Math.abs(y * width) <= width * height / 2
  }
})

registerIndicator({
  name: 'customIndicatorCustomFigure',
  figures: [{
    key: 'close',
    type: 'diamond',
    attrs: ({ coordinate, barSpace }) => {
      return {
        x: coordinate.current.x,
        y: coordinate.current.close,
        width: barSpace.gapBar,
        height: barSpace.gapBar
      }
    },
    styles: () => ({ color: '#a0a7e6' })
  }],
  calc: dataList => dataList.map(data => ({ ...data }))
})

const chart = init('custom-figure-custom-indicator-chart')

chart.createIndicator('customIndicatorCustomFigure')

chart.setSymbol({ ticker: 'TestSymbol' })
chart.setPeriod({ span: 1, type: 'day' })
chart.setDataLoader({
  getBars: ({
    callback
  }) => {
    fetch('https://klinecharts.com/datas/kline.json')
      .then(res => res.json())
      .then(dataList => {
        callback(dataList)
      })
  }
})
