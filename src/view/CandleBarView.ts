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
import VisibleData from '../common/VisibleData'
import BarSpace from '../common/BarSpace'
import { EventHandler } from '../common/SyntheticEvent'
import { ActionType } from '../common/Action'
import { CandleType, CandleBarColor, RectStyle, PolygonType } from '../common/Styles'

import ChartStore from '../store/ChartStore'

import Axis from '../component/Axis'

import { FigureCreate } from '../component/Figure'
import { RectAttrs } from '../extension/figure/rect'

import ChildrenView from './ChildrenView'

import { PaneIdConstants } from '../pane/types'

export interface CandleBarOptions {
  type: Exclude<CandleType, CandleType.Area>
  styles: CandleBarColor
}

export default class CandleBarView extends ChildrenView {
  private readonly _boundCandleBarClickEvent = (data: VisibleData) => () => {
    this.getWidget().getPane().getChart().getChartStore().getActionStore().execute(ActionType.OnCandleBarClick, data)
    return false
  }

  override drawImp (ctx: CanvasRenderingContext2D): void {
    const pane = this.getWidget().getPane()
    const isMain = pane.getId() === PaneIdConstants.CANDLE
    const chartStore = pane.getChart().getChartStore()
    const candleBarOptions = this.getCandleBarOptions(chartStore)
    if (candleBarOptions !== null) {
      const yAxis = pane.getAxisComponent()
      this.eachChildren((data: VisibleData, barSpace: BarSpace) => {
        this._drawCandleBar(ctx, yAxis, data, barSpace, candleBarOptions, isMain)
      })
    }
  }

  protected getCandleBarOptions (chartStore: ChartStore): Nullable<CandleBarOptions> {
    const candleStyles = chartStore.getStyles().candle
    return {
      type: candleStyles.type as Exclude<CandleType, CandleType.Area>,
      styles: candleStyles.bar
    }
  }

  private _drawCandleBar (
    ctx: CanvasRenderingContext2D,
    axis: Axis,
    data: VisibleData,
    barSpace: BarSpace,
    candleBarOptions: CandleBarOptions,
    isMain: boolean
  ): void {
    const { data: kLineData, x } = data
    const { open, high, low, close } = kLineData
    const { halfGapBar, gapBar } = barSpace
    const { type, styles } = candleBarOptions
    let color: string
    let borderColor: string
    let wickColor: string
    if (close > open) {
      color = styles.upColor
      borderColor = styles.upBorderColor
      wickColor = styles.upWickColor
    } else if (close < open) {
      color = styles.downColor
      borderColor = styles.downBorderColor
      wickColor = styles.downWickColor
    } else {
      color = styles.noChangeColor
      borderColor = styles.noChangeBorderColor
      wickColor = styles.noChangeWickColor
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

    let rects: Array<FigureCreate<RectAttrs, Partial<RectStyle>>> = []
    if (type !== CandleType.Ohlc) {
      rects.push({
        name: 'rect',
        attrs: {
          x: x - 0.5,
          y: priceY[0],
          width: 1,
          height: priceY[1] - priceY[0]
        },
        styles: { color: wickColor }
      })
      if (
        type === CandleType.CandleStroke ||
        (type === CandleType.CandleUpStroke && open < close) ||
        (type === CandleType.CandleDownStroke && open > close)
      ) {
        rects.push({
          name: 'rect',
          attrs: {
            x: x - halfGapBar + 0.5,
            y: priceY[1],
            width: gapBar - 1,
            height: barHeight
          },
          styles: {
            style: PolygonType.Stroke,
            borderColor
          }
        })
      } else {
        rects.push({
          name: 'rect',
          attrs: {
            x: x - halfGapBar + 0.5,
            y: priceY[1],
            width: gapBar - 1,
            height: barHeight
          },
          styles: {
            style: PolygonType.StrokeFill,
            color,
            borderColor
          }
        })
      }
      rects.push({
        name: 'rect',
        attrs: {
          x: x - 0.5,
          y: priceY[2],
          width: 1,
          height: priceY[3] - priceY[2]
        },
        styles: { color: wickColor }
      })
    } else {
      rects = [
        {
          name: 'rect',
          attrs: {
            x: x - 0.5,
            y: priceY[0],
            width: 1,
            height: priceY[3] - priceY[0]
          },
          styles: { color }
        }, {
          name: 'rect',
          attrs: {
            x: x - halfGapBar,
            y: openY,
            width: halfGapBar,
            height: 1
          },
          styles: { color }
        }, {
          name: 'rect',
          attrs: {
            x,
            y: closeY,
            width: halfGapBar,
            height: 1
          },
          styles: { color }
        }
      ]
    }
    rects.forEach(({ attrs, styles }) => {
      let handler: EventHandler | undefined
      if (isMain) {
        handler = {
          mouseClickEvent: this._boundCandleBarClickEvent(data)
        }
      }
      this.createFigure('rect', attrs, styles, handler)?.draw(ctx)
    })
  }
}
