import IndicatorChart from './IndicatorChart'
import CandleRender from '../render/CandleRender'

import { IndicatorType, YAxisPosition, YAxisTextPosition, ChartType } from '../internal/constants'

class CandleChart extends IndicatorChart {
  constructor (dom, style, storage, indicatorParams, precision) {
    super(dom, style, storage, indicatorParams, IndicatorType.MA)
    this.chartRender = new CandleRender(this.handler, storage, this.yAxisRender)
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

  isDrawChart () {
    return true
  }

  calcYAxisMinMax () {
    this.yAxisRender.calcAxisMinMax(
      this.indicatorType, true,
      this.chartType === ChartType.REAL_TIME,
      this.style.realTime.averageLine.display
    )
  }
}

export default CandleChart
