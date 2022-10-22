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

import TypeOrNull from '../common/TypeOrNull'
import ElementGroup from '../common/ElementGroup'
import KLineData from '../common/KLineData'

import ChartStore, { VisibleData } from '../store/ChartStore'
import { BarSpace } from '../store/TimeScaleStore'

import YAxis from '../componentl/YAxis'

import Widget from '../widget/Widget'

import CandleBarView, { CandleBarOptions } from './CandleBarView'

export default class IndicatorView extends CandleBarView {
  protected getCandleBarOptions (chartStore: ChartStore): TypeOrNull<CandleBarOptions> {
    const candleStyles = chartStore.getStyleOptions().candle
    return {
      type: candleStyles.type,
      styles: candleStyles.bar
    }
  }

  protected drawChild (ctx: CanvasRenderingContext2D, data: VisibleData, barSpace: BarSpace, index: number, totalCount: number, axis: YAxis): void {
    super.drawChild(ctx, data, barSpace, index, totalCount, axis)
  }
}
