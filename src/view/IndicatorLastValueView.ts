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

import YAxis from '../component/YAxis'

import { eachFigures, IndicatorFigure, IndicatorFigureStyle } from '../component/Indicator'

import View from './View'

import { formatPrecision, formatBigNumber } from '../common/utils/format'
import { isValid } from '../common/utils/typeChecks'

export default class IndicatorLastValueView extends View<YAxis> {
  protected drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const bounding = widget.getBounding()
    const chartStore = pane.getChart().getChartStore()
    const defaultStyles = chartStore.getStyleOptions().indicator
    const lastValueMarkStyles = defaultStyles.lastValueMark
    const lastValueMarkTextStyles = lastValueMarkStyles.text
    if (lastValueMarkStyles.show) {
      const yAxis = pane.getAxisComponent()
      const dataList = chartStore.getDataList()
      const dataIndex = dataList.length - 1
      const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
      indicators.forEach(indicator => {
        const result = indicator.result
        const indicatorData = result[dataIndex]
        if (indicatorData !== undefined) {
          const precision = indicator.precision
          eachFigures(dataList, indicator, dataIndex, defaultStyles, (figure: IndicatorFigure, figureStyles: Required<IndicatorFigureStyle>) => {
            const value = indicatorData[figure.key]
            if (isValid(value)) {
              const y = yAxis.convertToNicePixel(value)
              let text = formatPrecision(value, precision)
              if (indicator.shouldFormatBigNumber) {
                text = formatBigNumber(text)
              }

              let x: number
              let textAlign: CanvasTextAlign
              if (yAxis.isFromZero()) {
                x = 0
                textAlign = 'left'
              } else {
                x = bounding.width
                textAlign = 'right'
              }

              this.createFigure(
                'rectText',
                {
                  x,
                  y,
                  text,
                  align: textAlign,
                  baseline: 'middle'
                },
                {
                  ...lastValueMarkTextStyles,
                  backgroundColor: figureStyles.color
                }
              )?.draw(ctx)
            }
          })
        }
      })
    }
  }
}
