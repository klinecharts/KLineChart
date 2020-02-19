import Chart from './Chart'
import MarkerRender from '../render/MarkerRender'

class MarkerChart extends Chart {
  constructor (dom, style, dataProvider, yAxisRender, precision) {
    super(dom, style)
    this.markerRender = new MarkerRender(this.viewPortHandler, dataProvider, yAxisRender)
    this.precision = precision
  }

  draw () {
    // 画线
    const marker = this.style.marker
    this.markerRender.renderHorizontalStraightLine(this.ctx, marker)
    this.markerRender.renderVerticalStraightLine(this.ctx, marker)
    this.markerRender.renderStraightLine(this.ctx, marker)
    this.markerRender.renderHorizontalRayLine(this.ctx, marker)
    this.markerRender.renderVerticalRayLine(this.ctx, marker)
    this.markerRender.renderRayLine(this.ctx, marker)
    this.markerRender.renderSegmentLine(this.ctx, marker)
    this.markerRender.renderPriceLine(this.ctx, marker, this.precision.pricePrecision)
    this.markerRender.renderPriceChannelLine(this.ctx, marker)
    this.markerRender.renderParallelStraightLine(this.ctx, marker)
    this.markerRender.renderFibonacciLine(this.ctx, marker, this.precision.pricePrecision)
  }
}

export default MarkerChart
