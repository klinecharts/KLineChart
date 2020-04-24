/**
 * Copyright (c) 2019 lihu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
