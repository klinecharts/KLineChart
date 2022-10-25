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

import ChartStore, { VisibleData } from '../store/ChartStore'
import { CandleType, ChangeColor } from '../store/styles'
import { BarSpace } from '../store/TimeScaleStore'

import Axis from '../componentl/Axis'

import { RectAttrs } from '../template/figure/rect'

import ChildrenView from './ChildrenView'

export interface CandleBarOptions {
  type: Exclude<CandleType, 'area'>
  styles: Required<ChangeColor>
}

export default class CandleBarView extends ChildrenView {
  protected drawImp (ctx: CanvasRenderingContext2D): void {
    const pane = this.getWidget().getPane()
    const chartStore = pane.getChart().getChartStore()
    const candleBarOptions = this.getCandleBarOptions(chartStore)
    if (candleBarOptions !== null) {
      const yAxis = pane.getAxisComponent()
      this.eachChildren((data: VisibleData, barSpace: BarSpace) => {
        this._drawCandleBar(ctx, yAxis, data, barSpace, candleBarOptions)
      })
    }
  }

  protected getCandleBarOptions (chartStore: ChartStore): TypeOrNull<CandleBarOptions> {
    const candleStyles = chartStore.getStyleOptions().candle
    return {
      type: candleStyles.type as Exclude<CandleType, 'area'>,
      styles: candleStyles.bar
    }
  }

  private _drawCandleBar (ctx: CanvasRenderingContext2D, axis: Axis, data: VisibleData, barSpace: BarSpace, candleBarOptions: CandleBarOptions): void {
    const { data: kLineData, x } = data
    const { open, high, low, close } = kLineData
    const { halfGapBar, gapBar } = barSpace
    const { type, styles } = candleBarOptions
    let color: string
    if (close > open) {
      color = styles.upColor
    } else if (close < open) {
      color = styles.downColor
    } else {
      color = styles.noChangeColor
    }
    const openY = axis.convertToPixel(open)
    const closeY = axis.convertToPixel(close)
    const priceY = [
      openY, closeY,
      axis.convertToPixel(high),
      axis.convertToPixel(low)
    ]
    priceY.sort((a, b) => a - b)

    const barHeight = Math.max(1, priceY[2] - priceY[1])

    let rects: RectAttrs[] = []
    if (type !== CandleType.OHLC) {
      rects.push({
        x: x - 0.5,
        y: priceY[0],
        width: 1,
        height: priceY[1] - priceY[0],
        styles: {
          style: 'fill',
          fillColor: color,
          stokeColor: color,
          strokeSize: 1,
          radius: 0
        }
      })
      if (
        type === CandleType.CANDLE_STROKE ||
        (type === CandleType.CANDLE_UP_STROKE && open < close) ||
        (type === CandleType.CANDLE_DOWN_STROKE && open > close)
      ) {
        rects.push({
          x: x - halfGapBar + 0.5,
          y: priceY[1],
          width: gapBar - 1,
          height: barHeight,
          styles: {
            style: 'stroke',
            fillColor: color,
            stokeColor: color,
            strokeSize: 1,
            radius: 0
          }
        })
      } else {
        rects.push({
          x: x - halfGapBar,
          y: priceY[1],
          width: gapBar,
          height: barHeight,
          styles: {
            style: 'fill',
            fillColor: color,
            stokeColor: color,
            strokeSize: 1,
            radius: 0
          }
        })
      }
      rects.push({
        x: x - 0.5,
        y: priceY[2],
        width: 1,
        height: priceY[3] - priceY[2],
        styles: {
          style: 'fill',
          fillColor: color,
          stokeColor: color,
          strokeSize: 1,
          radius: 0
        }
      })
    } else {
      rects = [
        {
          x: x - 0.5,
          y: priceY[0],
          width: 1,
          height: priceY[3] - priceY[0],
          styles: {
            style: 'fill',
            fillColor: color,
            stokeColor: color,
            strokeSize: 1,
            radius: 0
          }
        }, {
          x: x - halfGapBar,
          y: openY,
          width: halfGapBar,
          height: 1,
          styles: {
            style: 'fill',
            fillColor: color,
            stokeColor: color,
            strokeSize: 1,
            radius: 0
          }
        }, {
          x,
          y: closeY,
          width: halfGapBar,
          height: 1,
          styles: {
            style: 'fill',
            fillColor: color,
            stokeColor: color,
            strokeSize: 1,
            radius: 0
          }
        }
      ]
    }
    rects.forEach(rect => {
      this.createFigure('rect', rect)?.draw(ctx)
    })
  }
}
