import { getPixelRatio } from '../utils/canvas'
import { cancelAnimationFrame, requestAnimationFrame } from '../utils/compatible'

class View {
  constructor (container, chartData) {
    this._chartData = chartData
    this._initCanvas(container)
  }

  /**
   * 初始化画布
   * @param container
   * @private
   */
  _initCanvas (container) {
    this._canvas = document.createElement('canvas')
    this._canvas.style.position = 'absolute'
    this._canvas.style.right = '0'
    this._canvas.style.left = '0'
    this._canvas.style.zIndex = '2'
    this._ctx = this._canvas.getContext('2d')
    container.appendChild(this._canvas)
  }

  /**
   * 重新绘制
   * @param extendFun
   * @private
   */
  _redraw (extendFun) {
    if (this.requestAnimationId) {
      cancelAnimationFrame(this.requestAnimationId)
    }
    this.requestAnimationId = requestAnimationFrame(() => {
      this._ctx.clearRect(0, 0, this._width, this._height)
      if (extendFun) {
        extendFun()
      }
      this._draw()
    })
  }

  /**
   * 绘制
   */
  _draw () {
  }

  /**
   * 设置尺寸
   * @param width
   * @param height
   */
  setSize (width, height) {
    if (width !== this._width || height !== this._height) {
      this._redraw(() => {
        const pixelRatio = getPixelRatio(this._ctx)
        this._width = width * pixelRatio
        this._height = height * pixelRatio
        this._canvas.style.top = '0'
        this._canvas.style.width = `${width}px`
        this._canvas.style.height = `${height}px`
        this._canvas.width = this._width
        this._canvas.height = this._height
        this._ctx.scale(pixelRatio, pixelRatio)
        this._ctx.translate(0.5, 0.5)
      })
    }
  }

  /**
   * 刷新
   */
  flush () {
    this._redraw()
  }
}

export default View
