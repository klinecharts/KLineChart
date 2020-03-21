import EventBase from '../e/EventBase'

export default class SeparatorSeries {
  constructor (container, chartData, topSeriesIndex, bottomSeriesIndex, dragEventHandler) {
    this._chartData = chartData
    this._topSeriesIndex = topSeriesIndex
    this._bottomSeriesIndex = bottomSeriesIndex
    this._dragEventHandler = dragEventHandler
    this._initElement(container)
  }

  _initElement (container) {
    this._container = container
    this._wrapper = document.createElement('div')
    this._wrapper.style.margin = '0'
    this._wrapper.style.padding = '0'
    this._wrapper.style.width = '100%'
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
    this.invalidate()
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
    this._dragEventHandler.startDrag(this._topSeriesIndex, this._bottomSeriesIndex)
  }

  _pressedMouseMoveEvent (event) {
    const dragDistance = event.pageY - this._startY
    this._dragEventHandler.drag(dragDistance, this._topSeriesIndex, this._bottomSeriesIndex)
  }

  /**
   * 更新上下两个图表的索引
   * @param topSeriesIndex
   * @param bottomSeriesIndex
   */
  updateSeriesIndex (topSeriesIndex, bottomSeriesIndex) {
    this._topSeriesIndex = topSeriesIndex
    this._bottomSeriesIndex = bottomSeriesIndex
  }

  /**
   * 刷新
   */
  invalidate () {
    const separator = this._chartData.styleOptions().separator
    this._wrapper.style.backgroundColor = separator.color
    this._wrapper.style.height = `${separator.size}px`
  }

  /**
   * 销毁
   */
  destroy () {
    this._dragEvent.destroy()
    this._container.removeChild(this._wrapper)
  }
}
