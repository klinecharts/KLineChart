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

import YAxis from '../componentl/YAxis'

import { getIndicatorPlotStyles, IndicatorPlot, IndicatorPlotStyle } from '../template/indicator/Indicator'

import View from './View'

import { formatPrecision, formatValue, formatBigNumber } from '../utils/format'
import { isValid } from '../utils/typeChecks'
import { createFont, calcTextWidth } from '../utils/canvas'

export default class IndicatorLastValueView extends View {
  protected drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const bounding = widget.getBounding()
    const chartStore = pane.getChart().getChartStore()
    const defaultStyles = chartStore.getStyleOptions().indicator
    const lastValueMarkStyles = defaultStyles.lastValueMark
    const lastValueMarkTextStyles = lastValueMarkStyles.text
    const show = lastValueMarkStyles.show as boolean
    if (show) {
      const yAxis = pane.getAxisComponent() as YAxis
      const dataList = chartStore.getDataList()
      const dataCount = dataList.length
      const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
      indicators.forEach(indicator => {
        const result = indicator.result ?? []
        const indicatorData = result[dataCount - 1]
        if (isValid(indicatorData)) {
          const plots: IndicatorPlot[] = indicator.plots ?? []
          const precision = indicator.precision as number

          const styles = indicator.styles ?? null

          const circleStyles = formatValue(styles, 'circles', defaultStyles.circles)
          const circleStyleCount = circleStyles.length

          const barStyles = formatValue(styles, 'bars', defaultStyles.bars)
          const barStyleCount = barStyles.length

          const lineStyles = formatValue(styles, 'lines', defaultStyles.lines)
          const lineStyleCount = lineStyles.length

          let circleCount = 0
          let barCount = 0
          let lineCount = 0
          plots.forEach(plot => {
            let plotStyle: TypeOrNull<Required<IndicatorPlotStyle>> = null
            switch (plot.type) {
              case 'circle': {
                const circleStyle = circleStyles[circleCount % circleStyleCount]
                plotStyle = getIndicatorPlotStyles(
                  dataList, result, dataCount - 1,
                  plot, indicator, defaultStyles,
                  {
                    style: circleStyle.style,
                    color: circleStyle.noChangeColor
                  }
                )
                circleCount++
                break
              }
              case 'bar': {
                const barStyle = barStyles[barCount % barStyleCount]
                plotStyle = getIndicatorPlotStyles(
                  dataList, result, dataCount - 1,
                  plot, indicator, defaultStyles,
                  {
                    style: barStyle.style,
                    color: barStyle.noChangeColor
                  }
                )
                barCount++
                break
              }
              case 'line': {
                const lineStyle = lineStyles[lineCount % lineStyleCount]
                plotStyle = getIndicatorPlotStyles(
                  dataList, result, dataCount - 1,
                  plot, indicator, defaultStyles,
                  {
                    style: lineStyle.style,
                    color: lineStyle.color
                  }
                )
                lineCount++
                break
              }
              default: { break }
            }
            const value = indicatorData[plot.key]
            if (isValid(value) && isValid(plotStyle)) {
              const y = yAxis.convertToNicePixel(value)
              let text = formatPrecision(value, precision)
              if (indicator.shouldFormatBigNumber ?? false) {
                text = formatBigNumber(text)
              }

              ctx.font = createFont(lastValueMarkTextStyles.size, lastValueMarkTextStyles.weight, lastValueMarkTextStyles.family)
              const paddingLeft = lastValueMarkTextStyles.paddingLeft as number
              const paddingRight = lastValueMarkTextStyles.paddingRight as number
              const paddingTop = lastValueMarkTextStyles.paddingTop as number
              const paddingBottom = lastValueMarkTextStyles.paddingBottom as number
              const textSize = lastValueMarkTextStyles.size as number

              const rectWidth = calcTextWidth(ctx, text) + paddingLeft + paddingRight
              const rectHeight = paddingTop + textSize + paddingBottom

              let rectStartX: number
              if (yAxis.isFromZero()) {
                rectStartX = 0
              } else {
                rectStartX = bounding.width - rectWidth
              }

              const backgroundColor = plotStyle?.color
              this.createFigure('rect', {
                x: rectStartX,
                y: y - paddingTop - textSize / 2,
                width: rectWidth,
                height: rectHeight,
                styles: {
                  style: 'fill',
                  fillColor: backgroundColor,
                  stokeColor: backgroundColor,
                  strokeSize: 1,
                  radius: lastValueMarkTextStyles.borderRadius
                }
              })?.draw(ctx)

              this.createFigure('text', {
                x: rectStartX + paddingLeft,
                y,
                text,
                styles: {
                  style: 'fill',
                  color: lastValueMarkTextStyles.color,
                  size: textSize,
                  family: lastValueMarkTextStyles.family,
                  weight: lastValueMarkTextStyles.weight,
                  align: 'left',
                  baseline: 'middle'
                }
              })?.draw(ctx)
            }
          })
        }
      })
    }
  }
}
