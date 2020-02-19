import IndicatorChart from './IndicatorChart'
import MainRender from '../render/MainRender'

import { IndicatorType, YAxisPosition, YAxisTextPosition, ChartType } from '../internal/constants'

class MainChart extends IndicatorChart {
  constructor (dom, style, dataProvider, indicatorParams, precision) {
    super(dom, style, dataProvider, indicatorParams, IndicatorType.MA)
    this.chartRender = new MainRender(this.viewPortHandler, dataProvider, this.yAxisRender)
    this.precision = precision
    this.chartType = ChartType.CANDLE
  }

  draw () {
    super.draw()
    this.chartRender.renderLastPriceMark(
      this.ctx, this.style.lastPriceMark,
      this.style.yAxis.position === YAxisPosition.LEFT,
      this.style.yAxis.tick.text.position === YAxisTextPosition.OUTSIDE,
      this.precision.pricePrecision
    )
  }

  drawChart () {
    if (this.chartType !== ChartType.REAL_TIME) {
      this.chartRender.renderCandle(this.ctx, this.style.candle, this.precision.pricePrecision)
      this.chartRender.renderIndicator(
        this.ctx, this.indicatorType, this.style.indicator,
        this.indicatorParams, true
      )
      this.chartRender.renderHighestPriceMark(this.ctx, this.style.highestPriceMark, this.precision.pricePrecision)
      this.chartRender.renderLowestPriceMark(this.ctx, this.style.lowestPriceMark, this.precision.pricePrecision)
    } else {
      this.chartRender.renderTimeLine(this.ctx, this.style.realTime)
    }
  }

  isRealTimeChart () {
    return this.chartType === ChartType.REAL_TIME
  }

  isDrawChart () {
    return true
  }

  isMainChart () {
    return true
  }
}

export default MainChart
