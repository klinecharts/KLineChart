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

import { YAxisType } from '../store/styles'

import View from './View'

import YAxis from '../componentl/YAxis'

import { formatPrecision } from '../utils/format'
import { isValid } from '../utils/typeChecks'
import { createFont, calcTextWidth } from '../utils/canvas'

export default class CandleLastPriceLabelView extends View {
  protected drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const bounding = widget.getBounding()
    const chartStore = pane.getChart().getChartStore()
    const priceMarkStyles = chartStore.getStyleOptions().candle.priceMark
    const lastPriceMarkStyles = priceMarkStyles.last
    const lastPriceMarkTextStyles = lastPriceMarkStyles.text
    if (priceMarkStyles.show && lastPriceMarkStyles.show && lastPriceMarkTextStyles.show) {
      const precision = chartStore.getPrecision()
      const yAxis = pane.getAxisComponent() as YAxis
      const visibleDataList = chartStore.getVisibleDataList()
      const data = visibleDataList[visibleDataList.length - 1]
      if (isValid(data)) {
        const { close, open } = data.data
        const priceY = yAxis.convertToNicePixel(close)
        let backgroundColor: string
        if (close > open) {
          backgroundColor = lastPriceMarkStyles.upColor
        } else if (close < open) {
          backgroundColor = lastPriceMarkStyles.downColor
        } else {
          backgroundColor = lastPriceMarkStyles.noChangeColor
        }
        let text: string
        if (yAxis.getType() === YAxisType.PERCENTAGE) {
          const fromData = visibleDataList[0].data
          const fromClose = fromData.close
          text = `${((close - fromClose) / fromClose * 100).toFixed(2)}%`
        } else {
          text = formatPrecision(close, precision.price)
        }

        ctx.font = createFont(lastPriceMarkTextStyles.size, lastPriceMarkTextStyles.weight, lastPriceMarkTextStyles.family)
        const paddingLeft = lastPriceMarkTextStyles.paddingLeft
        const paddingRight = lastPriceMarkTextStyles.paddingRight
        const paddingTop = lastPriceMarkTextStyles.paddingTop
        const paddingBottom = lastPriceMarkTextStyles.paddingBottom
        const textSize = lastPriceMarkTextStyles.size

        const rectWidth = calcTextWidth(ctx, text) + paddingLeft + paddingRight
        const rectHeight = paddingTop + textSize + paddingBottom

        let rectX: number
        if (yAxis.isFromZero()) {
          rectX = 0
        } else {
          rectX = bounding.width - rectWidth
        }

        this.createFigure('rect', {
          x: rectX,
          y: priceY - paddingTop - textSize / 2,
          width: rectWidth,
          height: rectHeight,
          styles: {
            style: 'fill',
            fillColor: backgroundColor,
            stokeColor: backgroundColor,
            strokeSize: 1,
            radius: lastPriceMarkTextStyles.borderRadius
          }
        })?.draw(ctx)

        this.createFigure('text', {
          x: rectX + paddingLeft,
          y: priceY,
          text,
          styles: {
            style: 'fill',
            color: lastPriceMarkTextStyles.color,
            size: textSize,
            family: lastPriceMarkTextStyles.family,
            weight: lastPriceMarkTextStyles.weight,
            align: 'left',
            baseline: 'middle'
          }
        })?.draw(ctx)
      }
    }
  }
}
