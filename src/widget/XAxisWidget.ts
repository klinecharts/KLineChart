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

import Nullable from '../common/Nullable'
import Coordinate from '../common/Coordinate'
import { UpdateLevel } from '../common/Updater'
import { EventOptions, MouseTouchEvent } from '../common/MouseTouchEventHandler'

import Pane from '../pane/Pane'

import DrawWidget from './DrawWidget'

import XAxis from '../component/XAxis'

import XAxisView from '../view/XAxisView'
import OverlayXAxisView from '../view/OverlayXAxisView'
import CrosshairVerticalLabelView from '../view/CrosshairVerticalLabelView'

export default class XAxisWidget extends DrawWidget<XAxis> {
  private readonly _xAxisView = new XAxisView(this)
  private readonly _overlayXAxisView = new OverlayXAxisView(this)
  private readonly _crosshairVerticalLabelView = new CrosshairVerticalLabelView(this)

  private _startScaleCoordinate: Nullable<Coordinate> = null
  private _startScaleDistance = 0
  private _scale = 1

  constructor (rootContainer: HTMLElement, pane: Pane<XAxis>) {
    super(rootContainer, pane)
    this.getEventContainer().style.cursor = 'ew-resize'
  }

  mouseUpEvent (event: MouseTouchEvent): void {
    if (this.dispatchEvent('touchMoseUpEvent', event)) {
      const pane = this.getPane()
      pane.getChart().updatePane(UpdateLevel.OVERLAY)
    }
    this._startScaleCoordinate = null
    this._startScaleDistance = 0
    this._scale = 1
  }

  mouseMoveEvent (event: MouseTouchEvent): void {
    if (this.dispatchEvent('mouseMoveEvent', event)) {
      this.getPane().getChart().updatePane(UpdateLevel.OVERLAY)
    }
  }

  mouseDownEvent (event: MouseTouchEvent): void {
    if (this.dispatchEvent('touchMouseDownEvent', event)) {
      const pane = this.getPane()
      pane.getChart().updatePane(UpdateLevel.OVERLAY)
    }
    this._startScaleCoordinate = { x: event.x, y: event.y }
    this._startScaleDistance = event.x
  }

  mouseRightClickEvent (event: MouseTouchEvent): void {
    if (this.dispatchEvent('mouseRightClickEvent', event)) {
      this.getPane().getChart().updatePane(UpdateLevel.OVERLAY)
    }
  }

  pressedMouseMoveEvent (event: MouseTouchEvent): void {
    const pane = this.getPane()
    const chart = pane.getChart()
    if (!this.dispatchEvent('pressedTouchMouseMoveEvent', event)) {
      const bounding = this.getBounding()
      if (event.x > 0 && event.x < bounding.width && event.y > 0 && event.y < bounding.height) {
        const scale = this._startScaleDistance / event.x
        const zoomScale = (scale - this._scale) * 10
        this._scale = scale
        chart.getChartStore().getTimeScaleStore().zoom(zoomScale, this._startScaleCoordinate ?? undefined)
      }
    } else {
      chart.updatePane(UpdateLevel.OVERLAY)
    }
  }

  touchStartEvent (event: MouseTouchEvent): void {
    if (this.dispatchEvent('touchMouseDownEvent', event)) {
      this.getPane().getChart().updatePane(UpdateLevel.OVERLAY)
    }
  }

  touchMoveEvent (event: MouseTouchEvent): void {
    if (this.dispatchEvent('pressedTouchMouseMoveEvent', event)) {
      event.preventDefault()
      this.getPane().getChart().updatePane(UpdateLevel.OVERLAY)
    }
  }

  touchEndEvent (event: MouseTouchEvent): void {
    if (this.dispatchEvent('touchMouseUpEvent', event)) {
      this.getPane().getChart().updatePane(UpdateLevel.OVERLAY)
    }
  }

  protected getEventOptions (): EventOptions {
    return {
      treatVertTouchDragAsPageScroll: () => true,
      treatHorzTouchDragAsPageScroll: () => false
    }
  }

  protected updateMain (ctx: CanvasRenderingContext2D): void {
    this._xAxisView.draw(ctx)
  }

  protected updateOverlay (ctx: CanvasRenderingContext2D): void {
    this._overlayXAxisView.draw(ctx)
    this._crosshairVerticalLabelView.draw(ctx)
  }
}
