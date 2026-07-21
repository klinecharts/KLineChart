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

import type { YAxis } from '../component/YAxis'
import type DrawPane from '../pane/DrawPane'
import CandleLastPriceLabelView from '../view/CandleLastPriceLabelView'
import CrosshairHorizontalLabelView from '../view/CrosshairHorizontalLabelView'
import IndicatorLastValueView from '../view/IndicatorLastValueView'
import OverlayYAxisView from '../view/OverlayYAxisView'
import YAxisView from '../view/YAxisView'
import DrawWidget from './DrawWidget'
import { WidgetNameConstants } from './types'

export default class YAxisWidget extends DrawWidget<DrawPane<YAxis>> {
  private readonly _yAxis: YAxis
  private readonly _yAxisView = new YAxisView(this)
  private readonly _candleLastPriceLabelView = new CandleLastPriceLabelView(this)
  private readonly _indicatorLastValueView = new IndicatorLastValueView(this)
  private readonly _overlayYAxisView = new OverlayYAxisView(this)
  private readonly _crosshairHorizontalLabelView = new CrosshairHorizontalLabelView(this)

  constructor(rootContainer: HTMLElement, pane: DrawPane<YAxis>, yAxis: YAxis) {
    super(rootContainer, pane)
    this._yAxis = yAxis
    this.setCursor('ns-resize')
    this.addChild(this._overlayYAxisView)
  }

  getAxisComponent(): YAxis {
    return this._yAxis
  }

  override getName(): string {
    return WidgetNameConstants.Y_AXIS
  }

  override updateMain(ctx: CanvasRenderingContext2D): void {
    this._yAxisView.draw(ctx)
    const pane = this.getPane()
    const isCandleLastPriceLabelVisibleYAxis = pane.isDefaultYAxis(this._yAxis.id) || pane.isManualYAxis(this._yAxis.id)
    if (isCandleLastPriceLabelVisibleYAxis && this.getAxisComponent().isInCandle()) {
      this._candleLastPriceLabelView.draw(ctx)
    }
    this._indicatorLastValueView.draw(ctx)
  }

  override updateOverlay(ctx: CanvasRenderingContext2D): void {
    this._overlayYAxisView.draw(ctx)
    this._crosshairHorizontalLabelView.draw(ctx)
  }
}
