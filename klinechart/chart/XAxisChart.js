import Chart from './Chart'
import XAxisRender from '../render/XAxisRender'

class XAxisChart extends Chart {
  constructor (dom, style, dataProvider) {
    super(dom, style)
    this.xAxisRender = new XAxisRender(this.viewPortHandler, dataProvider)
  }

  draw () {
    const xAxis = this.style.xAxis
    this.xAxisRender.computeAxis(xAxis)
    this.xAxisRender.renderAxisLine(this.ctx, xAxis)
    this.xAxisRender.renderAxisLabels(this.ctx, xAxis)
    this.xAxisRender.renderSeparatorLines(this.ctx, xAxis)
    this.xAxisRender.renderTickLines(this.ctx, xAxis)
    this.xAxisRender.renderStrokeLine(this.ctx, xAxis, this.style.grid)
  }
}

export default XAxisChart
