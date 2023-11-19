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

import Bounding from '../common/Bounding'
import { UpdateLevel } from '../common/Updater'

import DrawPane from '../pane/DrawPane'

import Widget from './Widget'

import { createDom } from '../common/utils/dom'
import { getPixelRatio } from '../common/utils/canvas'
import { requestAnimationFrame, cancelAnimationFrame } from '../common/utils/compatible'

const DEFAULT_REQUEST_ID = -1

export default abstract class DrawWidget<P extends DrawPane = DrawPane> extends Widget<P> {
  private _mainCanvas: HTMLCanvasElement
  private _mainCtx: CanvasRenderingContext2D
  private _overlayCanvas: HTMLCanvasElement
  private _overlayCtx: CanvasRenderingContext2D

  private _mainRequestAnimationId: number = DEFAULT_REQUEST_ID
  private _overlayRequestAnimationId: number = DEFAULT_REQUEST_ID

  override init (rootContainer: HTMLElement): void {
    super.init(rootContainer)
    this._mainCanvas = createDom('canvas', {
      position: 'absolute',
      top: '0',
      left: '0',
      zIndex: '2',
      boxSizing: 'border-box'
    })
    this._mainCtx = this._mainCanvas.getContext('2d') as CanvasRenderingContext2D
    this._overlayCanvas = createDom('canvas', {
      position: 'absolute',
      top: '0',
      left: '0',
      zIndex: '2',
      boxSizing: 'border-box'
    })
    this._overlayCtx = this._overlayCanvas.getContext('2d') as CanvasRenderingContext2D
    const container = this.getContainer()
    container.appendChild(this._mainCanvas)
    container.appendChild(this._overlayCanvas)
  }

  override createContainer (): HTMLElement {
    return createDom('div', {
      margin: '0',
      padding: '0',
      position: 'absolute',
      top: '0',
      overflow: 'hidden',
      boxSizing: 'border-box',
      zIndex: '1'
    })
  }

  private _optimalUpdateMain (width: number, height: number): void {
    if (this._mainRequestAnimationId !== DEFAULT_REQUEST_ID) {
      cancelAnimationFrame(this._mainRequestAnimationId)
      this._mainRequestAnimationId = DEFAULT_REQUEST_ID
    }
    this._mainRequestAnimationId = requestAnimationFrame(() => {
      if (width !== this._mainCanvas.offsetWidth || height !== this._mainCanvas.offsetHeight) {
        this._mainCtx.clearRect(0, 0, this._mainCanvas.offsetWidth, this._mainCanvas.offsetHeight)

        const pixelRatio = getPixelRatio(this._mainCanvas)
        const scaleWidth = Math.floor(width * pixelRatio)
        const scaleHeight = Math.floor(height * pixelRatio)

        this._mainCanvas.style.width = `${width}px`
        this._mainCanvas.style.height = `${height}px`
        this._mainCanvas.width = scaleWidth
        this._mainCanvas.height = scaleHeight
        this._mainCtx.scale(pixelRatio, pixelRatio)
      } else {
        this._mainCtx.clearRect(0, 0, this._mainCanvas.offsetWidth, this._mainCanvas.offsetHeight)
      }
      this.updateMain(this._mainCtx)
    })
  }

  private _optimalUpdateOverlay (width: number, height: number): void {
    if (this._overlayRequestAnimationId !== DEFAULT_REQUEST_ID) {
      cancelAnimationFrame(this._overlayRequestAnimationId)
      this._overlayRequestAnimationId = DEFAULT_REQUEST_ID
    }
    this._overlayRequestAnimationId = requestAnimationFrame(() => {
      if (width !== this._overlayCanvas.offsetWidth || height !== this._overlayCanvas.offsetHeight) {
        this._overlayCtx.clearRect(0, 0, this._overlayCanvas.offsetWidth, this._overlayCanvas.offsetHeight)

        const pixelRatio = getPixelRatio(this._overlayCanvas)
        const scaleWidth = Math.floor(width * pixelRatio)
        const scaleHeight = Math.floor(height * pixelRatio)

        this._overlayCanvas.style.width = `${width}px`
        this._overlayCanvas.style.height = `${height}px`
        this._overlayCanvas.width = scaleWidth
        this._overlayCanvas.height = scaleHeight
        this._overlayCtx.scale(pixelRatio, pixelRatio)
      } else {
        this._overlayCtx.clearRect(0, 0, this._overlayCanvas.offsetWidth, this._overlayCanvas.offsetHeight)
      }
      this.updateOverlay(this._overlayCtx)
    })
  }

  override updateImp (container: HTMLElement, bounding: Bounding, level: UpdateLevel): void {
    const { width, height, left } = bounding
    container.style.left = `${left}px`

    let l = level
    if (width !== container.offsetWidth || height !== container.offsetHeight) {
      container.style.width = `${width}px`
      container.style.height = `${height}px`
      l = UpdateLevel.Drawer
    }
    switch (l) {
      case UpdateLevel.Main: {
        this._optimalUpdateMain(width, height)
        break
      }
      case UpdateLevel.Overlay: {
        this._optimalUpdateOverlay(width, height)
        break
      }
      case UpdateLevel.Drawer:
      case UpdateLevel.All: {
        this._optimalUpdateMain(width, height)
        this._optimalUpdateOverlay(width, height)
        break
      }
    }
  }

  getImage (includeOverlay: boolean): HTMLCanvasElement {
    const { width, height } = this.getBounding()
    const canvas = createDom('canvas', {
      width: `${width}px`,
      height: `${height}px`,
      boxSizing: 'border-box'
    })
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const pixelRatio = getPixelRatio(canvas)
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)

    ctx.drawImage(this._mainCanvas, 0, 0, width, height)

    if (includeOverlay) {
      ctx.drawImage(this._overlayCanvas, 0, 0, width, height)
    }
    return canvas
  }

  protected abstract updateMain (ctx: CanvasRenderingContext2D): void
  protected abstract updateOverlay (ctx: CanvasRenderingContext2D): void
}
