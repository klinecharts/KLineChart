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

import { getPixelRatio } from '../utils/canvas'
import { cancelAnimationFrame, requestAnimationFrame } from '../utils/compatible'

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
    this._canvas.style.right = '0'
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
    this._ctx.clearRect(0, 0, this._width, this._height)
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

  /**
   * 设置尺寸
   * @param width
   * @param height
   */
  setSize (width, height) {
    this._redraw(() => {
      const pixelRatio = getPixelRatio(this._ctx)
      this._width = width
      this._height = height
      this._canvas.style.top = '0'
      this._canvas.style.width = `${width}px`
      this._canvas.style.height = `${height}px`
      this._canvas.width = width * pixelRatio
      this._canvas.height = height * pixelRatio
      this._ctx.scale(pixelRatio, pixelRatio)
      // this._ctx.translate(0.5, 0.5)
    })
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
