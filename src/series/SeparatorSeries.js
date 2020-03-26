import EventBase from '../event/EventBase'
import { getPixelRatio } from '../utils/canvas'

export default class SeparatorSeries {
  constructor (container, chartData, seriesIndex, dragEventHandler) {
    this._chartData = chartData
    this._seriesIndex = seriesIndex
    this._width = 0
    this._offsetLeft = 0
    this._dragEventHandler = dragEventHandler
    this._initElement(container)
  }

  _initElement (container) {
    this._container = container
    this._wrapper = document.createElement('div')
    this._wrapper.style.margin = '0'
    this._wrapper.style.padding = '0'
    // this._wrapper.style.position = 'relative'
    this._wrapper.style.overflow = 'hidden'
    this._element = document.createElement('div')
    this._element.style.margin = '0'
    this._element.style.padding = '0'
    this._element.style.width = '100%'
    this._element.style.cursor = 'ns-resize'
    this._element.style.position = 'absolute'
    this._element.style.zIndex = '20'
    this._element.style.height = '5px'
    this._wrapper.appendChild(this._element)
    const lastElement = container.lastChild
    if (lastElement) {
      container.insertBefore(this._wrapper, lastElement)
    } else {
      container.appendChild(this._wrapper)
    }
    this._dragEvent = new EventBase(this._element, {
      mouseDownEvent: this._mouseDownEvent.bind(this),
      pressedMouseMoveEvent: this._pressedMouseMoveEvent.bind(this)
    }, {
      treatVertTouchDragAsPageScroll: false,
      treatHorzTouchDragAsPageScroll: true
    })
  }

  _mouseDownEvent (event) {
    this._startY = event.pageY
    this._dragEventHandler.startDrag(this._seriesIndex)
  }

  _pressedMouseMoveEvent (event) {
    const dragDistance = event.pageY - this._startY
    this._dragEventHandler.drag(dragDistance, this._seriesIndex)
  }

  /**
   * 获取高度
   * @returns {number}
   */
  height () {
    return this._wrapper.offsetHeight
  }

  /**
   * 设置尺寸
   * 用于fill属性
   * @param offsetLeft
   * @param width
   */
  setSize (offsetLeft, width) {
    this._offsetLeft = offsetLeft
    this._width = width
    this.invalidate()
  }

  /**
   * 更新上下两个图表的索引
   * @param seriesIndex
   */
  updateSeriesIndex (seriesIndex) {
    this._seriesIndex = seriesIndex
  }

  /**
   * 刷新
   */
  invalidate () {
    const separator = this._chartData.styleOptions().separator
    this._wrapper.style.backgroundColor = separator.color
    this._wrapper.style.height = `${separator.size}px`
    this._wrapper.style.marginLeft = `${separator.fill ? 0 : this._offsetLeft}px`
    this._wrapper.style.width = separator.fill ? '100%' : `${this._width}px`
  }

  /**
   * 将图形转换成图片
   * @returns {HTMLCanvasElement}
   */
  getImage () {
    const separator = this._chartData.styleOptions().separator
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const pixelRatio = getPixelRatio(ctx)
    const width = this._wrapper.offsetWidth
    const height = separator.size
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)
    ctx.fillStyle = separator.color
    ctx.fillRect(this._offsetLeft, 0, width, height)
    return canvas
  }

  /**
   * 销毁
   */
  destroy () {
    this._dragEvent.destroy()
    this._container.removeChild(this._wrapper)
    delete this
  }
}
