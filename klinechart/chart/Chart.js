import ViewPortHandler from '../internal/ViewPortHandler'
import { getPixelRatio, requestAnimationFrame, cancelAnimationFrame } from '../utils/drawUtils'

class Chart {
  constructor (dom, style) {
    this.style = style
    this.viewPortHandler = new ViewPortHandler()
    this.init(dom)
  }

  /**
   * 初始化canvas
   * @param dom
   */
  init (dom) {
    const canvasDom = document.createElement('canvas')
    canvasDom.style.position = 'absolute'
    canvasDom.style.right = '0'
    canvasDom.style.left = '0'
    this.canvasDom = canvasDom
    this.ctx = this.canvasDom.getContext('2d')
    dom.appendChild(this.canvasDom)
  }

  /**
   * 设置图尺寸
   * @param chartTop
   * @param width
   * @param height
   * @param offsetLeft
   * @param offsetRight
   * @param offsetTop
   * @param offsetBottom
   */
  setChartDimensions (chartTop, width, height, offsetLeft, offsetRight, offsetTop = 0, offsetBottom = 0) {
    this.clearCanvas()
    const pixelRatio = getPixelRatio(this.ctx)
    const canvasWidth = width * pixelRatio
    const canvasHeight = height * pixelRatio
    this.canvasDom.style.top = `${chartTop}px`
    this.canvasDom.style.width = `${width}px`
    this.canvasDom.style.height = `${height}px`
    this.canvasDom.width = canvasWidth
    this.canvasDom.height = canvasHeight
    this.viewPortHandler.setDimensions(width, height, offsetLeft, offsetRight, offsetTop, offsetBottom)
    this.ctx.scale(pixelRatio, pixelRatio)
    this.ctx.translate(-0.5, -0.5)
    this.draw()
  }

  /**
   * 清空画布
   */
  clearCanvas () {
    this.ctx.clearRect(0, 0, this.viewPortHandler.width, this.viewPortHandler.height)
  }

  /**
   * 刷新
   */
  flush () {
    if (this.requestAnimationId) {
      cancelAnimationFrame(this.requestAnimationId)
    }
    this.requestAnimationId = requestAnimationFrame(() => {
      this.clearCanvas()
      this.draw()
    })
  }

  /**
   * 绘制
   */
  draw () {
  }
}

export default Chart
