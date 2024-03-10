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

import type Nullable from '../common/Nullable'
import type VisibleData from '../common/VisibleData'
import type BarSpace from '../common/BarSpace'
import { CandleType } from '../common/Styles'

import type ChartStore from '../store/ChartStore'

import { eachFigures, type IndicatorFigure, type IndicatorFigureAttrs, type IndicatorFigureStyle } from '../component/Indicator'

import CandleBarView, { type CandleBarOptions } from './CandleBarView'

import { formatValue } from '../common/utils/format'
import { isNumber, isValid } from '../common/utils/typeChecks'

export default class IndicatorView extends CandleBarView {
  override getCandleBarOptions (chartStore: ChartStore): Nullable<CandleBarOptions> {
    const pane = this.getWidget().getPane()
    const yAxis = pane.getAxisComponent()
    if (!yAxis.isInCandle()) {
      const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
      for (const indicator of indicators) {
        if (indicator.shouldOhlc && indicator.visible) {
          const indicatorStyles = indicator.styles
          const defaultStyles = chartStore.getStyles().indicator
          const upColor = formatValue(indicatorStyles, 'ohlc.upColor', defaultStyles.ohlc.upColor) as string
          const downColor = formatValue(indicatorStyles, 'ohlc.downColor', defaultStyles.ohlc.downColor) as string
          const noChangeColor = formatValue(indicatorStyles, 'ohlc.noChangeColor', defaultStyles.ohlc.noChangeColor) as string
          return {
            type: CandleType.Ohlc,
            styles: {
              upColor,
              downColor,
              noChangeColor,
              upBorderColor: upColor,
              downBorderColor: downColor,
              noChangeBorderColor: noChangeColor,
              upWickColor: upColor,
              downWickColor: downColor,
              noChangeWickColor: noChangeColor
            }
          }
        }
      }
    }
    return null
  }

  override drawImp (ctx: CanvasRenderingContext2D): void {
    super.drawImp(ctx)
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chart = pane.getChart()
    const bounding = widget.getBounding()
    const xAxis = chart.getXAxisPane().getAxisComponent()
    const yAxis = pane.getAxisComponent()
    const chartStore = chart.getChartStore()
    const dataList = chartStore.getDataList()
    const timeScaleStore = chartStore.getTimeScaleStore()
    const visibleRange = timeScaleStore.getVisibleRange()
    const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
    const defaultStyles = chartStore.getStyles().indicator
    ctx.save()
    indicators.forEach(indicator => {
      if (indicator.visible) {
        if (indicator.zLevel < 0) {
          ctx.globalCompositeOperation = 'destination-over'
        } else {
          ctx.globalCompositeOperation = 'source-over'
        }
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

          this.eachChildren((data: VisibleData, barSpace: BarSpace) => {
            const { halfGapBar, gapBar } = barSpace
            const { dataIndex, x } = data
            const prevX = xAxis.convertToPixel(dataIndex - 1)
            const nextX = xAxis.convertToPixel(dataIndex + 1)
            const prevIndicatorData = result[dataIndex - 1] ?? {}
            const currentIndicatorData = result[dataIndex] ?? {}
            const nextIndicatorData = result[dataIndex + 1] ?? {}
            const prevCoordinate = { x: prevX }
            const currentCoordinate = { x }
            const nextCoordinate = { x: nextX }
            indicator.figures.forEach(({ key }) => {
              const prevValue = prevIndicatorData[key]
              if (isNumber(prevValue)) {
                prevCoordinate[key] = yAxis.convertToPixel(prevValue)
              }
              const currentValue = currentIndicatorData[key]
              if (isNumber(currentValue)) {
                currentCoordinate[key] = yAxis.convertToPixel(currentValue)
              }
              const nextValue = nextIndicatorData[key]
              if (isNumber(nextValue)) {
                nextCoordinate[key] = yAxis.convertToPixel(nextValue)
              }
            })
            eachFigures(dataList, indicator, dataIndex, defaultStyles, (figure: IndicatorFigure, figureStyles: IndicatorFigureStyle) => {
              if (isValid(currentIndicatorData[figure.key])) {
                const valueY = currentCoordinate[figure.key]
                let attrs = figure.attrs?.({
                  coordinate: { prev: prevCoordinate, current: currentCoordinate, next: nextCoordinate },
                  bounding,
                  barSpace,
                  xAxis,
                  yAxis
                })
                if (!isValid<IndicatorFigureAttrs>(attrs)) {
                  switch (figure.type) {
                    case 'circle': {
                      attrs = { x, y: valueY, r: halfGapBar }
                      break
                    }
                    case 'rect':
                    case 'bar': {
                      const baseValue = figure.baseValue ?? yAxis.getRange().from
                      const baseValueY = yAxis.convertToPixel(baseValue)
                      let height = Math.abs(baseValueY - (valueY as number))
                      if (baseValue !== currentIndicatorData[figure.key]) {
                        height = Math.max(1, height)
                      }
                      let y: number
                      if (valueY > baseValueY) {
                        y = baseValueY
                      } else {
                        y = valueY
                      }
                      attrs = {
                        x: x - halfGapBar,
                        y,
                        width: gapBar,
                        height
                      }
                      break
                    }
                    case 'line': {
                      if (isNumber(currentCoordinate[figure.key]) && isNumber(nextCoordinate[figure.key])) {
                        attrs = {
                          coordinates: [
                            { x: currentCoordinate.x, y: currentCoordinate[figure.key] },
                            { x: nextCoordinate.x, y: nextCoordinate[figure.key] }
                          ]
                        }
                      }
                      break
                    }
                    default: { break }
                  }
                }
                if (isValid<IndicatorFigureAttrs>(attrs)) {
                  const name = figure.type!
                  this.createFigure({
                    name: name === 'bar' ? 'rect' : name,
                    attrs,
                    styles: figureStyles
                  })?.draw(ctx)
                }
              }
            })
          })
        }
      }
    })
    ctx.restore()
  }
}
