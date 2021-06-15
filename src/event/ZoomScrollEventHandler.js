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
    this._chartData.zoom(zoomScale, middlePoint)
  }

  mouseLeaveEvent (event) {
    if (isMouse(event)) {
      this._chartData.setCrosshair()
    }
  }

  mouseMoveEvent (event) {
    if (!isMouse(event)) {
      return
    }
    this._performCross(event, false, cross => {
      this._chartData.setCrosshair({ x: event.localX, y: cross.y, paneId: cross.paneId })
    }, () => {
      this._chartData.setCrosshair()
    })
  }

  mouseWheelEvent (event) {
    if (!this._checkEventPointX(event.localX)) {
      return
    }
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      if (event.cancelable) {
        event.preventDefault()
      }
      if (Math.abs(event.deltaX) === 0) {
        return
      }
      this._chartData.startScroll()
      this._chartData.scroll(-event.deltaX)
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
        this._chartData.zoom(scale, { x: event.localX, y: event.localY })
      }
    }
  }

  mouseClickEvent (event) {
    this._performCross(event, true, cross => {
      if (!this._touchPoint && !this._touchCancelCrossHair && !this._touchZoomed) {
        this._touchPoint = { x: event.localX, y: event.localY }
        this._chartData.setCrosshair({ x: event.localX, y: cross.y, paneId: cross.paneId })
      }
    })
  }

  mouseDownEvent (event) {
    this._startScrollPoint = { x: event.localX, y: event.localY }
    this._chartData.startScroll()
    this._performCross(event, true, cross => {
      this._touchZoomed = false
      if (this._touchPoint) {
        const xDif = event.localX - this._touchPoint.x
        const yDif = event.localY - this._touchPoint.y
        const radius = Math.sqrt(xDif * xDif + yDif * yDif)
        if (radius < TOUCH_MIN_RADIUS) {
          this._touchPoint = { x: event.localX, y: event.localY }
          this._chartData.setCrosshair({ x: event.localX, y: cross.y, paneId: cross.paneId })
        } else {
          this._touchCancelCrossHair = true
          this._touchPoint = null
          this._chartData.setCrosshair()
        }
      } else {
        this._touchCancelCrossHair = false
      }
    })
  }

  pressedMouseMoveEvent (event) {
    this._performCross(event, false, cross => {
      let crosshair = { x: event.localX, y: cross.y, paneId: cross.paneId }
      if (isTouch(event)) {
        if (this._touchPoint) {
          this._touchPoint = { x: event.localX, y: event.localY }
          this._chartData.setCrosshair(crosshair)
          return
        } else {
          crosshair = null
        }
      }
      const distance = event.localX - this._startScrollPoint.x
      this._chartData.scroll(distance, crosshair)
    })
  }

  longTapEvent (event) {
    this._performCross(event, true, cross => {
      this._touchPoint = { x: event.localX, y: event.localY }
      this._chartData.setCrosshair({ x: event.localX, y: cross.y, paneId: cross.paneId })
    })
  }

  /**
   * 处理十字光标
   * @param event
   * @param checkTouchEvent
   * @param performFuc
   * @param extendFun
   * @private
   */
  _performCross (event, checkTouchEvent, performFuc, extendFun) {
    if (checkTouchEvent && !isTouch(event)) {
      return
    }
    if (!this._checkEventPointX(event.localX)) {
      if (extendFun) {
        extendFun()
      }
      return
    }
    let isPerform = false
    for (const paneId in this._paneContentSize) {
      const size = this._paneContentSize[paneId]
      if (event.localY > size.contentTop && event.localY < size.contentBottom) {
        isPerform = true
        if (performFuc) {
          performFuc({ paneId, y: event.localY - size.contentTop })
        }
        break
      }
    }
    if (!isPerform && extendFun) {
      extendFun()
    }
  }
}
