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
      const isMainChart = this.isMainChart()
      if (!isMainChart) {
        this.chartRender.renderHorizontalSeparatorLine(this.ctx, this.style.xAxis)
      }
      const yAxis = this.style.yAxis
      const isRealTimeChart = this.isRealTimeChart()
      this.yAxisRender.calcAxisMinMax(this.indicatorType, isMainChart, isRealTimeChart, this.style.realTime.averageLine.display)
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
  }

  isDrawChart () {
    return this.indicatorType !== IndicatorType.NO
  }

  isMainChart () {
    return false
  }

  isRealTimeChart () {
    return false
  }
}

export default IndicatorChart
