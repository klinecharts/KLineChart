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

import type Bounding from '../common/Bounding'
import { UpdateLevel } from '../common/Updater'
import Canvas from '../common/Canvas'

import type DrawPane from '../pane/DrawPane'

import Widget from './Widget'

import { createDom } from '../common/utils/dom'
import { getPixelRatio } from '../common/utils/canvas'

export default abstract class DrawWidget<P extends DrawPane = DrawPane> extends Widget<P> {
  private readonly _mainCanvas: Canvas
  private readonly _overlayCanvas: Canvas

  constructor (rootContainer: HTMLElement, pane: P) {
    super(rootContainer, pane)
    this._mainCanvas = new Canvas({
      position: 'absolute',
      top: '0',
      left: '0',
      zIndex: '2',
      boxSizing: 'border-box'
    }, () => {
      this.updateMain(this._mainCanvas.getContext())
    })
    this._overlayCanvas = new Canvas({
      position: 'absolute',
      top: '0',
      left: '0',
      zIndex: '2',
      boxSizing: 'border-box'
    }, () => {
      this.updateOverlay(this._overlayCanvas.getContext())
    })
    const container = this.getContainer()
    container.appendChild(this._mainCanvas.getElement())
    container.appendChild(this._overlayCanvas.getElement())
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

  override updateImp (container: HTMLElement, bounding: Bounding, level: UpdateLevel): void {
    const { width, height, left } = bounding
    container.style.left = `${left}px`

    let l = level
    const w = container.clientWidth
    const h = container.clientHeight
    if (width !== w || height !== h) {
      container.style.width = `${width}px`
      container.style.height = `${height}px`
      l = UpdateLevel.Drawer
    }
    switch (l) {
      case UpdateLevel.Main: {
        this._mainCanvas.update(width, height)
        break
      }
      case UpdateLevel.Overlay: {
        this._overlayCanvas.update(width, height)
        break
      }
      case UpdateLevel.Drawer:
      case UpdateLevel.All: {
        this._mainCanvas.update(width, height)
        this._overlayCanvas.update(width, height)
        break
      }
    }
  }

  destroy (): void {
    this._mainCanvas.destroy()
    this._overlayCanvas.destroy()
  }

  getImage (includeOverlay: boolean): HTMLCanvasElement {
    const { width, height } = this.getBounding()
    const canvas = createDom('canvas', {
      width: `${width}px`,
      height: `${height}px`,
      boxSizing: 'border-box'
    })
    const ctx = canvas.getContext('2d')!
    const pixelRatio = getPixelRatio(canvas)
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)

    ctx.drawImage(this._mainCanvas.getElement(), 0, 0, width, height)

    if (includeOverlay) {
      ctx.drawImage(this._overlayCanvas.getElement(), 0, 0, width, height)
    }
    return canvas
  }

  protected abstract updateMain (ctx: CanvasRenderingContext2D): void
  protected abstract updateOverlay (ctx: CanvasRenderingContext2D): void
}
