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

export default class ZoomScrollEventHandler extends EventHandler {
  constructor (chartData) {
    super(chartData)
    // 开始滚动时坐标点
    this._startScrollPoint = {}
    // 开始触摸时坐标
    this._touchPoint = {}
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
      this._chartData.setCrossHairSeriesTag(null)
    }
  }

  mouseMoveEvent (event) {
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

  mouseWheelEvent (event) {
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
      const scale = Math.sign(deltaY) * Math.min(1, Math.abs(deltaY))
      this._chartData.zoom(scale, { x: event.localX, y: event.localY })
    }
  }

  mouseClickEvent (event) {
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

  mouseDownEvent (event) {
    this._startScrollPoint = { x: event.localX, y: event.localY }
    this._chartData.startScroll()
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

  pressedMouseMoveEvent (event) {
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
    const distance = event.localX - this._startScrollPoint.x
    this._chartData.setCrossHairPoint(crossHairPoint)
    this._chartData.scroll(distance)
  }

  longTapEvent (event) {
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
}
