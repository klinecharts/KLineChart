import EventBase, { isMouse, isTouch } from './EventBase'

export default class ChartEvent {
  constructor (target, chartData) {
    this._chartData = chartData
    this._seriesSize = {}
    this._event = new EventBase(target, {
      pinchStartEvent: this._pinchStartEvent.bind(this),
      pinchEvent: this._pinchEvent.bind(this),
      mouseClickEvent: this._mouseClickEvent.bind(this),
      mouseDownEvent: this._mouseDownEvent.bind(this),
      mouseLeaveEvent: this._mouseLeaveEvent.bind(this),
      mouseMoveEvent: this._mouseMoveEvent.bind(this),
      mouseWheelEvent: this._mouseWheelEvent.bind(this),
      pressedMouseMoveEvent: this._pressedMouseMoveEvent.bind(this),
      longTapEvent: this._longTapEvent.bind(this)
    }, {
      treatVertTouchDragAsPageScroll: false,
      treatHorzTouchDragAsPageScroll: false
    })

    // 开始拖动时坐标点
    this._startDragPoint = {}
    // 开始触摸时坐标
    this._touchPoint = {}
    // 是否是取消了十字光标
    this._touchCancelCrossHair = false
    // 是否缩放过
    this._touchZoomed = false
    // 用来记录捏合缩放的尺寸
    this._pinchScale = 1
  }

  _pinchStartEvent () {
    this._pinchScale = 1
    this._touchZoomed = true
  }

  _pinchEvent (middlePoint, scale) {
    const zoomScale = (scale - this._pinchScale) * 5
    this._pinchScale = scale
    this._chartData.zoom(zoomScale)
  }

  _mouseLeaveEvent (event) {
    if (isMouse(event)) {
      this._chartData.setCrossHairSeriesTag(null)
    }
  }

  _mouseMoveEvent (event) {
    if (!isMouse(event)) {
      return
    }
    if (!this._checkEventPointX(event.localX)) {
      this._chartData.setCrossHairSeriesTag(null)
      return
    }
    const real = this._translateCrossHairRealY(event.localY)
    if (!real) {
      this._chartData.setCrossHairSeriesTag(null)
      return
    }
    this._chartData.setCrossHairPoint({ x: event.localX, y: real.y })
    this._chartData.setCrossHairSeriesTag(real.tag)
  }

  _mouseWheelEvent (event) {
    if (!this._checkEventPointX(event.localX)) {
      return
    }
    let deltaY = -(event.deltaY / 100)
    if (deltaY === 0) {
      return
    }
    if (event.cancelable) {
      event.preventDefault()
    }

    switch (event.deltaMode) {
      case event.DOM_DELTA_PAGE:
        deltaY *= 120
        break

      case event.DOM_DELTA_LINE:
        deltaY *= 32
        break
    }

    if (deltaY !== 0) {
      const zoomScale = Math.sign(deltaY) * Math.min(1, Math.abs(deltaY))
      this._chartData.zoom(zoomScale)
    }
  }

  _mouseClickEvent (event) {
    if (!isTouch(event) || !this._checkEventPointX(event.localX)) {
      return
    }
    const real = this._translateCrossHairRealY(event.localY)
    if (!real) {
      return
    }
    if (!this._touchPoint && !this._touchCancelCrossHair && !this._touchZoomed) {
      this._touchPoint = { x: event.localX, y: event.localY }
      this._chartData.setCrossHairPoint({ x: event.localX, y: real.y })
      this._chartData.setCrossHairSeriesTag(real.tag)
    }
  }

  _mouseDownEvent (event) {
    this._startDragPoint = { x: event.localX, y: event.localY }
    this._chartData.startDrag()
    if (!isTouch(event) || !this._checkEventPointX(event.localX)) {
      return
    }
    const real = this._translateCrossHairRealY(event.localY)
    if (!real) {
      return
    }
    const crossHairPoint = { x: event.localX, y: real.y }
    this._touchZoomed = false
    if (this._touchPoint) {
      const xDif = event.localX - this._touchPoint.x
      const yDif = event.localY - this._touchPoint.y
      const radius = Math.sqrt(xDif * xDif + yDif * yDif)
      if (radius < 10) {
        this._touchPoint = { x: event.localX, y: event.localY }
        this._chartData.setCrossHairPoint(crossHairPoint)
        this._chartData.setCrossHairSeriesTag(real.tag)
      } else {
        this._touchCancelCrossHair = true
        this._touchPoint = null
        this._chartData.setCrossHairPoint(crossHairPoint)
        this._chartData.setCrossHairSeriesTag(null)
      }
    } else {
      this._touchCancelCrossHair = false
    }
  }

  _pressedMouseMoveEvent (event) {
    if (!this._checkEventPointX(event.localX)) {
      return
    }
    const real = this._translateCrossHairRealY(event.localY)
    if (!real) {
      return
    }
    const crossHairPoint = { x: event.localX, y: real.y }
    if (isTouch(event)) {
      if (this._touchPoint) {
        this._touchPoint = { x: event.localX, y: event.localY }
        this._chartData.setCrossHairPoint(crossHairPoint)
        this._chartData.setCrossHairSeriesTag(real.tag)
        return
      }
    }
    const distance = event.localX - this._startDragPoint.x
    this._chartData.setCrossHairPoint(crossHairPoint)
    this._chartData.drag(distance)
  }

  _longTapEvent (event) {
    if (!isTouch(event) || !this._checkEventPointX(event.localX)) {
      return
    }
    const real = this._translateCrossHairRealY(event.localY)
    if (!real) {
      return
    }
    this._touchPoint = { x: event.localX, y: event.localY }
    this._chartData.setCrossHairPoint({ x: event.localX, y: real.y })
    this._chartData.setCrossHairSeriesTag(real.tag)
  }

  _checkEventPointX (x) {
    return x > this._seriesSize.contentLeft && x < this._seriesSize.contentRight
  }

  /**
   * 将事件的y点转换成十字光标点的y
   * @param y
   * @returns {{}|null}
   * @private
   */
  _translateCrossHairRealY (y) {
    const tags = this._seriesSize.tags || {}
    for (const tag in tags) {
      const size = tags[tag]
      if (y > size.contentTop && y < size.contentBottom) {
        return { tag, y: y - size.contentTop }
      }
    }
    return null
  }

  setSeriesSize (seriesSize) {
    this._seriesSize = seriesSize
  }

  destroy () {
    this._event.destroy()
  }
}
