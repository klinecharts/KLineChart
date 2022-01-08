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
import OverlayEventHandler from './OverlayEventHandler'
import KeyBoardEventHandler from './KeyBoardEventHandler'

import { isTouch } from './eventTypeChecks'

export default class ChartEvent {
  constructor (target, chartStore, yAxis) {
    this._target = target
    this._chartStore = chartStore
    this._chartContentLeftRight = {}
    this._chartContentTopBottom = {}
    this._paneContentSize = {}
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
      treatVertTouchDragAsPageScroll: true,
      treatHorzTouchDragAsPageScroll: false
    })
    this._boundKeyBoardDownEvent = this._keyBoardDownEvent.bind(this)
    this._target.addEventListener('keydown', this._boundKeyBoardDownEvent)
    this._boundContextMenuEvent = (e) => { e.preventDefault() }
    this._target.addEventListener('contextmenu', this._boundContextMenuEvent, false)
    this._zoomScrollEventHandler = new ZoomScrollEventHandler(chartStore)
    this._overlayEventHandler = new OverlayEventHandler(chartStore, yAxis)
    this._keyBoardEventHandler = new KeyBoardEventHandler(chartStore)
  }

  _keyBoardDownEvent (event) {
    this._keyBoardEventHandler.keyBoardDownEvent(event)
  }

  _pinchStartEvent () {
    this._zoomScrollEventHandler.pinchStartEvent()
  }

  _pinchEvent (middleCoordinate, scale) {
    this._zoomScrollEventHandler.pinchEvent(middleCoordinate, scale)
  }

  _mouseUpEvent (event) {
    if (this._checkEventInChartContent(event)) {
      this._target.style.cursor = 'crosshair'
    }
    this._zoomScrollEventHandler.mouseUpEvent(event)
    if (this._shouldPerformOverlayEvent()) {
      this._overlayEventHandler.mouseUpEvent(event)
    }
  }

  _mouseLeaveEvent (event) {
    this._zoomScrollEventHandler.mouseLeaveEvent(event)
  }

  _mouseMoveEvent (event) {
    // 当事件目标是在容器内部元素时，不出来move事件
    // 等待寻找最优解
    if (event.target instanceof HTMLCanvasElement) {
      if (this._checkEventInChartContent(event)) {
        this._target.style.cursor = 'crosshair'
        const compatEvent = this._compatChartEvent(event, true)
        if (this._shouldPerformOverlayEvent()) {
          this._overlayEventHandler.mouseMoveEvent(compatEvent)
        }
        if (!this._chartStore.dragPaneFlag()) {
          this._zoomScrollEventHandler.mouseMoveEvent(compatEvent)
        }
      } else {
        this._target.style.cursor = 'default'
        this._zoomScrollEventHandler.mouseLeaveEvent(event)
      }
    } else {
      this._target.style.cursor = 'default'
      this._chartStore.crosshairStore().set()
    }
  }

  _mouseWheelEvent (event) {
    if (this._checkZoomScroll() && this._checkEventInChartContent(event)) {
      this._zoomScrollEventHandler.mouseWheelEvent(this._compatChartEvent(event))
    }
  }

  _mouseClickEvent (event) {
    if (this._checkZoomScroll() && this._checkEventInChartContent(event)) {
      this._zoomScrollEventHandler.mouseClickEvent(this._compatChartEvent(event, true))
      this._modifyEventOptions(event)
    }
  }

  _mouseDownEvent (event) {
    if (this._checkEventInChartContent(event)) {
      this._target.style.cursor = 'pointer'
      const compatEvent = this._compatChartEvent(event, true)
      if (this._shouldPerformOverlayEvent()) {
        this._overlayEventHandler.mouseDownEvent(compatEvent)
      }
      if (this._checkZoomScroll()) {
        this._zoomScrollEventHandler.mouseDownEvent(compatEvent)
        this._modifyEventOptions(event)
      }
    }
  }

  _mouseRightDownEvent (event) {
    if (this._shouldPerformOverlayEvent() && this._checkEventInChartContent(event)) {
      this._overlayEventHandler.mouseRightDownEvent(this._compatChartEvent(event, true))
    }
  }

  _pressedMouseMoveEvent (event) {
    if (this._checkEventInChartContent(event)) {
      const compatEvent = this._compatChartEvent(event, true)
      if (this._checkZoomScroll()) {
        this._zoomScrollEventHandler.pressedMouseMoveEvent(compatEvent)
        this._modifyEventOptions(event)
      } else {
        this._overlayEventHandler.pressedMouseMoveEvent(compatEvent)
      }
    }
  }

  _longTapEvent (event) {
    if (this._checkZoomScroll() && this._checkEventInChartContent(event)) {
      this._zoomScrollEventHandler.longTapEvent(this._compatChartEvent(event, true))
      this._modifyEventOptions(event)
    }
  }

  _checkZoomScroll () {
    return !this._chartStore.dragPaneFlag() && !this._chartStore.shapeStore().isPressed() && !this._chartStore.shapeStore().isDrawing()
  }

  /**
   * 是否需要处理图形标记事件
   * @return {boolean}
   * @private
   */
  _shouldPerformOverlayEvent () {
    return !this._chartStore.shapeStore().isEmpty() || !this._chartStore.annotationStore().isEmpty()
  }

  /**
   * 修改事件配置
   * @param event
   */
  _modifyEventOptions (event) {
    if (isTouch(event) && this._chartStore.crosshairStore().get().paneId) {
      this._event.setOptions({ treatVertTouchDragAsPageScroll: false })
    } else {
      this._event.setOptions({ treatVertTouchDragAsPageScroll: true })
    }
  }

  /**
   * 事件信息兼容
   * @param {*} event
   * @param {*} compatY
   * @returns
   */
  _compatChartEvent (event, compatY) {
    if (compatY) {
      for (const id in this._paneContentSize) {
        if (Object.prototype.hasOwnProperty.call(this._paneContentSize, id)) {
          const size = this._paneContentSize[id]
          if (event.localY > size.contentTop && event.localY < size.contentBottom) {
            event.paneY = event.localY - size.contentTop
            event.paneId = id
            break
          }
        }
      }
    }
    event.localX -= this._chartContentLeftRight.contentLeft
    return event
  }

  /**
   * 检查事件是否在图表内容内
   * @param {*} event
   * @returns
   */
  _checkEventInChartContent (event) {
    return (event.localX > this._chartContentLeftRight.contentLeft && event.localX < this._chartContentLeftRight.contentRight) &&
      (event.localY > this._chartContentTopBottom.contentTop && event.localY < this._chartContentTopBottom.contentBottom)
  }

  setChartContentLeftRight (chartContentLeftRight) {
    this._chartContentLeftRight = chartContentLeftRight
  }

  setChartContentTopBottom (chartContentTopBottom) {
    this._chartContentTopBottom = chartContentTopBottom
  }

  setPaneContentSize (paneContentSize) {
    this._paneContentSize = paneContentSize
  }

  destroy () {
    this._event.destroy()
    this._target.removeEventListener('keydown', this._boundKeyBoardDownEvent)
    this._target.removeEventListener('contextmenu', this._boundContextMenuEvent)
  }
}
