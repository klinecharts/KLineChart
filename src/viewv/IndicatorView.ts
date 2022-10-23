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
import Coordinate from '../common/Coordinate'

import { XAXIS_PANE_ID } from '../ChartInternal'

import ChartStore, { VisibleData } from '../store/ChartStore'
import { BarSpace } from '../store/TimeScaleStore'
import { CandleType, IndicatorStyle } from '../store/styles'

import XAxis from '../componentl/XAxis'

import { getFigureClass } from '../template/figure'
import { CircleAttrs } from '../template/figure/circle'
import { RectAttrs } from '../template/figure/rect'
import { LineAttrs } from '../template/figure/line'
import { FigureConstructor } from '../template/figure/Figure'
import { IndicatorPlotStyle, getIndicatorPlotStyles } from '../template/indicator/Indicator'

import CandleBarView, { CandleBarOptions } from './CandleBarView'

import { formatValue } from '../utils/format'
import { isValid } from '../utils/typeChecks'

export default class IndicatorView extends CandleBarView {
  protected getCandleBarOptions (chartStore: ChartStore): TypeOrNull<CandleBarOptions> {
    const pane = this.getWidget().getPane()
    const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
    for (const entries of indicators) {
      const indicator = entries[1]
      if (indicator.shouldOhlc ?? false) {
        const indicatorStyles = indicator.styles ?? null
        const defaultStyles = chartStore.getStyleOptions().indicator
        return {
          type: CandleType.OHLC,
          styles: {
            upColor: formatValue(indicatorStyles, 'ohlc.upColor', defaultStyles.ohlc.upColor),
            downColor: formatValue(indicatorStyles, 'ohlc.downColor', defaultStyles.ohlc.downColor),
            noChangeColor: formatValue(indicatorStyles, 'ohlc.noChangeColor', defaultStyles.ohlc.noChangeColor)
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
    const xAxis = chart.getPaneById(XAXIS_PANE_ID)?.getAxisComponent() as XAxis
    const yAxis = pane.getAxisComponent()
    const chartStore = chart.getChartStore()
    const dataList = chartStore.getDataList()
    const timeScaleStore = chartStore.getTimeScaleStore()
    const visibleRange = timeScaleStore.getVisibleRange()
    const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
    const defaultStyles = chartStore.getStyleOptions().indicator as IndicatorStyle
    indicators.forEach(indicator => {
      let isExtend = false
      if (isValid(indicator.draw)) {
        ctx.save()
        isExtend = indicator.draw?.({
          ctx,
          kLineDataList: dataList,
          indicator,
          visibleRange,
          bounding,
          defaultStyles,
          xAxis,
          yAxis
        }) ?? false
        ctx.restore()
      }
      if (isExtend) {
        const plots = indicator.plots ?? []
        const result = indicator.result ?? []
        const styles = indicator.styles ?? null

        const circleStyles = formatValue(styles, 'circles', defaultStyles.circles)
        const circleStyleCount = circleStyles.length

        const barStyles = formatValue(styles, 'bars', defaultStyles.bars)
        const barStyleCount = barStyles.length

        const lineStyles = formatValue(styles, 'lines', defaultStyles.lines)
        const lineStyleCount = lineStyles.length
        const linePlotStyles: Array<TypeOrNull<IndicatorPlotStyle>> = []
        const lineCoordinates: Coordinate[][] = []

        const lines: LineAttrs[] = []

        this.drawChildren(
          (data: VisibleData, barSpace: BarSpace) => {
            const { halfGapBar, gapBar } = barSpace
            const { dataIndex, x } = data
            const indicatorData = result[dataIndex] ?? {}
            let circleCount = 0
            let barCount = 0
            let lineCount = 0
            plots.forEach(plot => {
              const value = indicatorData[plot.key]
              const valueY = yAxis.convertToPixel(value)
              switch (plot.type ?? '') {
                case 'circle': {
                  if (isValid(value)) {
                    const circleStyle = circleStyles[circleCount % circleStyleCount]
                    const plotStyle = getIndicatorPlotStyles(
                      dataList, result, dataIndex,
                      plot, indicator, defaultStyles,
                      {
                        style: circleStyle.style,
                        color: circleStyle.noChangeColor
                      }
                    )
                    const FigureClass = getFigureClass<CircleAttrs>('circle') as FigureConstructor<CircleAttrs>
                    if (isValid(FigureClass)) {
                      new FigureClass({
                        x,
                        y: valueY,
                        r: halfGapBar,
                        styles: {
                          style: plotStyle.style as 'fill' | 'stroke' | 'stroke-fill',
                          fillColor: plotStyle.color,
                          stokeColor: plotStyle.color,
                          strokeSize: 1
                        }
                      }).draw(ctx)
                    }
                  }
                  circleCount++
                  break
                }
                case 'bar': {
                  if (isValid(value)) {
                    const barStyle = barStyles[barCount % barStyleCount]
                    const plotStyle = getIndicatorPlotStyles(
                      dataList, result, dataIndex,
                      plot, indicator, defaultStyles,
                      {
                        style: barStyle.style,
                        color: barStyle.noChangeColor
                      }
                    )
                    const baseValue = plot.baseValue ?? yAxis.getExtremum().min
                    const baseValueY = yAxis.convertToPixel(baseValue)
                    const height = Math.abs(baseValueY - valueY)
                    let y: number
                    if (valueY > baseValueY) {
                      y = baseValueY
                    } else {
                      y = height < 1 ? baseValueY - 1 : valueY
                    }
                    const FigureClass = getFigureClass<RectAttrs>('rect') as FigureConstructor<RectAttrs>
                    if (isValid(FigureClass)) {
                      new FigureClass({
                        x: x - halfGapBar,
                        y,
                        width: gapBar,
                        height,
                        styles: {
                          style: plotStyle.style as 'fill' | 'stroke' | 'stroke-fill',
                          fillColor: plotStyle.color,
                          stokeColor: plotStyle.color,
                          strokeSize: 1,
                          radius: 0
                        }
                      }).draw(ctx)
                    }
                  }
                  barCount++
                  break
                }
                case 'line': {
                  let plotStyle: TypeOrNull<IndicatorPlotStyle> = null
                  if (isValid(value)) {
                    const lineStyle = lineStyles[lineCount % lineStyleCount]
                    plotStyle = getIndicatorPlotStyles(
                      dataList, result, dataIndex,
                      plot, indicator, defaultStyles,
                      {
                        style: lineStyle.style,
                        color: lineStyle.color
                      }
                    )
                    const coordinate = { x, y: valueY }
                    const prevPlotStyle = linePlotStyles[lineCount]
                    if (!isValid(lineCoordinates[lineCount])) {
                      lineCoordinates[lineCount] = []
                    }
                    lineCoordinates[lineCount].push(coordinate)
                    if (isValid(prevPlotStyle)) {
                      if (prevPlotStyle?.color !== plotStyle.color) {
                        lines.push({
                          coordinates: lineCoordinates[lineCount],
                          styles: {
                            style: plotStyle.style as 'solid' | 'dashed',
                            color: plotStyle?.color as string,
                            size: lineStyle.size,
                            dashedValue: lineStyle.dashedValue
                          }
                        })
                        lineCoordinates[lineCount] = [coordinate]
                      } else {
                        if (prevPlotStyle?.style !== plotStyle.style) {
                          lines.push({
                            coordinates: lineCoordinates[lineCount],
                            styles: {
                              style: plotStyle.style as 'solid' | 'dashed',
                              color: plotStyle?.color as string,
                              size: lineStyle.size,
                              dashedValue: lineStyle.dashedValue
                            }
                          })
                          lineCoordinates[lineCount] = [coordinate]
                        }
                      }
                    }
                    if (dataIndex === visibleRange.to - 1) {
                      lines.push({
                        coordinates: lineCoordinates[lineCount],
                        styles: {
                          style: plotStyle.style as 'solid' | 'dashed',
                          color: plotStyle?.color as string,
                          size: lineStyle.size,
                          dashedValue: lineStyle.dashedValue
                        }
                      })
                    }
                  }
                  linePlotStyles[lineCount] = plotStyle
                  lineCount++
                  break
                }
                default: { break }
              }
            })
          },
          () => {
            const FigureClass = getFigureClass<LineAttrs>('line') as FigureConstructor<LineAttrs>
            if (isValid(FigureClass)) {
              lines.forEach(line => {
                new FigureClass(line).draw(ctx)
              })
            }
          }
        )
      }
    })
  }
}
