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
import type VisibleData from '../common/VisibleData'
import { type CandleHighLowPriceMarkStyle } from '../common/Styles'

import ChildrenView from './ChildrenView'

import { formatPrecision, formatThousands, formatFoldDecimal } from '../common/utils/format'
import { isValid } from '../common/utils/typeChecks'

export default class CandleHighLowPriceView extends ChildrenView {
  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chartStore = pane.getChart().getChartStore()
    const priceMarkStyles = chartStore.getStyles().candle.priceMark
    const highPriceMarkStyles = priceMarkStyles.high
    const lowPriceMarkStyles = priceMarkStyles.low
    if (priceMarkStyles.show && (highPriceMarkStyles.show || lowPriceMarkStyles.show)) {
      const thousandsSeparator = chartStore.getThousandsSeparator()
      const decimalFoldThreshold = chartStore.getDecimalFoldThreshold()
      const precision = chartStore.getPrecision()
      const yAxis = pane.getAxisComponent()
      let high = Number.MIN_SAFE_INTEGER
      let highX = 0
      let low = Number.MAX_SAFE_INTEGER
      let lowX = 0
      this.eachChildren((data: VisibleData) => {
        const { data: kLineData, x } = data
        if (isValid(kLineData)) {
          if (high < kLineData.high) {
            high = kLineData.high
            highX = x
          }
          if (low > kLineData.low) {
            low = kLineData.low
            lowX = x
          }
        }
      })
      const highY = yAxis.convertToPixel(high)
      const lowY = yAxis.convertToPixel(low)
      if (highPriceMarkStyles.show && high !== Number.MIN_SAFE_INTEGER) {
        this._drawMark(
          ctx,
          formatFoldDecimal(formatThousands(formatPrecision(high, precision.price), thousandsSeparator), decimalFoldThreshold),
          { x: highX, y: highY },
          highY < lowY ? [-2, -5] : [2, 5],
          highPriceMarkStyles
        )
      }
      if (lowPriceMarkStyles.show && low !== Number.MAX_SAFE_INTEGER) {
        this._drawMark(
          ctx,
          formatFoldDecimal(formatThousands(formatPrecision(low, precision.price), thousandsSeparator), decimalFoldThreshold),
          { x: lowX, y: lowY },
          highY < lowY ? [2, 5] : [-2, -5],
          lowPriceMarkStyles
        )
      }
    }
  }

  private _drawMark (
    ctx: CanvasRenderingContext2D,
    text: string,
    coordinate: Coordinate,
    offsets: number[],
    styles: CandleHighLowPriceMarkStyle
  ): void {
    const startX = coordinate.x
    const startY = coordinate.y + offsets[0]
    this.createFigure({
      name: 'line',
      attrs: {
        coordinates: [
          { x: startX - 2, y: startY + offsets[0] },
          { x: startX, y: startY },
          { x: startX + 2, y: startY + offsets[0] }
        ]
      },
      styles: { color: styles.color }
    })?.draw(ctx)

    let lineEndX: number
    let textStartX: number
    let textAlign: string
    const { width } = this.getWidget().getBounding()
    if (startX > width / 2) {
      lineEndX = startX - 5
      textStartX = lineEndX - styles.textOffset
      textAlign = 'right'
    } else {
      lineEndX = startX + 5
      textAlign = 'left'
      textStartX = lineEndX + styles.textOffset
    }

    const y = startY + offsets[1]
    this.createFigure({
      name: 'line',
      attrs: {
        coordinates: [
          { x: startX, y: startY },
          { x: startX, y },
          { x: lineEndX, y }
        ]
      },
      styles: { color: styles.color }
    })?.draw(ctx)
    this.createFigure({
      name: 'text',
      attrs: {
        x: textStartX,
        y,
        text,
        align: textAlign,
        baseline: 'middle'
      },
      styles: {
        color: styles.color,
        size: styles.textSize,
        family: styles.textFamily,
        weight: styles.textWeight
      }
    })?.draw(ctx)
  }
}
