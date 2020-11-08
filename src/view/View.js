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

import { getPixelRatio } from '../utils/canvas'
import { cancelAnimationFrame, requestAnimationFrame } from '../utils/compatible'

/**
 * 绘制类型
 * @type {{BAR: string, LINE: string, CUSTOM: string, CIRCLE: string}}
 */
export const PlotType = {
  LINE: 'line',
  BAR: 'bar',
  CIRCLE: 'circle'
}

class View {
  constructor (container, chartData) {
    this._chartData = chartData
    this._initCanvas(container)
  }

  /**
   * 初始化画布
   * @param container
   * @private
   */
  _initCanvas (container) {
    this._canvas = document.createElement('canvas')
    this._canvas.style.position = 'absolute'
    this._canvas.style.top = '0'
    this._canvas.style.left = '0'
    this._canvas.style.zIndex = '2'
    this._ctx = this._canvas.getContext('2d')
    container.appendChild(this._canvas)
  }

  /**
   * 重新绘制
   * @param extendFun
   * @private
   */
  _redraw (extendFun) {
    this._ctx.clearRect(0, 0, this._canvas.offsetWidth, this._canvas.offsetHeight)
    if (extendFun) {
      extendFun()
    }
    this._draw()
  }

  /**
   * 绘制
   */
  _draw () {
  }

  setWidth (width) {
    this._width = width
  }

  setHeight (height) {
    this._height = height
  }

  layout () {
    if (this._height !== this._canvas.offsetHeight || this._width !== this._canvas.offsetWidth) {
      this._redraw(() => {
        const pixelRatio = getPixelRatio(this._canvas)
        this._canvas.style.width = `${this._width}px`
        this._canvas.style.height = `${this._height}px`
        this._canvas.width = this._width * pixelRatio
        this._canvas.height = this._height * pixelRatio
        this._ctx.scale(pixelRatio, pixelRatio)
      })
    } else {
      this.flush()
    }
  }

  /**
   * 刷新
   */
  flush () {
    if (this.requestAnimationId) {
      cancelAnimationFrame(this.requestAnimationId)
    }
    this.requestAnimationId = requestAnimationFrame(() => {
      this._redraw()
    })
  }

  /**
   * 获取图片
   * @returns {HTMLCanvasElement}
   */
  getImage () {
    return this._canvas
  }
}

export default View
