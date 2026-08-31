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

import type Coordinate from '../common/Coordinate'
import type { MouseTouchEvent } from '../common/EventHandler'
import type Nullable from '../common/Nullable'
import type { XAxis } from '../component/XAxis'
import type DrawPane from '../pane/DrawPane'
import type XAxisPane from '../pane/XAxisPane'
import CrosshairVerticalLabelView from '../view/CrosshairVerticalLabelView'
import OverlayXAxisView from '../view/OverlayXAxisView'

import XAxisView from '../view/XAxisView'
import DrawWidget from './DrawWidget'
import { WidgetNameConstants } from './types'

export default class XAxisWidget extends DrawWidget<DrawPane<XAxis>> {
  private readonly _xAxisView = new XAxisView(this)
  private readonly _overlayXAxisView = new OverlayXAxisView(this)
  private readonly _crosshairVerticalLabelView = new CrosshairVerticalLabelView(this)

  private _xAxisStartScaleCoordinate: Nullable<Coordinate> = null
  private _xAxisStartScaleDistance = 0
  private _xAxisScale = 1

  constructor(rootContainer: HTMLElement, pane: DrawPane<XAxis>) {
    super(rootContainer, pane)
    this.setCursor('ew-resize')
    this.addChild(this._overlayXAxisView)
    this.registerEvent('mouseDownEvent', this._mouseDownEvent.bind(this)).registerEvent('pressedMouseMoveEvent', this._pressedMouseMoveEvent.bind(this)).registerEvent('mouseUpEvent', this._mouseUpEvent.bind(this))
  }

  override getName(): string {
    return WidgetNameConstants.X_AXIS
  }

  private _mouseDownEvent(event: MouseTouchEvent): boolean {
    this._xAxisStartScaleCoordinate = { x: event.x, y: event.y }
    this._xAxisStartScaleDistance = event.pageX
    return false
  }

  private _pressedMouseMoveEvent(event: MouseTouchEvent): boolean {
    const xAxis = (this.getPane() as unknown as XAxisPane).getXAxisComponent()
    if (xAxis.scrollZoomEnabled && this._xAxisStartScaleDistance !== 0) {
      const scale = this._xAxisStartScaleDistance / event.pageX
      if (Number.isFinite(scale)) {
        const zoomScale = (scale - this._xAxisScale) * 10
        this._xAxisScale = scale
        this.getPane().getChart().getChartStore().zoom(zoomScale, this._xAxisStartScaleCoordinate, 'xAxis')
      }
    }
    return false
  }

  private _mouseUpEvent(): boolean {
    this._xAxisStartScaleCoordinate = null
    this._xAxisStartScaleDistance = 0
    this._xAxisScale = 1
    return false
  }

  override updateMain(ctx: CanvasRenderingContext2D): void {
    this._xAxisView.draw(ctx)
  }

  override updateOverlay(ctx: CanvasRenderingContext2D): void {
    this._overlayXAxisView.draw(ctx)
    this._crosshairVerticalLabelView.draw(ctx)
  }
}
