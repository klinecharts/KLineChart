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

import Bounding from '../common/Bounding'
import KLineData from '../common/KLineData'

import Axis from '../componentl/Axis'

import IndicatorTemplate, { eachPlots, Indicator, IndicatorPlot, IndicatorPlotStyle, IndicatorTooltipData, IndicatorTooltipDataChild } from '../template/indicator/Indicator'

import { IndicatorStyle, TooltipShowRule, TooltipStyle, MarginTextStyle } from '../store/styles'
import { Crosshair } from '../store/CrosshairStore'

import { XAXIS_PANE_ID } from '../pane/XAxisPane'

import View from './View'

import { formatPrecision, formatBigNumber } from '../common/utils/format'
import { isValid } from '../common/utils/typeChecks'
import { createFont, calcTextWidth } from '../common/utils/canvas'

export type TooltipData = IndicatorTooltipDataChild

export default class IndicatorTooltipView extends View {
  protected drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const bounding = widget.getBounding()
    const chartStore = pane.getChart().getChartStore()
    const crosshair = chartStore.getCrosshairStore().get()
    const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
    const defaultStyles = chartStore.getStyleOptions().indicator
    this.drawIndicatorTooltip(ctx, chartStore.getDataList(), crosshair, indicators, bounding, defaultStyles)
  }

  protected drawIndicatorTooltip (
    ctx: CanvasRenderingContext2D,
    dataList: KLineData[],
    crosshair: Crosshair,
    indicators: Map<string, IndicatorTemplate>,
    bounding: Required<Bounding>,
    styles: IndicatorStyle,
    top?: number
  ): number {
    const tooltipStyles = styles.tooltip
    let height = 0
    if (this.isDrawTooltip(crosshair, tooltipStyles)) {
      const tooltipTextStyles = tooltipStyles.text
      const textMarginLeft = tooltipTextStyles.marginLeft
      const textMarginRight = tooltipTextStyles.marginRight
      const textSize = tooltipTextStyles.size
      const textWeight = tooltipTextStyles.weight
      const textFamily = tooltipTextStyles.family
      let labelX = 0
      let labelY = top ?? 0
      ctx.font = createFont(textSize, textWeight, textFamily)
      indicators.forEach((indicator: Required<Indicator>) => {
        const { name, calcParamText, values } = this.getIndicatorTooltipData(dataList, crosshair, indicator, styles)
        const nameValid = name !== undefined && name.length > 0
        const valuesValid = values !== undefined && values.length > 0
        if (nameValid || valuesValid) {
          labelY += tooltipTextStyles.marginTop
          height += (tooltipTextStyles.marginTop + textSize + tooltipTextStyles.marginBottom)
          if (nameValid && tooltipStyles.showName) {
            labelX += textMarginLeft
            let text = name
            if (calcParamText !== undefined && calcParamText.length > 0 && tooltipStyles.showParams) {
              text = `${text}${calcParamText}`
            }
            this.createFigure('text', {
              x: labelX,
              y: labelY,
              text,
              styles: {
                style: 'fill',
                color: tooltipTextStyles.color,
                size: textSize,
                family: textFamily,
                weight: textWeight,
                align: 'left',
                baseline: 'top'
              }
            })
            labelX += (calcTextWidth(ctx, text) + textMarginRight)
          }
          if (valuesValid) {
            height += this.drawStandardTooltip(ctx, bounding, values, labelX, labelY, tooltipTextStyles)
          }
        }
      })
    }
    return height
  }

  protected drawStandardTooltip (
    ctx: CanvasRenderingContext2D,
    bounding: Required<Bounding>,
    values: TooltipData[],
    startX: number,
    startY: number,
    styles: Omit<MarginTextStyle, 'show'>
  ): number {
    let labelX = startX
    let labelY = startY
    let height = 0
    const { marginLeft, marginTop, marginRight, marginBottom, size, family, weight } = styles
    values.forEach(({ title, value, color }) => {
      const text = `${title}${value}`
      const textWidth = calcTextWidth(ctx, text)
      if (labelX + marginLeft + textWidth + marginRight > bounding.width) {
        labelX = marginLeft
        height += (size + marginTop + marginBottom)
        labelY += (size + marginTop + marginBottom)
      } else {
        labelX += marginLeft
      }
      this.createFigure('text', {
        x: labelX,
        y: labelY,
        text,
        styles: {
          style: 'fill',
          color,
          size,
          family,
          weight,
          align: 'left',
          baseline: 'top'
        }
      })
      labelX += (textWidth + marginRight)
    })
    return height
  }

  protected isDrawTooltip (crosshair: Crosshair, styles: TooltipStyle): boolean {
    const showRule = styles.showRule
    return showRule === TooltipShowRule.ALWAYS ||
      (showRule === TooltipShowRule.FOLLOW_CROSS && (crosshair.paneId !== undefined))
  }

  protected getIndicatorTooltipData (
    dataList: KLineData[],
    crosshair: Crosshair,
    indicator: Required<Indicator>,
    styles: IndicatorStyle
  ): IndicatorTooltipData {
    if (indicator.createToolTipDataSource !== null) {
      const widget = this.getWidget()
      const pane = widget.getPane()
      const chartStore = pane.getChart().getChartStore()
      return indicator.createToolTipDataSource({
        kLineDataList: dataList,
        indicator,
        visibleRange: chartStore.getTimeScaleStore().getVisibleRange(),
        bounding: widget.getBounding(),
        crosshair,
        defaultStyles: styles,
        xAxis: pane.getChart().getPaneById(XAXIS_PANE_ID)?.getAxisComponent() as Axis,
        yAxis: pane.getAxisComponent()
      })
    }

    const dataIndex = crosshair.dataIndex as number
    const result = indicator.result ?? []

    let calcParamText
    const calcParams = indicator.calcParams
    if (calcParams.length > 0) {
      calcParamText = `(${calcParams.join(',')})`
    }

    const indicatorData = result[dataIndex] ?? {}
    const values: IndicatorTooltipDataChild[] = []
    eachPlots(dataList, indicator, dataIndex, styles, (plot: IndicatorPlot, plotStyle: Required<IndicatorPlotStyle>) => {
      if (plot.title !== undefined) {
        let value = indicatorData[plot.key]
        if (isValid(value)) {
          value = formatPrecision(value, indicator.precision)
          if (indicator.shouldFormatBigNumber) {
            value = formatBigNumber(value)
          }
        }
        values.push({ title: plot.title, value: value ?? styles.tooltip.defaultValue, color: plotStyle.color })
      }
    })
    return { name: indicator.shortName, calcParamText, values }
  }
}
