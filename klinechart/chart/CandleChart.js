import IndicatorChart from './IndicatorChart'
import CandleRender from '../render/CandleRender'

import { IndicatorType, YAxisPosition, YAxisTextPosition, MainChartType } from '../internal/constants'

class CandleChart extends IndicatorChart {
  constructor (dom, config, dataProvider) {
    super(dom, config, dataProvider, IndicatorType.MA)
    this.chartRender = new CandleRender(this.viewPortHandler, dataProvider, this.yAxisRender)
  }

  draw () {
    super.draw()
    this.chartRender.renderLastPriceMark(
      this.ctx, this.config.candle,
      this.config.yAxis.position === YAxisPosition.LEFT,
      this.config.yAxis.tick.text.position === YAxisTextPosition.OUTSIDE
    )
  }

  drawChart () {
    const candle = this.config.candle
    if (candle.chartType !== MainChartType.TIME_LINE) {
      this.chartRender.renderCandle(this.ctx, candle)
      this.chartRender.renderIndicator(this.ctx, this.indicatorType, this.config.indicator, true)
      this.chartRender.renderHighestPriceMark(this.ctx, candle)
      this.chartRender.renderLowestPriceMark(this.ctx, candle)
    } else {
      this.chartRender.renderTimeLine(this.ctx, candle)
    }
  }

  isTimeLineChart () {
    return this.config.candle.chartType === MainChartType.TIME_LINE
  }

  isDraw () {
    return true
  }

  isMainChart () {
    return true
  }
}

export default CandleChart
