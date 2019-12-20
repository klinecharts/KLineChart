import IndicatorChart from './IndicatorChart'
import MainRender from '../render/MainRender'

import { IndicatorType, YAxisPosition, YAxisTextPosition, ChartType } from '../internal/constants'

class MainChart extends IndicatorChart {
  constructor (dom, config, dataProvider) {
    super(dom, config, dataProvider, IndicatorType.MA)
    this.chartRender = new MainRender(this.viewPortHandler, dataProvider, this.yAxisRender)
    this.chartType = ChartType.CANDLE
  }

  draw () {
    super.draw()
    this.chartRender.renderLastPriceMark(
      this.ctx, this.config.lastPriceMark,
      this.config.yAxis.position === YAxisPosition.LEFT,
      this.config.yAxis.tick.text.position === YAxisTextPosition.OUTSIDE
    )
  }

  drawChart () {
    if (this.chartType !== ChartType.REAL_TIME) {
      this.chartRender.renderCandle(this.ctx, this.config.candle)
      this.chartRender.renderIndicator(this.ctx, this.indicatorType, this.config.indicator, true)
      this.chartRender.renderHighestPriceMark(this.ctx, this.config.highestPriceMark)
      this.chartRender.renderLowestPriceMark(this.ctx, this.config.lowestPriceMark)
    } else {
      this.chartRender.renderTimeLine(this.ctx, this.config.realTime)
    }
  }

  isTimeLineChart () {
    return this.chartType === ChartType.REAL_TIME
  }

  isDraw () {
    return true
  }

  isMainChart () {
    return true
  }
}

export default MainChart
