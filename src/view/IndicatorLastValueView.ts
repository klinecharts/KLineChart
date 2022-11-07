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

import YAxis from '../componentl/YAxis'

import { eachPlots, IndicatorPlot, IndicatorPlotStyle } from '../componentl/Indicator'

import View from './View'

import { formatPrecision, formatBigNumber } from '../common/utils/format'
import { isValid } from '../common/utils/typeChecks'
import { createFont, calcTextWidth } from '../common/utils/canvas'

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
          eachPlots(dataList, indicator, dataIndex, defaultStyles, (plot: IndicatorPlot, plotStyle: Required<IndicatorPlotStyle>) => {
            const value = indicatorData[plot.key]
            if (isValid(value)) {
              const y = yAxis.convertToNicePixel(value)
              let text = formatPrecision(value, precision)
              if (indicator.shouldFormatBigNumber) {
                text = formatBigNumber(text)
              }

              ctx.font = createFont(lastValueMarkTextStyles.size, lastValueMarkTextStyles.weight, lastValueMarkTextStyles.family)
              const paddingLeft = lastValueMarkTextStyles.paddingLeft
              const paddingRight = lastValueMarkTextStyles.paddingRight
              const paddingTop = lastValueMarkTextStyles.paddingTop
              const paddingBottom = lastValueMarkTextStyles.paddingBottom
              const textSize = lastValueMarkTextStyles.size

              const rectWidth = calcTextWidth(ctx, text) + paddingLeft + paddingRight
              const rectHeight = paddingTop + textSize + paddingBottom

              let rectStartX: number
              if (yAxis.isFromZero()) {
                rectStartX = 0
              } else {
                rectStartX = bounding.width - rectWidth
              }

              const backgroundColor = plotStyle.color
              this.createFigure(
                'rect',
                {
                  x: rectStartX,
                  y: y - paddingTop - textSize / 2,
                  width: rectWidth,
                  height: rectHeight
                },
                {
                  color: backgroundColor,
                  borderRadius: lastValueMarkTextStyles.borderRadius
                }
              )?.draw(ctx)

              this.createFigure(
                'text',
                {
                  x: rectStartX + paddingLeft,
                  y,
                  text
                },
                {
                  color: lastValueMarkTextStyles.color,
                  size: textSize,
                  family: lastValueMarkTextStyles.family,
                  weight: lastValueMarkTextStyles.weight,
                  baseline: 'middle'
                }
              )?.draw(ctx)
            }
          })
        }
      })
    }
  }
}
