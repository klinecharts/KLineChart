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

import { isValid } from '../common/utils/typeChecks'
import { calcTextWidth } from '../common/utils/canvas'

import View from './View'

import type YAxis from '../component/YAxis'

export default class CandleLastPriceLabelView extends View {
  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const bounding = widget.getBounding()
    const chartStore = pane.getChart().getChartStore()
    const priceMarkStyles = chartStore.getStyles().candle.priceMark
    const lastPriceMarkStyles = priceMarkStyles.last
    const lastPriceMarkTextStyles = lastPriceMarkStyles.text
    if (priceMarkStyles.show && lastPriceMarkStyles.show && lastPriceMarkTextStyles.show) {
      const precision = chartStore.getPrecision()
      const yAxis = pane.getAxisComponent() as YAxis
      const dataList = chartStore.getDataList()
      const data = dataList[dataList.length - 1]
      if (isValid(data)) {
        const { close, open } = data
        const comparePrice = lastPriceMarkStyles.compareRule === 'current_open' ? open : (dataList[dataList.length - 2]?.close ?? close)
        const priceY = yAxis.convertToNicePixel(close)
        let backgroundColor = ''
        if (close > comparePrice) {
          backgroundColor = lastPriceMarkStyles.upColor
        } else if (close < comparePrice) {
          backgroundColor = lastPriceMarkStyles.downColor
        } else {
          backgroundColor = lastPriceMarkStyles.noChangeColor
        }
        let x = 0
        let textAlgin: CanvasTextAlign = 'left'
        if (yAxis.isFromZero()) {
          x = 0
          textAlgin = 'left'
        } else {
          x = bounding.width
          textAlgin = 'right'
        }

        const yAxisRange = yAxis.getRange()
        let priceText = yAxis.displayValueToText(
          yAxis.realValueToDisplayValue(
            yAxis.valueToRealValue(close, { range: yAxisRange }),
            { range: yAxisRange }
          ),
          precision.price
        )
        priceText = chartStore.getDecimalFold().format(chartStore.getThousandsSeparator().format(priceText))
        const { paddingLeft, paddingRight, paddingTop, paddingBottom, size, family, weight } = lastPriceMarkTextStyles
        const priceTextWidth = paddingLeft + calcTextWidth(priceText, size, weight, family) + paddingRight
        const priceTextHeight = paddingTop + size + paddingBottom
        this.createFigure({
          name: 'text',
          attrs: {
            x,
            y: priceY,
            width: priceTextWidth,
            height: priceTextHeight,
            text: priceText,
            align: textAlgin,
            baseline: 'middle'
          },
          styles: {
            ...lastPriceMarkTextStyles,
            backgroundColor
          }
        })?.draw(ctx)

        const formatExtendText = chartStore.getInnerFormatter().formatExtendText
        const priceTextHalfHeight = size / 2
        let aboveY = priceY - priceTextHalfHeight - paddingTop
        let belowY = priceY + priceTextHalfHeight + paddingBottom
        lastPriceMarkStyles.extendTexts.forEach((item, index) => {
          const text = formatExtendText({ type: 'lastPrice', data, index })
          if (text.length > 0 && item.show) {
            const textHalfHeight = item.size / 2
            let textY = 0
            if (item.position === 'above_price') {
              aboveY -= (item.paddingBottom + textHalfHeight)
              textY = aboveY
              aboveY -= (textHalfHeight + item.paddingTop)
            } else {
              belowY += (item.paddingTop + textHalfHeight)
              textY = belowY
              belowY += (textHalfHeight + item.paddingBottom)
            }
            this.createFigure({
              name: 'text',
              attrs: {
                x,
                y: textY,
                width: priceTextWidth,
                height: item.paddingTop + item.size + item.paddingBottom,
                text,
                align: textAlgin,
                baseline: 'middle'
              },
              styles: { ...item, backgroundColor }
            })?.draw(ctx)
          }
        })
      }
    }
  }
}
