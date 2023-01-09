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
import Crosshair from '../common/Crosshair'
import { IndicatorStyle, TooltipShowRule, TooltipStyle, MarginTextStyle, TooltipData, TooltipDataChild, CustomApi } from '../common/Options'

import XAxis from '../component/XAxis'
import YAxis from '../component/YAxis'

import IndicatorImp, { eachFigures, Indicator, IndicatorFigure, IndicatorFigureStyle, IndicatorTooltipData } from '../component/Indicator'

import { PaneIdConstants } from '../pane/Pane'

import { formatPrecision } from '../common/utils/format'
import { isValid, isString } from '../common/utils/typeChecks'
import { createFont } from '../common/utils/canvas'

import View from './View'

export default class IndicatorTooltipView extends View<YAxis> {
  protected drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const bounding = widget.getBounding()
    const chartStore = pane.getChart().getChartStore()
    const customApi = chartStore.getCustomApi()
    const crosshair = chartStore.getCrosshairStore().get()
    const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
    const defaultStyles = chartStore.getStyles().indicator
    this.drawIndicatorTooltip(ctx, chartStore.getDataList(), crosshair, indicators, customApi, bounding, defaultStyles)
  }

  protected drawIndicatorTooltip (
    ctx: CanvasRenderingContext2D,
    dataList: KLineData[],
    crosshair: Crosshair,
    indicators: Map<string, IndicatorImp>,
    customApi: CustomApi,
    bounding: Bounding,
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
      let labelY = top ?? 0
      ctx.font = createFont(textSize, textWeight, textFamily)
      indicators.forEach(indicator => {
        const { name, calcParamsText, values } = this.getIndicatorTooltipData(dataList, crosshair, indicator, customApi, styles)
        const nameValid = name !== undefined && name.length > 0
        const valuesValid = values !== undefined && values.length > 0
        let labelX = 0
        if (nameValid || valuesValid) {
          labelY += tooltipTextStyles.marginTop
          height += (tooltipTextStyles.marginTop + textSize + tooltipTextStyles.marginBottom)
          if (nameValid && tooltipStyles.showName) {
            labelX += textMarginLeft
            let text = name
            if (calcParamsText !== undefined && calcParamsText.length > 0 && tooltipStyles.showParams) {
              text = `${text}${calcParamsText}`
            }
            this.createFigure(
              'text',
              {
                x: labelX,
                y: labelY,
                text
              },
              {
                color: tooltipTextStyles.color,
                size: textSize,
                family: textFamily,
                weight: textWeight
              }
            )?.draw(ctx)
            labelX += (ctx.measureText(text).width + textMarginRight)
          }
          if (valuesValid) {
            const h = this.drawStandardTooltip(ctx, bounding, values, labelX, labelY, tooltipTextStyles)
            height += h
            labelY += h
          }
          labelY += (textSize + tooltipTextStyles.marginBottom)
        }
      })
    }
    return height
  }

  protected drawStandardTooltip (
    ctx: CanvasRenderingContext2D,
    bounding: Bounding,
    values: TooltipData[],
    startX: number,
    startY: number,
    styles: Omit<MarginTextStyle, 'show'>
  ): number {
    let labelX = startX
    let labelY = startY
    let height = 0
    const { marginLeft, marginTop, marginRight, marginBottom, size, family, weight } = styles
    ctx.font = createFont(size, weight, family)
    values.forEach((data, index) => {
      const title = data.title as TooltipDataChild
      const value = data.value as TooltipDataChild
      const titleTextWidth = ctx.measureText(title.text).width
      const valueTextWidth = ctx.measureText(value.text).width
      const totalTextWidth = titleTextWidth + valueTextWidth
      if (labelX + marginLeft + totalTextWidth + marginRight > bounding.width) {
        labelX = marginLeft
        height += (size + marginTop + marginBottom)
        labelY += (size + marginTop + marginBottom)
      } else {
        labelX += marginLeft
      }
      this.createFigure(
        'text',
        {
          x: labelX,
          y: labelY,
          text: title.text
        },
        { color: title.color, size, family, weight }
      )?.draw(ctx)
      labelX += titleTextWidth
      this.createFigure(
        'text',
        {
          x: labelX,
          y: labelY,
          text: value.text
        },
        { color: value.color, size, family, weight }
      )?.draw(ctx)
      labelX += (valueTextWidth + marginRight)
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
    indicator: Indicator,
    customApi: CustomApi,
    styles: IndicatorStyle
  ): IndicatorTooltipData {
    if (indicator.createToolTipDataSource !== null) {
      const widget = this.getWidget()
      const pane = widget.getPane()
      const chartStore = pane.getChart().getChartStore()
      const indicatorTooltipDatas = indicator.createToolTipDataSource({
        kLineDataList: dataList,
        indicator,
        visibleRange: chartStore.getTimeScaleStore().getVisibleRange(),
        bounding: widget.getBounding(),
        crosshair,
        defaultStyles: styles,
        xAxis: pane.getChart().getPaneById(PaneIdConstants.XAXIS)?.getAxisComponent() as XAxis,
        yAxis: pane.getAxisComponent()
      })
      if (indicatorTooltipDatas.values !== undefined) {
        const tooltipDatas: TooltipData[] = []
        const color = styles.tooltip.text.color
        indicatorTooltipDatas.values.forEach(data => {
          let title = { text: '', color }
          if (isString(data.title)) {
            title.text = data.title as string
          } else {
            title = data.title as TooltipDataChild
          }
          let value = { text: '', color }
          if (isString(data.value)) {
            value.text = data.value as string
          } else {
            value = data.value as TooltipDataChild
          }
          tooltipDatas.push({ title, value })
        })
        indicatorTooltipDatas.values = tooltipDatas
      }
      return indicatorTooltipDatas
    }

    const dataIndex = crosshair.dataIndex as number
    const result = indicator.result ?? []

    let calcParamsText = ''
    const calcParams = indicator.calcParams
    if (calcParams.length > 0) {
      calcParamsText = `(${calcParams.join(',')})`
    }

    const indicatorData = result[dataIndex] ?? {}
    const values: TooltipData[] = []
    eachFigures(dataList, indicator, dataIndex, styles, (figure: IndicatorFigure, figureStyles: Required<IndicatorFigureStyle>) => {
      if (figure.title !== undefined) {
        const color = figureStyles.color
        let value = indicatorData[figure.key]
        if (isValid(value)) {
          value = formatPrecision(value, indicator.precision)
          if (indicator.shouldFormatBigNumber) {
            value = customApi.formatBigNumber(value)
          }
        }
        values.push({ title: { text: figure.title, color }, value: { text: value ?? styles.tooltip.defaultValue, color } })
      }
    })
    return { name: indicator.shortName, calcParamsText, values }
  }
}
