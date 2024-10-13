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

import { formatThousands, formatFoldDecimal } from '../common/utils/format'
import { isNumber, isValid } from '../common/utils/typeChecks'

import { eachFigures, type IndicatorFigure, type IndicatorFigureStyle } from '../component/Indicator'

import View from './View'

import type { YAxis } from '../component/YAxis'

export default class IndicatorLastValueView extends View<YAxis> {
  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const bounding = widget.getBounding()
    const chartStore = pane.getChart().getChartStore()
    const chartOptions = chartStore.getOptions()
    const defaultStyles = chartOptions.styles.indicator
    const lastValueMarkStyles = defaultStyles.lastValueMark
    const lastValueMarkTextStyles = lastValueMarkStyles.text
    if (lastValueMarkStyles.show) {
      const yAxis = pane.getAxisComponent()
      const yAxisRange = yAxis.getRange()
      const dataList = chartStore.getDataList()
      const dataIndex = dataList.length - 1
      const indicators = chartStore.getIndicatorsByPaneId(pane.getId())
      const customApi = chartOptions.customApi
      const thousandsSeparator = chartOptions.thousandsSeparator
      const decimalFoldThreshold = chartOptions.decimalFoldThreshold
      indicators.forEach(indicator => {
        const result = indicator.result
        const indicatorData = result[dataIndex] ?? result[dataIndex - 1]
        if (isValid(indicatorData) && indicator.visible) {
          const precision = indicator.precision
          eachFigures(dataList, indicator, dataIndex, defaultStyles, (figure: IndicatorFigure, figureStyles: Required<IndicatorFigureStyle>) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const value = indicatorData[figure.key]
            if (isNumber(value)) {
              const y = yAxis.convertToNicePixel(value)
              let text = yAxis.displayValueToText(
                yAxis.realValueToDisplayValue(
                  yAxis.valueToRealValue(value, { range: yAxisRange }),
                  { range: yAxisRange }
                ),
                precision
              )
              if (indicator.shouldFormatBigNumber) {
                text = customApi.formatBigNumber(text)
              }
              text = formatFoldDecimal(formatThousands(text, thousandsSeparator), decimalFoldThreshold)
              let x = 0
              let textAlign: CanvasTextAlign = 'left'
              if (yAxis.isFromZero()) {
                x = 0
                textAlign = 'left'
              } else {
                x = bounding.width
                textAlign = 'right'
              }

              this.createFigure({
                name: 'text',
                attrs: {
                  x,
                  y,
                  text,
                  align: textAlign,
                  baseline: 'middle'
                },
                styles: {
                  ...lastValueMarkTextStyles,
                  backgroundColor: figureStyles.color
                }
              })?.draw(ctx)
            }
          })
        }
      })
    }
  }
}
