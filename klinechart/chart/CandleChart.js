import IndicatorChart from './IndicatorChart'
import CandleStickView from '../render/CandleRender'

import { IndicatorType, YAxisPosition, YAxisTextPosition, ChartType } from '../internal/constants'

class CandleChart extends IndicatorChart {
  constructor (dom, style, storage, indicatorParams, precision) {
    super(dom, style, storage, indicatorParams, IndicatorType.MA)
    this.chartRender = new CandleStickView(this.handler, storage, this.yAxisRender)
    this.precision = precision
    this.chartType = ChartType.CANDLE
  }

  draw () {
    super.draw()
    this.chartRender.renderLastPriceMark(
      this.ctx, this.style.candle.lastPriceMark,
      this.style.yAxis.position === YAxisPosition.LEFT,
      this.style.yAxis.tick.text.position === YAxisTextPosition.OUTSIDE,
      this.precision.pricePrecision
    )
  }

  drawChart () {
    const candle = this.style.candle
    if (this.chartType !== ChartType.REAL_TIME) {
      this.chartRender.renderCandle(this.ctx, candle.bar, this.precision.pricePrecision)
      this.chartRender.renderIndicator(
        this.ctx, this.indicatorType, this.style.indicator,
        this.indicatorParams, true
      )
      this.chartRender.renderHighestPriceMark(this.ctx, candle.highestPriceMark, this.precision.pricePrecision)
      this.chartRender.renderLowestPriceMark(this.ctx, candle.lowestPriceMark, this.precision.pricePrecision)
    } else {
      this.chartRender.renderTimeLine(this.ctx, candle)
    }
  }

  isDrawChart () {
    return true
  }

  calcYAxisMinMax () {
    this.yAxisRender.calcAxisMinMax(
      this.indicatorType, true,
      this.chartType === ChartType.REAL_TIME,
      this.style.candle.averageLine.display
    )
  }
}

export default CandleChart
