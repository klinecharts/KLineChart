import Chart from './Chart'
import XAxisRender from '../render/XAxisRender'

class XAxisChart extends Chart {
  constructor (dom, style, storage, period) {
    super(dom, style)
    this.xAxisRender = new XAxisRender(this.handler, storage)
    this.period = period
  }

  draw () {
    const xAxis = this.style.xAxis
    this.xAxisRender.computeAxis(xAxis)
    this.xAxisRender.renderAxisLine(this.ctx, xAxis)
    this.xAxisRender.renderAxisLabels(this.ctx, xAxis, this.period.period)
    this.xAxisRender.renderSeparatorLines(this.ctx, xAxis)
    this.xAxisRender.renderTickLines(this.ctx, xAxis)
  }
}

export default XAxisChart
