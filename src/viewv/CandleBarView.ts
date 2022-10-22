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
import { CandleType, ChangeColor } from '../store/styles'
import { BarSpace } from '../store/TimeScaleStore'

import YAxis from '../componentl/YAxis'

import Widget from '../widget/Widget'

import ChildrenView from './ChildrenView'

export interface CandleBarOptions {
  type: CandleType
  styles: ChangeColor
}

export default class CandleBarView extends ChildrenView {
  private _candleBarOptions: TypeOrNull<CandleBarOptions> = null

  protected drawStart (ctx: CanvasRenderingContext2D, widget: Widget<YAxis>): void {
    super.drawStart(ctx, widget)
    const chartStore = widget.getPane().getChart().getChartStore()
    this._candleBarOptions = this.getCandleBarOptions(chartStore)
  }

  protected getCandleBarOptions (chartStore: ChartStore): TypeOrNull<CandleBarOptions> {
    const candleStyles = chartStore.getStyleOptions().candle
    return {
      type: candleStyles.type,
      styles: candleStyles.bar
    }
  }

  protected drawChild (ctx: CanvasRenderingContext2D, data: VisibleData, barSpace: BarSpace, index: number, totalCount: number, axis: YAxis): void {
    if (this._candleBarOptions !== null) {
      const { data: kLineData, x } = data
      this._drawCandleBar(ctx, axis, kLineData, x, barSpace)
    }
  }

  private _drawCandleBar (ctx: CanvasRenderingContext2D, axis: YAxis, kLineData: KLineData, x: number, barSpace: BarSpace): void {
    const { open, high, low, close } = kLineData
    const { halfGapBar, gapBar } = barSpace
    const { type, styles } = this._candleBarOptions as CandleBarOptions
    if (close > open) {
      const upColor = styles.upColor as string
      ctx.strokeStyle = upColor
      ctx.fillStyle = upColor
    } else if (close < open) {
      const downColor = styles.downColor as string
      ctx.strokeStyle = downColor
      ctx.fillStyle = downColor
    } else {
      const noChangeColor = styles.noChangeColor as string
      ctx.strokeStyle = noChangeColor
      ctx.fillStyle = noChangeColor
    }
    const openY = axis.convertToPixel(open)
    const closeY = axis.convertToPixel(close)
    const priceY = [
      openY, closeY,
      axis.convertToPixel(high),
      axis.convertToPixel(low)
    ]
    priceY.sort((a, b) => a - b)
    ctx.fillRect(x - 0.5, priceY[0], 1, priceY[1] - priceY[0])
    ctx.fillRect(x - 0.5, priceY[2], 1, priceY[3] - priceY[2])

    const barHeight = Math.max(1, priceY[2] - priceY[1])
    switch (type) {
      case CandleType.CANDLE_SOLID: {
        ctx.fillRect(x - halfGapBar, priceY[1], gapBar, barHeight)
        break
      }
      case CandleType.CANDLE_STROKE: {
        ctx.strokeRect(x - halfGapBar + 0.5, priceY[1], gapBar - 1, barHeight)
        break
      }
      case CandleType.CANDLE_UP_STROKE: {
        if (close > open) {
          ctx.strokeRect(x - halfGapBar + 0.5, priceY[1], gapBar - 1, barHeight)
        } else {
          ctx.fillRect(x - halfGapBar, priceY[1], gapBar, barHeight)
        }
        break
      }
      case CandleType.CANDLE_DOWN_STROKE: {
        if (close > open) {
          ctx.fillRect(x - halfGapBar, priceY[1], gapBar, barHeight)
        } else {
          ctx.strokeRect(x - halfGapBar + 0.5, priceY[1], gapBar - 1, barHeight)
        }
        break
      }
      default: {
        ctx.fillRect(x - 0.5, priceY[0], 1, priceY[3] - priceY[0])
        ctx.fillRect(x - halfGapBar, openY, halfGapBar, 1)
        ctx.fillRect(x, closeY, halfGapBar, 1)
        break
      }
    }
  }
}
