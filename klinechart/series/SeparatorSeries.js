import EventBase from '../e/EventBase'

export default class SeparatorSeries {
  constructor (container, chartData, seriesIndex, dragEventHandler) {
    this._chartData = chartData
    this._seriesIndex = seriesIndex
    this._excludeYAxisWidth = 0
    this._dragEventHandler = dragEventHandler
    this._initElement(container)
  }

  _initElement (container) {
    this._container = container
    this._wrapper = document.createElement('div')
    this._wrapper.style.margin = '0'
    this._wrapper.style.padding = '0'
    this._wrapper.style.position = 'relative'
    this._wrapper.style.overflow = 'hidden'
    this._wrapper.style.zIndex = '10'
    this._element = document.createElement('div')
    this._element.style.margin = '0'
    this._element.style.padding = '0'
    this._element.style.cursor = 'ns-resize'
    this._element.style.height = '6px'
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
   * 设置去除y轴的宽度
   * 用于fill属性
   * @param width
   */
  setExcludeYAxisWidth (width) {
    this._excludeYAxisWidth = width
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
    this._wrapper.style.width = separator.fill ? '100%' : `${this._excludeYAxisWidth}px`
  }

  /**
   * 销毁
   */
  destroy () {
    this._dragEvent.destroy()
    this._container.removeChild(this._wrapper)
  }
}
