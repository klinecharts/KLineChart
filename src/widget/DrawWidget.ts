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

import Axis from '../componentl/Axis'

import Widget from './Widget'

import { createDom } from '../utils/dom'
import { getPixelRatio } from '../utils/canvas'
import { requestAnimationFrame, cancelAnimationFrame } from '../utils/compatible'

const DEFAULT_REQUEST_ID = -1

export default abstract class DrawWidget<C extends Axis> extends Widget<C> {
  private _mainCanvas: HTMLCanvasElement
  private _mainCtx: CanvasRenderingContext2D
  private _overlayCanvas: HTMLCanvasElement
  private _overlayCtx: CanvasRenderingContext2D

  private _requestAnimationId: number = DEFAULT_REQUEST_ID

  protected getContainerStyle (): Partial<CSSStyleDeclaration> {
    return {
      margin: '0',
      padding: '0',
      position: 'absolute',
      top: '0',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }
  }

  protected initDom (container: HTMLElement): void {
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
    container.appendChild(this._mainCanvas)
    container.appendChild(this._overlayCanvas)
  }

  private _optimalUpdate (update: () => void): void {
    if (this._requestAnimationId !== DEFAULT_REQUEST_ID) {
      cancelAnimationFrame(this._requestAnimationId)
      this._requestAnimationId = DEFAULT_REQUEST_ID
    }
    this._requestAnimationId = requestAnimationFrame(() => {
      update()
    })
  }

  protected updateImp (level: UpdateLevel, container: HTMLElement, bounding: Bounding): void {
    const { width, height, left } = bounding
    container.style.left = `${left}px`

    const sizeFlag = width !== container.offsetWidth || height !== container.offsetHeight
    let l = level
    if (sizeFlag) {
      this._mainCtx.clearRect(0, 0, container.offsetWidth, container.offsetHeight)
      this._overlayCtx.clearRect(0, 0, container.offsetWidth, container.offsetHeight)

      const domWidth = `${width}px`
      const domHeight = `${height}px`

      container.style.width = domWidth
      container.style.height = domHeight

      const pixelRatio = getPixelRatio(this._mainCanvas)
      const scaleWidth = Math.floor(width * pixelRatio)
      const scaleHeight = Math.floor(height * pixelRatio)

      this._mainCanvas.style.width = domWidth
      this._mainCanvas.style.height = domHeight
      this._mainCanvas.width = scaleWidth
      this._mainCanvas.height = scaleHeight
      this._mainCtx.scale(pixelRatio, pixelRatio)

      this._overlayCanvas.style.width = domWidth
      this._overlayCanvas.style.height = domHeight
      this._overlayCanvas.width = scaleWidth
      this._overlayCanvas.height = scaleHeight
      this._mainCtx.scale(pixelRatio, pixelRatio)

      l = UpdateLevel.DRAWER
    }
    if (!sizeFlag) {
      if (l === UpdateLevel.ALL || l === UpdateLevel.DRAWER || l === UpdateLevel.MAIN) {
        this._mainCtx.clearRect(0, 0, width, height)
      }
      if (l === UpdateLevel.ALL || l === UpdateLevel.DRAWER || l === UpdateLevel.OVERLAY) {
        this._overlayCtx.clearRect(0, 0, width, height)
      }
    }
    switch (l) {
      case UpdateLevel.MAIN: {
        this._optimalUpdate(() => {
          this.updateMain(this._mainCtx, bounding)
        })
        break
      }
      case UpdateLevel.OVERLAY: {
        this._optimalUpdate(() => {
          this.updateMain(this._overlayCtx, bounding)
        })
        break
      }
      case UpdateLevel.DRAWER:
      case UpdateLevel.ALL: {
        this._optimalUpdate(() => {
          this.updateMain(this._mainCtx, bounding)
          this.updateMain(this._overlayCtx, bounding)
        })
        break
      }
    }
  }

  protected abstract updateMain (ctx: CanvasRenderingContext2D, bounding: Bounding): void
  protected abstract updateOverlay (ctx: CanvasRenderingContext2D, bounding: Bounding): void
}
