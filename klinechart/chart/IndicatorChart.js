import Chart from './Chart'
import IndicatorRender from '../render/IndicatorRender'
import YAxisRender from '../render/YAxisRender'

import { IndicatorType } from '../internal/constants'

class IndicatorChart extends Chart {
  constructor (
    dom, style, storage, indicatorParams,
    defaultIndicatorType = IndicatorType.MACD) {
    super(dom, style)
    this.indicatorParams = indicatorParams
    this.indicatorType = defaultIndicatorType
    this.yAxisRender = new YAxisRender(this.handler, storage)
    this.chartRender = new IndicatorRender(this.handler, storage, this.yAxisRender)
  }

  draw () {
    if (this.isDrawChart()) {
      const yAxis = this.style.yAxis
      this.calcYAxisMinMax()
      this.yAxisRender.computeAxis(yAxis)
      this.yAxisRender.renderSeparatorLines(this.ctx, yAxis)
      this.drawChart()
      this.yAxisRender.renderAxisLine(this.ctx, yAxis)
      this.yAxisRender.renderTickLines(this.ctx, yAxis)
      this.yAxisRender.renderAxisLabels(this.ctx, yAxis)
    }
  }

  drawChart () {
    this.chartRender.renderIndicator(
      this.ctx, this.indicatorType, this.style.indicator, this.indicatorParams, false)
    this.chartRender.renderHorizontalSeparatorLine(this.ctx, this.style.xAxis)
  }

  isDrawChart () {
    return this.indicatorType !== IndicatorType.NO
  }

  calcYAxisMinMax () {
    this.yAxisRender.calcAxisMinMax(this.indicatorType, false, false, false)
  }
}

export default IndicatorChart
