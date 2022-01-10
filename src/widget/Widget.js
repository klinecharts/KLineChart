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

import InvalidateLevel from '../enum/InvalidateLevel'
import { getPixelRatio } from '../utils/canvas'
import { createElement } from '../utils/element'
import { isString } from '../utils/typeChecks'

export default class Widget {
  constructor (props) {
    this._width = 0
    this._height = 0
    this._initElement(props.container)
    this._mainView = this._createMainView(this._element, props)
    this._overlayView = this._createOverlayView(this._element, props)
    this._htmlBaseId = 0
    this._htmls = new Map()
  }

  /**
   * 初始化element
   * @param container
   * @private
   */
  _initElement (container) {
    this._element = createElement('div', {
      margin: '0',
      padding: '0',
      position: 'absolute',
      top: '0',
      overflow: 'hidden',
      boxSizing: 'border-box'
    })
    container.appendChild(this._element)
  }

  /**
   * 创建主view
   * @param container
   * @param props
   * @private
   */
  _createMainView (container, props) {}

  /**
   * 创建浮层view
   * @param container
   * @param props
   * @private
   */
  _createOverlayView (container, props) {}

  /**
   * 创建html元素
   * @param id 标识
   * @param content 内容
   * @param style 样式
   */
  createHtml ({ id, content, style = {} }) {
    const html = createElement('div', { boxSizing: 'border-box', position: 'absolute', zIndex: 12, ...style })
    if (isString(content)) {
      const str = content.replace(/(^\s*)|(\s*$)/g, '')
      html.innerHTML = str
    } else {
      html.appendChild(content)
    }
    const htmlId = id || `html_${++this._htmlBaseId}`
    if (this._htmls.has(htmlId)) {
      this._element.replaceChild(html, this._htmls.get(htmlId))
    } else {
      this._element.appendChild(html)
    }
    this._htmls.set(htmlId, html)
    return htmlId
  }

  /**
   * 移除html元素
   * @param id
   */
  removeHtml (id) {
    if (id) {
      const ids = [].concat(id)
      ids.forEach(htmlId => {
        const html = this._htmls.get(htmlId)
        if (html) {
          this._element.removeChild(html)
          this._htmls.delete(htmlId)
        }
      })
    } else {
      this._htmls.forEach(html => {
        this._element.removeChild(html)
      })
      this._htmls.clear()
    }
  }

  getElement () {
    return this._element
  }

  setWidth (width) {
    this._width = width
    this._mainView.setWidth(width)
    this._overlayView.setWidth(width)
  }

  setHeight (height) {
    this._height = height
    this._mainView.setHeight(height)
    this._overlayView.setHeight(height)
  }

  setOffsetLeft (offsetLeft) {
    this._element.style.left = `${offsetLeft}px`
  }

  layout () {
    if (this._element.offsetWidth !== this._width) {
      this._element.style.width = `${this._width}px`
    }
    if (this._element.offsetHeight !== this._height) {
      this._element.style.height = `${this._height}px`
    }
    this._mainView.layout()
    this._overlayView.layout()
  }

  /**
   * 更新
   * @param level
   */
  invalidate (level) {
    switch (level) {
      case InvalidateLevel.OVERLAY: {
        this._overlayView.flush()
        break
      }
      case InvalidateLevel.MAIN:
      case InvalidateLevel.FULL: {
        this._mainView.flush()
        this._overlayView.flush()
        break
      }
      default: {
        break
      }
    }
  }

  /**
   * 将widget转换成图片
   * @param includeOverlay
   * @returns {HTMLCanvasElement}
   */
  getImage (includeOverlay) {
    const canvas = createElement('canvas', {
      width: `${this._width}px`,
      height: `${this._height}px`,
      boxSizing: 'border-box'
    })
    const ctx = canvas.getContext('2d')
    const pixelRatio = getPixelRatio(canvas)
    canvas.width = this._width * pixelRatio
    canvas.height = this._height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)

    ctx.drawImage(this._mainView.getImage(), 0, 0, this._width, this._height)

    if (includeOverlay && this._overlayView) {
      ctx.drawImage(this._overlayView.getImage(), 0, 0, this._width, this._height)
    }
    return canvas
  }
}
