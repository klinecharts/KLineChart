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

import DrawWidget from './DrawWidget'

import YAxis from '../componentl/YAxis'

import YAxisView from '../view/YAxisView'
import CandleLastPriceLabelView from '../view/CandleLastPriceLabelView'
import IndicatorLastValueView from '../view/IndicatorLastValueView'
import CrosshairHorizontalLabelView from '../view/CrosshairHorizontalLabelView'

export default class YAxisWidget extends DrawWidget<YAxis> {
  private readonly _yAxisView = new YAxisView(this)
  private readonly _candleLastPriceLabelView = new CandleLastPriceLabelView(this)
  private readonly _indicatorLastValueView = new IndicatorLastValueView(this)
  private readonly _crosshairHorizontalLabelView = new CrosshairHorizontalLabelView(this)

  protected updateMain (ctx: CanvasRenderingContext2D): void {
    this._yAxisView.draw(ctx)
    this._candleLastPriceLabelView.draw(ctx)
    this._indicatorLastValueView.draw(ctx)
  }

  protected updateOverlay (ctx: CanvasRenderingContext2D): void {
    this._crosshairHorizontalLabelView.draw(ctx)
  }
}
