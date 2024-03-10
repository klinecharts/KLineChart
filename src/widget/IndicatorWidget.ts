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

import type DrawPane from '../pane/DrawPane'

import { WidgetNameConstants } from './types'
import DrawWidget from './DrawWidget'

import type YAxis from '../component/YAxis'

import GridView from '../view/GridView'
import IndicatorView from '../view/IndicatorView'
import CrosshairLineView from '../view/CrosshairLineView'
import IndicatorTooltipView from '../view/IndicatorTooltipView'
import OverlayView from '../view/OverlayView'

export default class IndicatorWidget extends DrawWidget<DrawPane<YAxis>> {
  private readonly _gridView = new GridView(this)
  private readonly _indicatorView = new IndicatorView(this)
  private readonly _crosshairLineView = new CrosshairLineView(this)
  private readonly _tooltipView = this.createTooltipView()
  private readonly _overlayView = new OverlayView(this)

  constructor (rootContainer: HTMLElement, pane: DrawPane<YAxis>) {
    super(rootContainer, pane)
    this.addChild(this._tooltipView)
    this.addChild(this._overlayView)
    this.getContainer().style.cursor = 'crosshair'
    this.registerEvent('mouseMoveEvent', () => {
      pane.getChart().getChartStore().getTooltipStore().setActiveIcon()
      return false
    })
  }

  getName (): string {
    return WidgetNameConstants.MAIN
  }

  protected updateMain (ctx: CanvasRenderingContext2D): void {
    this.updateMainContent(ctx)
    this._indicatorView.draw(ctx)
    this._gridView.draw(ctx)
  }

  protected createTooltipView (): IndicatorTooltipView {
    return new IndicatorTooltipView(this)
  }

  protected updateMainContent (_ctx: CanvasRenderingContext2D): void {}

  override updateOverlay (ctx: CanvasRenderingContext2D): void {
    this._overlayView.draw(ctx)
    this._crosshairLineView.draw(ctx)
    this._tooltipView.draw(ctx)
  }
}
