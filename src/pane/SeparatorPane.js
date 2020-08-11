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

import EventBase from '../event/EventBase'
import { getPixelRatio } from '../utils/canvas'

export default class SeparatorPane {
  constructor (container, chartData, paneIndex, dragEnabled, dragEventHandler) {
    this._chartData = chartData
    this._paneIndex = paneIndex
    this._width = 0
    this._offsetLeft = 0
    this._dragEventHandler = dragEventHandler
    this._initElement(container, dragEnabled)
  }

  _initElement (container, dragEnabled) {
    this._container = container
    this._wrapper = this._createElement()
    this._wrapper.style.overflow = 'hidden'
    this._element = this._createElement()
    this._element.style.width = '100%'
    this._element.style.position = 'absolute'
    this._element.style.zIndex = '20'
    this._element.style.height = '5px'
    if (dragEnabled) {
      this._element.style.cursor = 'ns-resize'
      this._dragEvent = new EventBase(this._element, {
        mouseDownEvent: this._mouseDownEvent.bind(this),
        pressedMouseMoveEvent: this._pressedMouseMoveEvent.bind(this)
      }, {
        treatVertTouchDragAsPageScroll: false,
        treatHorzTouchDragAsPageScroll: true
      })
    }
    this._wrapper.appendChild(this._element)
    const lastElement = container.lastChild
    if (lastElement) {
      container.insertBefore(this._wrapper, lastElement)
    } else {
      container.appendChild(this._wrapper)
    }
  }

  /**
   * 创建div节点
   * @private
   */
  _createElement () {
    const element = document.createElement('div')
    element.style.margin = '0'
    element.style.padding = '0'
    return element
  }

  _mouseDownEvent (event) {
    this._startY = event.pageY
    this._dragEventHandler.startDrag(this._paneIndex)
  }

  _pressedMouseMoveEvent (event) {
    const dragDistance = event.pageY - this._startY
    this._dragEventHandler.drag(dragDistance, this._paneIndex)
  }

  /**
   * 获取高度
   * @returns {number}
   */
  height () {
    return this._wrapper.offsetHeight
  }

  /**
   * 设置尺寸
   * 用于fill属性
   * @param offsetLeft
   * @param width
   */
  setSize (offsetLeft, width) {
    this._offsetLeft = offsetLeft
    this._width = width
    this.invalidate()
  }

  /**
   * 更新上下两个图表的索引
   * @param paneIndex
   */
  updatePaneIndex (paneIndex) {
    this._paneIndex = paneIndex
  }

  /**
   * 刷新
   */
  invalidate () {
    const separator = this._chartData.styleOptions().separator
    this._wrapper.style.backgroundColor = separator.color
    this._wrapper.style.height = `${separator.size}px`
    this._wrapper.style.marginLeft = `${separator.fill ? 0 : this._offsetLeft}px`
    this._wrapper.style.width = separator.fill ? '100%' : `${this._width}px`
  }

  /**
   * 将图形转换成图片
   * @returns {HTMLCanvasElement}
   */
  getImage () {
    const separator = this._chartData.styleOptions().separator
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const pixelRatio = getPixelRatio(canvas)
    const width = this._wrapper.offsetWidth
    const height = separator.size
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)
    ctx.fillStyle = separator.color
    ctx.fillRect(this._offsetLeft, 0, width, height)
    return canvas
  }

  /**
   * 销毁
   */
  destroy () {
    if (this._dragEvent) {
      this._dragEvent.destroy()
    }
    this._container.removeChild(this._wrapper)
    delete this
  }
}
