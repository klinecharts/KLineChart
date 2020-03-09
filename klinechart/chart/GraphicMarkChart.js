import Chart from './Chart'
import GraphicMarkRender from '../render/GraphicMarkRender'

class GraphicMarkChart extends Chart {
  constructor (dom, style, storage, yAxisRender, precision) {
    super(dom, style)
    this.graphicMarkRender = new GraphicMarkRender(this.handler, storage, yAxisRender)
    this.precision = precision
  }

  draw () {
    const graphicMark = this.style.graphicMark
    // 画线
    this.graphicMarkRender.renderHorizontalStraightLine(this.ctx, graphicMark)
    this.graphicMarkRender.renderVerticalStraightLine(this.ctx, graphicMark)
    this.graphicMarkRender.renderStraightLine(this.ctx, graphicMark)
    this.graphicMarkRender.renderHorizontalRayLine(this.ctx, graphicMark)
    this.graphicMarkRender.renderVerticalRayLine(this.ctx, graphicMark)
    this.graphicMarkRender.renderRayLine(this.ctx, graphicMark)
    this.graphicMarkRender.renderSegmentLine(this.ctx, graphicMark)
    this.graphicMarkRender.renderPriceLine(this.ctx, graphicMark, this.precision.pricePrecision)
    this.graphicMarkRender.renderPriceChannelLine(this.ctx, graphicMark)
    this.graphicMarkRender.renderParallelStraightLine(this.ctx, graphicMark)
    this.graphicMarkRender.renderFibonacciLine(this.ctx, graphicMark, this.precision.pricePrecision)
  }
}

export default GraphicMarkChart
