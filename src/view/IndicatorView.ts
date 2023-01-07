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
import Coordinate from '../common/Coordinate'
import VisibleData from '../common/VisibleData'
import BarSpace from '../common/BarSpace'
import { CandleType, LineStyle, LineType } from '../common/Options'

import { PaneIdConstants } from '../pane/Pane'

import ChartStore from '../store/ChartStore'

import Axis from '../component/Axis'

import { FigureCreate } from '../component/Figure'
import { LineAttrs } from '../extension/figure/line'
import { eachFigures, IndicatorFigure, IndicatorFigureStyle } from '../component/Indicator'

import CandleBarView, { CandleBarOptions } from './CandleBarView'

import { formatValue } from '../common/utils/format'
import { isValid } from '../common/utils/typeChecks'

export default class IndicatorView extends CandleBarView {
  protected getCandleBarOptions (chartStore: ChartStore): Nullable<CandleBarOptions> {
    const pane = this.getWidget().getPane()
    const yAxis = pane.getAxisComponent()
    if (!yAxis.isInCandle()) {
      const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
      for (const entries of indicators) {
        const indicator = entries[1]
        if (indicator.shouldOhlc) {
          const indicatorStyles = indicator.styles
          const defaultStyles = chartStore.getStyles().indicator
          return {
            type: CandleType.OHLC,
            styles: {
              upColor: formatValue(indicatorStyles, 'ohlc.upColor', defaultStyles.ohlc.upColor) as string,
              downColor: formatValue(indicatorStyles, 'ohlc.downColor', defaultStyles.ohlc.downColor) as string,
              noChangeColor: formatValue(indicatorStyles, 'ohlc.noChangeColor', defaultStyles.ohlc.noChangeColor) as string
            }
          }
        }
      }
    }
    return null
  }

  drawImp (ctx: CanvasRenderingContext2D): void {
    super.drawImp(ctx)
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chart = pane.getChart()
    const bounding = widget.getBounding()
    const xAxis = chart.getPaneById(PaneIdConstants.XAXIS)?.getAxisComponent() as Axis
    const yAxis = pane.getAxisComponent()
    const chartStore = chart.getChartStore()
    const dataList = chartStore.getDataList()
    const timeScaleStore = chartStore.getTimeScaleStore()
    const visibleRange = timeScaleStore.getVisibleRange()
    const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
    const defaultStyles = chartStore.getStyles().indicator
    indicators.forEach(indicator => {
      let isCover = false
      if (indicator.draw !== null) {
        ctx.save()
        isCover = indicator.draw({
          ctx,
          kLineDataList: dataList,
          indicator,
          visibleRange,
          bounding,
          barSpace: timeScaleStore.getBarSpace(),
          defaultStyles,
          xAxis,
          yAxis
        }) ?? false
        ctx.restore()
      }
      if (!isCover) {
        const result = indicator.result
        const lineFigureStyles: Array<Nullable<IndicatorFigureStyle>> = []
        const lineCoordinates: Coordinate[][] = []

        const lines: Array<FigureCreate<LineAttrs, Partial<LineStyle>>> = []

        this.eachChildren((data: VisibleData, barSpace: BarSpace) => {
          const { halfGapBar, gapBar } = barSpace
          const { dataIndex, x } = data
          const indicatorData = result[dataIndex] ?? {}

          eachFigures(dataList, indicator, dataIndex, defaultStyles, (figure: IndicatorFigure, figureStyles: Required<IndicatorFigureStyle>, defaultFigureStyles: any, count: number) => {
            const value = indicatorData[figure.key]
            const valueY = yAxis.convertToPixel(value)
            switch (figure.type) {
              case 'circle': {
                if (isValid(value)) {
                  this.createFigure(
                    'circle',
                    {
                      x,
                      y: valueY,
                      r: halfGapBar
                    },
                    {
                      style: figureStyles.style,
                      color: figureStyles.color,
                      borderColor: figureStyles.color
                    }
                  )?.draw(ctx)
                }
                break
              }
              case 'bar': {
                if (isValid(value)) {
                  const baseValue = figure.baseValue ?? yAxis.getExtremum().min
                  const baseValueY = yAxis.convertToPixel(baseValue)
                  const height = Math.abs(baseValueY - valueY)
                  let y: number
                  if (valueY > baseValueY) {
                    y = baseValueY
                  } else {
                    y = height < 1 ? baseValueY - 1 : valueY
                  }
                  this.createFigure(
                    'rect',
                    {
                      x: x - halfGapBar,
                      y,
                      width: gapBar,
                      height
                    },
                    {
                      style: figureStyles.style,
                      color: figureStyles.color,
                      borderColor: figureStyles.color
                    }
                  )?.draw(ctx)
                }
                break
              }
              case 'line': {
                let innerFigureStyle: Nullable<IndicatorFigureStyle> = null
                if (isValid(value)) {
                  innerFigureStyle = figureStyles
                  const coordinate = { x, y: valueY }
                  const prevFigureStyles = lineFigureStyles[count]
                  if (!isValid(lineCoordinates[count])) {
                    lineCoordinates[count] = []
                  }
                  lineCoordinates[count].push(coordinate)
                  if (isValid(prevFigureStyles)) {
                    if (prevFigureStyles?.color !== figureStyles.color) {
                      lines.push({
                        name: 'line',
                        attrs: { coordinates: lineCoordinates[count] },
                        styles: {
                          style: figureStyles.style as LineType,
                          color: figureStyles.color,
                          size: defaultFigureStyles.size,
                          dashedValue: defaultFigureStyles.dashedValue
                        }
                      })
                      lineCoordinates[count] = [coordinate]
                    } else {
                      if (prevFigureStyles?.style !== figureStyles.style) {
                        lines.push({
                          name: 'line',
                          attrs: { coordinates: lineCoordinates[count] },
                          styles: {
                            style: figureStyles.style as LineType,
                            color: figureStyles.color,
                            size: defaultFigureStyles.size,
                            dashedValue: defaultFigureStyles.dashedValue
                          }
                        })
                        lineCoordinates[count] = [coordinate]
                      }
                    }
                  }
                  if (dataIndex === visibleRange.to - 1) {
                    lines.push({
                      name: 'line',
                      attrs: { coordinates: lineCoordinates[count] },
                      styles: {
                        style: figureStyles.style as LineType,
                        color: figureStyles?.color,
                        size: defaultFigureStyles.size,
                        dashedValue: defaultFigureStyles.dashedValue
                      }
                    })
                  }
                }
                lineFigureStyles[count] = innerFigureStyle
                break
              }
              default: { break }
            }
          })
        })
        lines.forEach(({ attrs, styles }) => {
          this.createFigure('line', attrs, styles)?.draw(ctx)
        })
      }
    })
  }
}
