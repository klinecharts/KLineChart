import Chart from './Chart'
import MarkerRender from '../render/MarkerRender'

class MarkerChart extends Chart {
  constructor (dom, config, dataProvider, yAxisRender) {
    super(dom, config)
    this.markerRender = new MarkerRender(this.viewPortHandler, dataProvider, yAxisRender)
  }

  draw () {
    // 画线
    const marker = this.config.marker
    this.markerRender.renderHorizontalStraightLine(this.ctx, marker)
    this.markerRender.renderVerticalStraightLine(this.ctx, marker)
    this.markerRender.renderStraightLine(this.ctx, marker)
    this.markerRender.renderHorizontalRayLine(this.ctx, marker)
    this.markerRender.renderVerticalRayLine(this.ctx, marker)
    this.markerRender.renderRayLine(this.ctx, marker)
    this.markerRender.renderSegmentLine(this.ctx, marker)
    this.markerRender.renderPriceLine(this.ctx, marker)
    this.markerRender.renderPriceChannelLine(this.ctx, marker)
    this.markerRender.renderParallelStraightLine(this.ctx, marker)
    this.markerRender.renderFibonacciLine(this.ctx, marker)
  }
}

export default MarkerChart
