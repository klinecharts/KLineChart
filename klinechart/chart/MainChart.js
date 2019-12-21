import IndicatorChart from './IndicatorChart'
import MainRender from '../render/MainRender'

import { IndicatorType, YAxisPosition, YAxisTextPosition, ChartType } from '../internal/constants'

class MainChart extends IndicatorChart {
  constructor (dom, style, dataProvider) {
    super(dom, style, dataProvider, IndicatorType.MA)
    this.chartRender = new MainRender(this.viewPortHandler, dataProvider, this.yAxisRender)
    this.chartType = ChartType.CANDLE
  }

  draw () {
    super.draw()
    this.chartRender.renderLastPriceMark(
      this.ctx, this.style.lastPriceMark,
      this.style.yAxis.position === YAxisPosition.LEFT,
      this.style.yAxis.tick.text.position === YAxisTextPosition.OUTSIDE
    )
  }

  drawChart () {
    if (this.chartType !== ChartType.REAL_TIME) {
      this.chartRender.renderCandle(this.ctx, this.style.candle)
      this.chartRender.renderIndicator(this.ctx, this.indicatorType, this.style.indicator, true)
      this.chartRender.renderHighestPriceMark(this.ctx, this.style.highestPriceMark)
      this.chartRender.renderLowestPriceMark(this.ctx, this.style.lowestPriceMark)
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
