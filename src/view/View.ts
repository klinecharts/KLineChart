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

import Element from '../common/Element'
import ElementGroup from '../common/ElementGroup'

import { getPixelRatio } from '../common/utils/canvas'
import { createDom } from '../common/utils/dom'
import { cancelAnimationFrame, requestAnimationFrame } from '../common/utils/compatible'

export default abstract class View<E extends Element> extends ElementGroup<E> {
  private _canvas: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D
  private _requestAnimationId: number | null = null
  private _width: number
  private _height: number

  constructor (parent) {
    super()
    this._chartStore = chartStore
    this._initCanvas(container)
  }

  /**
   * 初始化画布
   * @param container
   * @private
   */
  private _initCanvas (container: HTMLElement): void {
    this._canvas = createDom<'canvas'>('canvas', {
      position: 'absolute',
      top: '0',
      left: '0',
      zIndex: '2',
      boxSizing: 'border-box'
    })
    this._ctx = this._canvas.getContext('2d') as CanvasRenderingContext2D
    container.appendChild(this._canvas)
  }

  /**
   * 重新绘制
   * @param extendFun
   * @private
   */
  private _redraw (extendFun?: () => void): void {
    this._ctx.clearRect(0, 0, this._canvas.offsetWidth, this._canvas.offsetHeight)
    extendFun?.()
    this.draw(this._ctx)
  }

  /**
   * 绘制
   */
  abstract draw (ctx: CanvasRenderingContext2D): void

  setWidth (width: number): View<E> {
    this._width = width
    return this
  }

  setHeight (height: number): View<E> {
    this._height = height
    return this
  }

  layout (): void {
    if (this._height !== this._canvas.offsetHeight || this._width !== this._canvas.offsetWidth) {
      this._redraw(() => {
        const pixelRatio = getPixelRatio(this._canvas)
        this._canvas.style.width = `${this._width}px`
        this._canvas.style.height = `${this._height}px`
        this._canvas.width = Math.floor(this._width * pixelRatio)
        this._canvas.height = Math.floor(this._height * pixelRatio)
        this._ctx.scale(pixelRatio, pixelRatio)
      })
    } else {
      this.flush()
    }
  }

  /**
   * 刷新
   */
  flush (): void {
    if (this._requestAnimationId != null) {
      cancelAnimationFrame(this._requestAnimationId)
      this._requestAnimationId = null
    }
    this._requestAnimationId = requestAnimationFrame(() => {
      this._redraw()
    })
  }

  /**
   * 获取图片
   * @returns {HTMLCanvasElement}
   */
  getImage (): HTMLCanvasElement {
    return this._canvas
  }
}
