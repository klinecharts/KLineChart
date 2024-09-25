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
import { PaneState } from '../pane/types'

import type { YAxis } from '../component/YAxis'

import YAxisView from '../view/YAxisView'
import CandleLastPriceLabelView from '../view/CandleLastPriceLabelView'
import IndicatorLastValueView from '../view/IndicatorLastValueView'
import OverlayYAxisView from '../view/OverlayYAxisView'
import CrosshairHorizontalLabelView from '../view/CrosshairHorizontalLabelView'

export default class YAxisWidget extends DrawWidget<DrawPane<YAxis>> {
  private readonly _yAxisView = new YAxisView(this)
  private readonly _candleLastPriceLabelView = new CandleLastPriceLabelView(this)
  private readonly _indicatorLastValueView = new IndicatorLastValueView(this)
  private readonly _overlayYAxisView = new OverlayYAxisView(this)
  private readonly _crosshairHorizontalLabelView = new CrosshairHorizontalLabelView(this)

  constructor (rootContainer: HTMLElement, pane: DrawPane<YAxis>) {
    super(rootContainer, pane)
    this.getContainer().style.cursor = 'ns-resize'
    this.addChild(this._overlayYAxisView)
  }

  override getName (): string {
    return WidgetNameConstants.Y_AXIS
  }

  override updateMain (ctx: CanvasRenderingContext2D): void {
    const minimize = this.getPane().getOptions().state === PaneState.Minimize
    this._yAxisView.draw(ctx, minimize)
    if (!minimize) {
      if (this.getPane().getAxisComponent().isInCandle()) {
        this._candleLastPriceLabelView.draw(ctx)
      }
      this._indicatorLastValueView.draw(ctx)
    }
  }

  override updateOverlay (ctx: CanvasRenderingContext2D): void {
    if (this.getPane().getOptions().state !== PaneState.Minimize) {
      this._overlayYAxisView.draw(ctx)
      this._crosshairHorizontalLabelView.draw(ctx)
    }
  }
}
