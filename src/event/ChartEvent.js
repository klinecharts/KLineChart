import EventBase from './EventBase'
import ZoomScrollEventHandler from './ZoomScrollEventHandler'
import GraphicMarkEventHandler from './GraphicMarkEventHandler'
import { GraphicMarkType } from '../data/ChartData'
import KeyBoardEventHandler from './KeyBoardEventHandler'

export default class ChartEvent {
  constructor (target, chartData, xAxis, yAxis) {
    this._target = target
    this._chartData = chartData
    this._seriesSize = {}
    this._event = new EventBase(this._target, {
      pinchStartEvent: this._pinchStartEvent.bind(this),
      pinchEvent: this._pinchEvent.bind(this),
      mouseUpEvent: this._mouseUpEvent.bind(this),
      mouseClickEvent: this._mouseClickEvent.bind(this),
      mouseDownEvent: this._mouseDownEvent.bind(this),
      mouseRightDownEvent: this._mouseRightDownEvent.bind(this),
      mouseLeaveEvent: this._mouseLeaveEvent.bind(this),
      mouseMoveEvent: this._mouseMoveEvent.bind(this),
      mouseWheelEvent: this._mouseWheelEvent.bind(this),
      pressedMouseMoveEvent: this._pressedMouseMoveEvent.bind(this),
      longTapEvent: this._longTapEvent.bind(this)
    }, {
      treatVertTouchDragAsPageScroll: false,
      treatHorzTouchDragAsPageScroll: false
    })
    this._boundKeyBoardDownEvent = this._keyBoardDownEvent.bind(this)
    this._target.addEventListener('keydown', this._boundKeyBoardDownEvent)
    this._boundContextMenuEvent = (e) => { e.preventDefault() }
    this._target.addEventListener('contextmenu', this._boundContextMenuEvent, false)
    this._zoomScrollEventHandler = new ZoomScrollEventHandler(chartData)
    this._graphicMarkEventHandler = new GraphicMarkEventHandler(chartData, xAxis, yAxis)
    this._keyBoardEventHandler = new KeyBoardEventHandler(chartData)
  }

  _keyBoardDownEvent (event) {
    this._keyBoardEventHandler.keyBoardDownEvent(event)
  }

  _pinchStartEvent () {
    this._zoomScrollEventHandler.pinchStartEvent()
  }

  _pinchEvent (middlePoint, scale) {
    this._zoomScrollEventHandler.pinchEvent(middlePoint, scale)
  }

  _mouseUpEvent (event) {
    this._target.style.cursor = 'crosshair'
    event.localX -= this._seriesSize.contentLeft
    this._graphicMarkEventHandler.mouseUpEvent(event)
  }

  _mouseLeaveEvent (event) {
    if (this._checkZoomScroll()) {
      event.localX -= this._seriesSize.contentLeft
      this._zoomScrollEventHandler.mouseLeaveEvent(event)
    }
  }

  _mouseMoveEvent (event) {
    event.localX -= this._seriesSize.contentLeft
    this._graphicMarkEventHandler.mouseMoveEvent(event)
    if (this._checkZoomScroll()) {
      this._zoomScrollEventHandler.mouseMoveEvent(event)
    }
  }

  _mouseWheelEvent (event) {
    if (this._checkZoomScroll()) {
      this._zoomScrollEventHandler.mouseWheelEvent(event)
    }
  }

  _mouseClickEvent (event) {
    if (this._checkZoomScroll()) {
      event.localX -= this._seriesSize.contentLeft
      this._zoomScrollEventHandler.mouseClickEvent(event)
    }
  }

  _mouseDownEvent (event) {
    this._target.style.cursor = 'pointer'
    event.localX -= this._seriesSize.contentLeft
    this._graphicMarkEventHandler.mouseDownEvent(event)
    if (this._checkZoomScroll()) {
      this._zoomScrollEventHandler.mouseDownEvent(event)
    }
  }

  _mouseRightDownEvent (event) {
    event.localX -= this._seriesSize.contentLeft
    this._graphicMarkEventHandler.mouseRightDownEvent(event)
  }

  _pressedMouseMoveEvent (event) {
    event.localX -= this._seriesSize.contentLeft
    if (this._chartData.dragGraphicMarkFlag()) {
      this._graphicMarkEventHandler.pressedMouseMoveEvent(event)
      // 这里判断一下，如果是在拖拽图形标记，让十字光标不显示
      if (this._chartData.crossHairSeriesTag() !== null) {
        this._chartData.setCrossHairSeriesTag(null)
      }
    }
    if (this._checkZoomScroll()) {
      this._zoomScrollEventHandler.pressedMouseMoveEvent(event)
    }
  }

  _longTapEvent (event) {
    if (this._checkZoomScroll()) {
      event.localX -= this._seriesSize.contentLeft
      this._zoomScrollEventHandler.longTapEvent(event)
    }
  }

  _checkZoomScroll () {
    return !this._chartData.dragGraphicMarkFlag() && this._chartData.graphicMarkType() === GraphicMarkType.NONE
  }

  setSeriesSize (seriesSize) {
    this._seriesSize = seriesSize
    this._zoomScrollEventHandler.setSeriesSize(seriesSize)
    this._graphicMarkEventHandler.setSeriesSize(seriesSize)
  }

  destroy () {
    this._event.destroy()
    this._target.removeEventListener('keydown', this._boundKeyBoardDownEvent)
    this._target.removeEventListener('contextmenu', this._boundContextMenuEvent)
  }
}
