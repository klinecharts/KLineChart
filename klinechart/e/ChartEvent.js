import EventBase from './EventBase'
import ZoomDragEventHandler from './ZoomDragEventHandler'
import GraphicMarkEventHandler from './GraphicMarkEventHandler'
import { GraphicMarkType } from '../data/ChartData'

export default class ChartEvent {
  constructor (target, chartData, xAxis, yAxis) {
    this._chartData = chartData
    this._seriesSize = {}
    this._event = new EventBase(target, {
      pinchStartEvent: this._pinchStartEvent.bind(this),
      pinchEvent: this._pinchEvent.bind(this),
      mouseUpEvent: this._mouseUpEvent.bind(this),
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
    this._zoomDragEventHandler = new ZoomDragEventHandler(chartData)
    this._graphicMarkEventHandler = new GraphicMarkEventHandler(chartData, xAxis, yAxis)
  }

  _pinchStartEvent () {
    this._zoomDragEventHandler.pinchStartEvent()
  }

  _pinchEvent (middlePoint, scale) {
    this._zoomDragEventHandler.pinchEvent(middlePoint, scale)
  }

  _mouseUpEvent (event) {
    this._graphicMarkEventHandler.mouseUpEvent(event)
  }

  _mouseLeaveEvent (event) {
    if (this._checkZoomDrag()) {
      this._zoomDragEventHandler.mouseLeaveEvent(event)
    }
  }

  _mouseMoveEvent (event) {
    this._graphicMarkEventHandler.mouseMoveEvent(event)
    if (this._checkZoomDrag()) {
      this._zoomDragEventHandler.mouseMoveEvent(event)
    }
  }

  _mouseWheelEvent (event) {
    if (this._checkZoomDrag()) {
      this._zoomDragEventHandler.mouseWheelEvent(event)
    }
  }

  _mouseClickEvent (event) {
    if (this._checkZoomDrag()) {
      this._zoomDragEventHandler.mouseClickEvent(event)
    }
  }

  _mouseDownEvent (event) {
    this._graphicMarkEventHandler.mouseDownEvent(event)
    if (this._checkZoomDrag()) {
      this._zoomDragEventHandler.mouseDownEvent(event)
    }
  }

  _pressedMouseMoveEvent (event) {
    if (this._checkZoomDrag()) {
      this._zoomDragEventHandler.pressedMouseMoveEvent(event)
    }
  }

  _longTapEvent (event) {
    if (this._checkZoomDrag()) {
      this._zoomDragEventHandler.longTapEvent(event)
    }
  }

  _checkZoomDrag () {
    return !this._chartData.dragGraphicMarkFlag() && this._chartData.graphicMarkType() === GraphicMarkType.NONE
  }

  setSeriesSize (seriesSize) {
    this._zoomDragEventHandler.setSeriesSize(seriesSize)
  }

  destroy () {
    this._event.destroy()
  }
}
