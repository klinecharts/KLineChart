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

import { getPixelRatio } from './utils/canvas'
import { createDom } from './utils/dom'
import { isValid } from './utils/typeChecks'
import { requestAnimationFrame, DEFAULT_REQUEST_ID } from './utils/compatible'

type DrawListener = () => void

async function isSupportedDevicePixelContentBox (): Promise<boolean> {
  return await new Promise((resolve: (val: boolean) => void) => {
    const ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      resolve(entries.every(entry => 'devicePixelContentBoxSize' in entry))
      ro.disconnect()
    })
    ro.observe(document.body, { box: 'device-pixel-content-box' })
  }).catch(() => false)
}

export default class Canvas {
  private readonly _element: HTMLCanvasElement
  private _resizeObserver: ResizeObserver
  private _mediaQueryList: MediaQueryList

  private readonly _ctx: CanvasRenderingContext2D

  private readonly _listener: DrawListener

  private _supportedDevicePixelContentBox = false

  private _width = 0
  private _height = 0

  private _pixelWidth = 0
  private _pixelHeight = 0

  private _nextPixelWidth = 0
  private _nextPixelHeight = 0

  private _requestAnimationId = DEFAULT_REQUEST_ID

  private readonly _mediaQueryListener: () => void = () => {
    const pixelRatio = getPixelRatio(this._element)
    this._nextPixelWidth = Math.round(this._element.clientWidth * pixelRatio)
    this._nextPixelHeight = Math.round(this._element.clientHeight * pixelRatio)
    this._resetPixelRatio()
  }

  constructor (style: Partial<CSSStyleDeclaration>, listener: DrawListener) {
    this._listener = listener
    this._element = createDom('canvas', style)
    this._ctx = this._element.getContext('2d', { willReadFrequently: true })!
    isSupportedDevicePixelContentBox().then(result => {
      this._supportedDevicePixelContentBox = result
      if (result) {
        this._resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
          const entry = entries.find((entry: ResizeObserverEntry) => entry.target === this._element)
          const size = entry?.devicePixelContentBoxSize?.[0]
          if (isValid(size)) {
            this._nextPixelWidth = size.inlineSize
            this._nextPixelHeight = size.blockSize
            if (this._pixelWidth !== this._nextPixelWidth || this._pixelHeight !== this._nextPixelHeight) {
              this._resetPixelRatio()
            }
          }
        })
        this._resizeObserver.observe(this._element, { box: 'device-pixel-content-box' })
      } else {
        this._mediaQueryList = window.matchMedia(`(resolution: ${getPixelRatio(this._element)}dppx)`)
        this._mediaQueryList.addListener(this._mediaQueryListener)
      }
    }).catch(_ => false)
  }

  private _resetPixelRatio (): void {
    this._executeListener(() => {
      const width = this._element.clientWidth
      const height = this._element.clientHeight
      const horizontalPixelRatio = this._nextPixelWidth / width
      const verticalPixelRatio = this._nextPixelHeight / height
      this._width = width
      this._height = height
      this._pixelWidth = this._nextPixelWidth
      this._pixelHeight = this._nextPixelHeight
      this._element.width = this._nextPixelWidth
      this._element.height = this._nextPixelHeight
      this._ctx.scale(horizontalPixelRatio, verticalPixelRatio)
    })
  }

  private _executeListener (fn?: () => void): void {
    if (this._requestAnimationId === DEFAULT_REQUEST_ID) {
      this._requestAnimationId = requestAnimationFrame(() => {
        this._ctx.clearRect(0, 0, this._width, this._height)
        fn?.()
        this._listener()
        this._requestAnimationId = DEFAULT_REQUEST_ID
      })
    }
  }

  update (w: number, h: number): void {
    if (this._width !== w || this._height !== h) {
      this._element.style.width = `${w}px`
      this._element.style.height = `${h}px`
      if (!this._supportedDevicePixelContentBox) {
        const pixelRatio = getPixelRatio(this._element)
        this._nextPixelWidth = Math.round(w * pixelRatio)
        this._nextPixelHeight = Math.round(h * pixelRatio)
        this._resetPixelRatio()
      }
    } else {
      this._executeListener()
    }
  }

  getElement (): HTMLCanvasElement {
    return this._element
  }

  getContext (): CanvasRenderingContext2D {
    return this._ctx
  }

  destroy (): void {
    if (isValid(this._resizeObserver)) {
      this._resizeObserver.unobserve(this._element)
    }
    if (isValid(this._mediaQueryList)) {
      this._mediaQueryList.removeListener(this._mediaQueryListener)
    }
  }
}
