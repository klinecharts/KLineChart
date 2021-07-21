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

import EventHandler, { isMouse, isTouch } from './EventHandler'

const TOUCH_MIN_RADIUS = 10

export default class ZoomScrollEventHandler extends EventHandler {
  constructor (chartData) {
    super(chartData)
    // 开始滚动时坐标点
    this._startScrollPoint = {}
    // 开始触摸时坐标
    this._touchPoint = null
    // 是否是取消了十字光标
    this._touchCancelCrossHair = false
    // 是否缩放过
    this._touchZoomed = false
    // 用来记录捏合缩放的尺寸
    this._pinchScale = 1
  }

  pinchStartEvent () {
    this._pinchScale = 1
    this._touchZoomed = true
  }

  pinchEvent (middlePoint, scale) {
    const zoomScale = (scale - this._pinchScale) * 5
    this._pinchScale = scale
    this._chartData.timeScaleStore().zoom(zoomScale, middlePoint)
  }

  mouseLeaveEvent (event) {
    if (isMouse(event)) {
      this._chartData.crosshairStore().set()
    }
  }

  mouseMoveEvent (event) {
    if (!isMouse(event)) {
      return
    }
    this._chartData.crosshairStore().set({ x: event.localX, y: event.paneY, paneId: event.paneId })
  }

  mouseWheelEvent (event) {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      if (event.cancelable) {
        event.preventDefault()
      }
      if (Math.abs(event.deltaX) === 0) {
        return
      }
      this._chartData.timeScaleStore().startScroll()
      this._chartData.timeScaleStore().scroll(-event.deltaX)
    } else {
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
        const scale = Math.sign(deltaY) * Math.min(1, Math.abs(deltaY))
        this._chartData.timeScaleStore().zoom(scale, { x: event.localX, y: event.localY })
      }
    }
  }

  mouseClickEvent (event) {
    if (!isTouch(event)) {
      return
    }
    if (!this._touchPoint && !this._touchCancelCrossHair && !this._touchZoomed) {
      this._touchPoint = { x: event.localX, y: event.localY }
      this._chartData.crosshairStore().set({ x: event.localX, y: event.paneY, paneId: event.paneId })
    }
  }

  mouseDownEvent (event) {
    this._startScrollPoint = { x: event.localX, y: event.localY }
    this._chartData.timeScaleStore().startScroll()
    if (isTouch(event)) {
      this._touchZoomed = false
      if (this._touchPoint) {
        const xDif = event.localX - this._touchPoint.x
        const yDif = event.localY - this._touchPoint.y
        const radius = Math.sqrt(xDif * xDif + yDif * yDif)
        if (radius < TOUCH_MIN_RADIUS) {
          this._touchPoint = { x: event.localX, y: event.localY }
          this._chartData.crosshairStore().set({ x: event.localX, y: event.paneY, paneId: event.paneId })
        } else {
          this._touchCancelCrossHair = true
          this._touchPoint = null
          this._chartData.crosshairStore().set()
        }
      } else {
        this._touchCancelCrossHair = false
      }
    }
  }

  pressedMouseMoveEvent (event) {
    let crosshair = { x: event.localX, y: event.paneY, paneId: event.paneId }
    if (isTouch(event)) {
      if (this._touchPoint) {
        this._touchPoint = { x: event.localX, y: event.localY }
        this._chartData.crosshairStore().set(crosshair)
        return
      } else {
        crosshair = null
      }
    }
    const distance = event.localX - this._startScrollPoint.x
    this._chartData.timeScaleStore().scroll(distance, crosshair)
  }

  longTapEvent (event) {
    if (!isTouch(event)) {
      return
    }
    this._touchPoint = { x: event.localX, y: event.localY }
    this._chartData.crosshairStore().set({ x: event.localX, y: event.paneY, paneId: event.paneId })
  }
}
