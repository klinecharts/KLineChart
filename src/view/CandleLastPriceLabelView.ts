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
import type { TextStyle } from '../common/Styles'

import View from './View'

import type { FigureCreate } from '../component/Figure'
import type YAxis from '../component/YAxis'
import type { TextAttrs } from '../extension/figure/text'

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
      const precision = chartStore.getSymbol()?.pricePrecision ?? 2
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

        const textFigures: Array<FigureCreate<TextAttrs, TextStyle>> = []
        const yAxisRange = yAxis.getRange()
        let priceText = yAxis.displayValueToText(
          yAxis.realValueToDisplayValue(
            yAxis.valueToRealValue(close, { range: yAxisRange }),
            { range: yAxisRange }
          ),
          precision
        )
        priceText = chartStore.getDecimalFold().format(chartStore.getThousandsSeparator().format(priceText))
        const { paddingLeft, paddingRight, paddingTop, paddingBottom, size, family, weight } = lastPriceMarkTextStyles
        let textWidth = paddingLeft + calcTextWidth(priceText, size, weight, family) + paddingRight
        const priceTextHeight = paddingTop + size + paddingBottom
        textFigures.push({
          name: 'text',
          attrs: {
            x,
            y: priceY,
            width: textWidth,
            height: priceTextHeight,
            text: priceText,
            align: textAlgin,
            baseline: 'middle'
          },
          styles: {
            ...lastPriceMarkTextStyles,
            backgroundColor
          }
        })
        const formatExtendText = chartStore.getInnerFormatter().formatExtendText
        const priceTextHalfHeight = size / 2
        let aboveY = priceY - priceTextHalfHeight - paddingTop
        let belowY = priceY + priceTextHalfHeight + paddingBottom
        lastPriceMarkStyles.extendTexts.forEach((item, index) => {
          const text = formatExtendText({ type: 'last_price', data, index })
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
            textWidth = Math.max(textWidth, item.paddingLeft + calcTextWidth(text, item.size, item.weight, item.family) + item.paddingRight)
            textFigures.push({
              name: 'text',
              attrs: {
                x,
                y: textY,
                width: textWidth,
                height: item.paddingTop + item.size + item.paddingBottom,
                text,
                align: textAlgin,
                baseline: 'middle'
              },
              styles: { ...item, backgroundColor }
            })
          }
        })
        textFigures.forEach(figure => {
          figure.attrs.width = textWidth
          this.createFigure(figure)?.draw(ctx)
        })
      }
    }
  }
}
