import Chart from './Chart'
import GraphicMarkRender from '../render/GraphicMarkRender'

class GraphicMarkChart extends Chart {
  constructor (dom, style, storage, yAxisRender, precision) {
    super(dom, style)
    this.graphicMarkRender = new GraphicMarkRender(this.handler, storage, yAxisRender, style.marker)
    this.precision = precision
  }

  draw () {
    // 画线
    this.graphicMarkRender.renderHorizontalStraightLine(this.ctx)
    this.graphicMarkRender.renderVerticalStraightLine(this.ctx)
    this.graphicMarkRender.renderStraightLine(this.ctx)
    this.graphicMarkRender.renderHorizontalRayLine(this.ctx)
    this.graphicMarkRender.renderVerticalRayLine(this.ctx)
    this.graphicMarkRender.renderRayLine(this.ctx)
    this.graphicMarkRender.renderSegmentLine(this.ctx)
    this.graphicMarkRender.renderPriceLine(this.ctx, this.precision.pricePrecision)
    this.graphicMarkRender.renderPriceChannelLine(this.ctx)
    this.graphicMarkRender.renderParallelStraightLine(this.ctx)
    this.graphicMarkRender.renderFibonacciLine(this.ctx, this.precision.pricePrecision)
  }
}

export default GraphicMarkChart
