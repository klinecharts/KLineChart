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
import { cancelAnimationFrame, DEFAULT_REQUEST_ID, requestAnimationFrame } from './utils/compatible'
import { createDom } from './utils/dom'
import { isValid } from './utils/typeChecks'

type DrawListener = () => void

let supportedDevicePixelContentBox: Promise<boolean> | null = null

async function isSupportedDevicePixelContentBox(): Promise<boolean> {
  supportedDevicePixelContentBox ??= new Promise((resolve: (val: boolean) => void) => {
    const ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      resolve(entries.every((entry) => isValid(entry.devicePixelContentBoxSize?.[0])))
      ro.disconnect()
    })
    ro.observe(document.body, { box: 'device-pixel-content-box' })
  }).catch(() => false)
  return await supportedDevicePixelContentBox
}

export default class Canvas {
  private readonly _element: HTMLCanvasElement
  private _resizeObserver: ResizeObserver | null = null
  private _mediaQueryList: MediaQueryList | null = null

  private readonly _ctx: CanvasRenderingContext2D

  private readonly _listener: DrawListener

  private _destroyed = false
  private _resizePending = false
  private _sizeInitialized = false

  private _width = 0
  private _height = 0

  private _pixelWidth = 0
  private _pixelHeight = 0

  private _nextPixelWidth = 0
  private _nextPixelHeight = 0

  private _requestAnimationId = DEFAULT_REQUEST_ID

  private readonly _mediaQueryListener: () => void = () => {
    if (!this._destroyed) {
      this._observePixelRatio()
      this._resize(getPixelRatio(this._element))
    }
  }

  constructor(style: Partial<CSSStyleDeclaration>, listener: DrawListener) {
    this._listener = listener
    this._element = createDom('canvas', style)
    this._ctx = this._element.getContext('2d')!
    isSupportedDevicePixelContentBox()
      .then((result) => {
        if (this._destroyed) {
          return
        }
        if (result) {
          this._resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            const entry = entries.find((entry: ResizeObserverEntry) => entry.target === this._element)
            const size = entry?.devicePixelContentBoxSize[0]
            if (this._sizeInitialized && isValid(size)) {
              this._nextPixelWidth = size.inlineSize
              this._nextPixelHeight = size.blockSize
              if (this._pixelWidth !== this._nextPixelWidth || this._pixelHeight !== this._nextPixelHeight) {
                this._scheduleDraw(true)
              }
            }
          })
          this._resizeObserver.observe(this._element, { box: 'device-pixel-content-box' })
        } else {
          this._observePixelRatio()
        }
      })
      .catch((_: unknown) => false)
  }

  private _observePixelRatio(): void {
    if (isValid(this._mediaQueryList)) {
      this._mediaQueryList.removeListener(this._mediaQueryListener)
    }
    const view = this._element.ownerDocument.defaultView
    this._mediaQueryList = view?.matchMedia(`(resolution: ${getPixelRatio(this._element)}dppx)`) ?? null
    this._mediaQueryList?.addListener(this._mediaQueryListener)
  }

  private _resize(pixelRatio: number): void {
    this._nextPixelWidth = Math.round(this._width * pixelRatio)
    this._nextPixelHeight = Math.round(this._height * pixelRatio)
    this._scheduleDraw(true)
  }

  private _scheduleDraw(resize = false): void {
    this._resizePending ||= resize
    if (this._requestAnimationId === DEFAULT_REQUEST_ID) {
      this._requestAnimationId = requestAnimationFrame(() => {
        this._requestAnimationId = DEFAULT_REQUEST_ID
        if (this._destroyed) {
          return
        }
        if (this._resizePending) {
          this._resizePending = false
          this._pixelWidth = this._nextPixelWidth
          this._pixelHeight = this._nextPixelHeight
          this._element.width = this._pixelWidth
          this._element.height = this._pixelHeight
        }
        this._ctx.setTransform(1, 0, 0, 1, 0, 0)
        this._ctx.clearRect(0, 0, this._pixelWidth, this._pixelHeight)
        this._ctx.save()
        if (this._width > 0 && this._height > 0) {
          this._ctx.scale(this._pixelWidth / this._width, this._pixelHeight / this._height)
        }
        try {
          this._listener()
        } finally {
          this._ctx.restore()
        }
      })
    }
  }

  update(w: number, h: number): void {
    if (!this._sizeInitialized || this._width !== w || this._height !== h) {
      this._sizeInitialized = true
      this._width = w
      this._height = h
      this._element.style.width = `${w}px`
      this._element.style.height = `${h}px`
      this._resize(getPixelRatio(this._element))
    } else {
      this._scheduleDraw()
    }
  }

  getElement(): HTMLCanvasElement {
    return this._element
  }

  getContext(): CanvasRenderingContext2D {
    return this._ctx
  }

  destroy(): void {
    this._destroyed = true
    if (this._requestAnimationId !== DEFAULT_REQUEST_ID) {
      cancelAnimationFrame(this._requestAnimationId)
      this._requestAnimationId = DEFAULT_REQUEST_ID
    }
    if (isValid(this._resizeObserver)) {
      this._resizeObserver.disconnect()
      this._resizeObserver = null
    }
    if (isValid(this._mediaQueryList)) {
      this._mediaQueryList.removeListener(this._mediaQueryListener)
      this._mediaQueryList = null
    }
  }
}
