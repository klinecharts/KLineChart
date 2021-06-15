/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import EventBase from './EventBase'
import ZoomScrollEventHandler from './ZoomScrollEventHandler'
import GraphicMarkEventHandler from './GraphicMarkEventHandler'
import KeyBoardEventHandler from './KeyBoardEventHandler'

export default class ChartEvent {
  constructor (target, chartData) {
    this._target = target
    this._chartData = chartData
    this._chartContentSize = {}
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
    this._graphicMarkEventHandler = new GraphicMarkEventHandler(chartData)
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
    event.localX -= this._chartContentSize.contentLeft
    this._graphicMarkEventHandler.mouseUpEvent(event)
  }

  _mouseLeaveEvent (event) {
    if (this._checkZoomScroll()) {
      event.localX -= this._chartContentSize.contentLeft
      this._zoomScrollEventHandler.mouseLeaveEvent(event)
    }
  }

  _mouseMoveEvent (event) {
    event.localX -= this._chartContentSize.contentLeft
    if (this._chartData.graphicMarks().length > 0) {
      this._graphicMarkEventHandler.mouseMoveEvent(event)
    }
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
      event.localX -= this._chartContentSize.contentLeft
      this._zoomScrollEventHandler.mouseClickEvent(event)
    }
  }

  _mouseDownEvent (event) {
    this._target.style.cursor = 'pointer'
    event.localX -= this._chartContentSize.contentLeft
    this._graphicMarkEventHandler.mouseDownEvent(event)
    if (this._checkZoomScroll()) {
      this._zoomScrollEventHandler.mouseDownEvent(event)
    }
  }

  _mouseRightDownEvent (event) {
    event.localX -= this._chartContentSize.contentLeft
    this._graphicMarkEventHandler.mouseRightDownEvent(event)
  }

  _pressedMouseMoveEvent (event) {
    event.localX -= this._chartContentSize.contentLeft
    if (this._chartData.dragGraphicMarkFlag()) {
      this._graphicMarkEventHandler.pressedMouseMoveEvent(event)
      // 这里判断一下，如果是在拖拽图形标记，让十字光标不显示
      if (this._chartData.crosshair().paneId) {
        this._chartData.setCrosshairPointPaneId()
      }
    }
    if (this._checkZoomScroll()) {
      this._zoomScrollEventHandler.pressedMouseMoveEvent(event)
    }
  }

  _longTapEvent (event) {
    if (this._checkZoomScroll()) {
      event.localX -= this._chartContentSize.contentLeft
      this._zoomScrollEventHandler.longTapEvent(event)
    }
  }

  _checkZoomScroll () {
    const graphicMarks = this._chartData.graphicMarks()
    const graphicMarkCount = graphicMarks.length
    return !this._chartData.dragPaneFlag() && !this._chartData.dragGraphicMarkFlag() && (graphicMarkCount === 0 || !graphicMarks[graphicMarkCount - 1].isDrawing())
  }

  setChartContentSize (chartContentSize) {
    this._chartContentSize = chartContentSize
    this._zoomScrollEventHandler.setChartContentSize(chartContentSize)
    this._graphicMarkEventHandler.setChartContentSize(chartContentSize)
  }

  setPaneContentSize (paneContentSize) {
    this._zoomScrollEventHandler.setPaneContentSize(paneContentSize)
    this._graphicMarkEventHandler.setPaneContentSize(paneContentSize)
  }

  destroy () {
    this._event.destroy()
    this._target.removeEventListener('keydown', this._boundKeyBoardDownEvent)
    this._target.removeEventListener('contextmenu', this._boundContextMenuEvent)
  }
}
