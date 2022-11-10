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
import Precision from '../common/Precision'
import Crosshair from '../common/Crosshair'
import { Styles, CandleStyle, CandleTooltipValuesChild, CandleTooltipValuesCallback, TooltipShowType, YAxisPosition } from '../common/Styles'

import Indicator from '../componentl/Indicator'

import IndicatorTooltipView, { TooltipData } from './IndicatorTooltipView'

import { formatPrecision, formatBigNumber, formatDate } from '../common/utils/format'
import { createFont, calcTextWidth } from '../common/utils/canvas'
import { isArray, isString } from '../common/utils/typeChecks'

export default class CandleTooltipView extends IndicatorTooltipView {
  protected drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const bounding = widget.getBounding()
    const yAxisBounding = pane.getYAxisWidget()?.getBounding() as Bounding
    const chartStore = pane.getChart().getChartStore()
    const dataList = chartStore.getDataList()
    const precision = chartStore.getPrecision()
    const crosshair = chartStore.getCrosshairStore().get()
    const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
    const dateTimeFormat = chartStore.getTimeScaleStore().getDateTimeFormat()
    const styles = chartStore.getStyleOptions()
    const candleStyles = styles.candle
    const indicatorStyles = styles.indicator
    if (
      candleStyles.tooltip.showType === TooltipShowType.RECT &&
      indicatorStyles.tooltip.showType === TooltipShowType.RECT
    ) {
      this._drawRectTooltip(
        ctx, dataList, indicators,
        bounding, yAxisBounding,
        crosshair, precision, dateTimeFormat,
        styles, 0
      )
    } else if (
      candleStyles.tooltip.showType === TooltipShowType.STANDARD &&
      indicatorStyles.tooltip.showType === TooltipShowType.STANDARD
    ) {
      const top = this._drawCandleStandardTooltip(ctx, bounding, crosshair, precision, dateTimeFormat, candleStyles)
      this.drawIndicatorTooltip(ctx, dataList, crosshair, indicators, bounding, indicatorStyles, top)
    } else if (
      candleStyles.tooltip.showType === TooltipShowType.RECT &&
      indicatorStyles.tooltip.showType === TooltipShowType.STANDARD
    ) {
      const top = this.drawIndicatorTooltip(ctx, dataList, crosshair, indicators, bounding, indicatorStyles, 0)
      this._drawRectTooltip(
        ctx, dataList, indicators,
        bounding, yAxisBounding,
        crosshair, precision, dateTimeFormat,
        styles, top
      )
    }
  }

  private _drawCandleStandardTooltip (
    ctx: CanvasRenderingContext2D,
    bounding: Bounding,
    crosshair: Crosshair,
    precision: Precision,
    dateTimeFormat: Intl.DateTimeFormat,
    styles: CandleStyle
  ): number {
    const tooltipStyles = styles.tooltip
    const tooltipTextStyles = tooltipStyles.text
    let height = 0
    if (this.isDrawTooltip(crosshair, tooltipStyles)) {
      const values = this._getCandleTooltipData(crosshair.kLineData as KLineData, precision, dateTimeFormat, styles)
      if (values.length > 0) {
        height += (tooltipTextStyles.marginTop + tooltipTextStyles.size + tooltipTextStyles.marginBottom)
        height += this.drawStandardTooltip(ctx, bounding, values, 0, tooltipTextStyles.marginTop, tooltipTextStyles)
      }
    }
    return height
  }

  private _drawRectTooltip (
    ctx: CanvasRenderingContext2D,
    dataList: KLineData[],
    indicators: Map<string, Indicator>,
    bounding: Bounding,
    yAxisBounding: Bounding,
    crosshair: Crosshair,
    precision: Precision,
    dateTimeFormat: Intl.DateTimeFormat,
    styles: Styles,
    top: number
  ): void {
    const candleStyles = styles.candle
    const indicatorStyles = styles.indicator
    const candleTooltipStyles = candleStyles.tooltip
    const indicatorTooltipStyles = indicatorStyles.tooltip
    const isDrawCandleTooltip = this.isDrawTooltip(crosshair, candleTooltipStyles)
    const isDrawIndicatorTooltip = this.isDrawTooltip(crosshair, indicatorTooltipStyles)
    if (isDrawCandleTooltip || !isDrawIndicatorTooltip) {
      const baseValues = this._getCandleTooltipData(crosshair.kLineData as KLineData, precision, dateTimeFormat, candleStyles)
      const {
        marginLeft: baseTextMarginLeft,
        marginRight: baseTextMarginRight,
        marginTop: baseTextMarginTop,
        marginBottom: baseTextMarginBottom,
        size: baseTextSize,
        weight: baseTextWeight,
        family: baseTextFamily
      } = candleTooltipStyles.text

      const {
        paddingLeft: rectPaddingLeft,
        paddingRight: rectPaddingRight,
        paddingTop: rectPaddingTop,
        paddingBottom: rectPaddingBottom,
        offsetLeft: rectLeft,
        offsetRight: rectRight,
        offsetTop: rectOffsetTop,
        borderSize: rectBorderSize,
        borderRadius: rectBorderRadius,
        borderColor: rectBorderColor,
        color: rectBackgroundColor
      } = candleTooltipStyles.rect

      let maxLabelWidth = 0
      let rectWidth = 0
      let rectHeight = 0
      if (isDrawCandleTooltip) {
        ctx.font = createFont(baseTextSize, baseTextWeight, baseTextFamily)
        baseValues.forEach(value => {
          const text = `${value.title}${value.value}`
          const labelWidth = calcTextWidth(ctx, text) + baseTextMarginLeft + baseTextMarginRight
          maxLabelWidth = Math.max(maxLabelWidth, labelWidth)
        })
        rectHeight += ((baseTextMarginBottom + baseTextMarginTop + baseTextSize) * baseValues.length)
      }

      const {
        marginLeft: indicatorTextMarginLeft,
        marginRight: indicatorTextMarginRight,
        marginTop: indicatorTextMarginTop,
        marginBottom: indicatorTextMarginBottom,
        size: indicatorTextSize,
        weight: indicatorTextWeight,
        family: indicatorTextFamily
      } = indicatorTooltipStyles.text
      const indicatorValues: TooltipData[][] = []
      if (isDrawIndicatorTooltip) {
        ctx.font = createFont(indicatorTextSize, indicatorTextWeight, indicatorTextFamily)
        indicators.forEach(indicator => {
          const values = this.getIndicatorTooltipData(dataList, crosshair, indicator, indicatorStyles).values ?? []
          indicatorValues.push(values)
          values.forEach(value => {
            const text = `${value.title}${value.value}`
            const labelWidth = calcTextWidth(ctx, text) + indicatorTextMarginLeft + indicatorTextMarginRight
            maxLabelWidth = Math.max(maxLabelWidth, labelWidth)
            rectHeight += (indicatorTextMarginTop + indicatorTextMarginBottom + indicatorTextSize)
          })
        })
      }
      rectWidth += maxLabelWidth
      if (rectWidth !== 0 && rectHeight !== 0) {
        rectWidth += (rectBorderSize * 2 + rectPaddingLeft + rectPaddingRight)
        rectHeight += (rectBorderSize * 2 + rectPaddingTop + rectPaddingBottom)
        const centerX = bounding.width / 2
        let rectX: number
        if ((crosshair.realX ?? 0) < centerX) {
          rectX = bounding.width - rectRight - rectWidth
          if (styles.yAxis.inside && styles.yAxis.position === YAxisPosition.RIGHT) {
            rectX -= yAxisBounding.width
          }
        } else {
          rectX = rectLeft
          if (styles.yAxis.inside && styles.yAxis.position === YAxisPosition.LEFT) {
            rectX += yAxisBounding.width
          }
        }
        const rectY = top + rectOffsetTop
        this.createFigure(
          'rect',
          {
            x: rectX,
            y: rectY,
            width: rectWidth,
            height: rectHeight
          },
          {
            color: rectBackgroundColor,
            borderColor: rectBorderColor,
            borderSize: rectBorderSize,
            borderRadius: rectBorderRadius
          }
        )?.draw(ctx)
        const baseLabelX = rectX + rectBorderSize + rectPaddingLeft + baseTextMarginLeft
        let labelY = rectY + rectBorderSize + rectPaddingTop
        if (isDrawCandleTooltip) {
          // 开始渲染基础数据文字
          baseValues.forEach(value => {
            labelY += baseTextMarginTop
            this.createFigure(
              'text',
              {
                x: baseLabelX,
                y: labelY,
                text: value.title
              },
              {
                color: value.color,
                size: baseTextSize,
                family: baseTextFamily,
                weight: baseTextWeight
              }
            )?.draw(ctx)
            this.createFigure(
              'text',
              {
                x: rectX + rectWidth - rectBorderSize - baseTextMarginRight - rectPaddingRight,
                y: labelY,
                text: value.value
              },
              {
                color: value.color,
                size: baseTextSize,
                family: baseTextFamily,
                weight: baseTextWeight,
                align: 'right'
              }
            )?.draw(ctx)
            labelY += (baseTextSize + baseTextMarginBottom)
          })
        }
        if (isDrawIndicatorTooltip) {
          // 开始渲染指标数据文字
          const indicatorLabelX = rectX + rectBorderSize + rectPaddingLeft + indicatorTextMarginLeft
          indicatorValues.forEach(values => {
            values.forEach(value => {
              labelY += indicatorTextMarginTop
              this.createFigure(
                'text',
                {
                  x: indicatorLabelX,
                  y: labelY,
                  text: value.title
                },
                {
                  color: value.color,
                  size: indicatorTextSize,
                  family: indicatorTextFamily,
                  weight: indicatorTextWeight
                }
              )?.draw(ctx)

              this.createFigure(
                'text',
                {
                  x: rectX + rectWidth - rectBorderSize - indicatorTextMarginRight - rectPaddingRight,
                  y: labelY,
                  text: value.value
                },
                {
                  color: value.color,
                  size: indicatorTextSize,
                  family: indicatorTextFamily,
                  weight: indicatorTextWeight,
                  align: 'right'
                }
              )?.draw(ctx)
              labelY += (indicatorTextSize + indicatorTextMarginBottom)
            })
          })
        }
      }
    }
  }

  private _getCandleTooltipData (
    data: KLineData,
    precision: Precision,
    dateTimeFormat: Intl.DateTimeFormat,
    styles: CandleStyle
  ): TooltipData[] {
    const tooltipStyles = styles.tooltip
    const textColor = tooltipStyles.text.color
    const baseValues = tooltipStyles.values
    const baseLabels = tooltipStyles.labels
    const { price: pricePrecision, volume: volumePrecision } = precision
    if (baseValues !== null) {
      let values: any[]
      if (isArray(baseValues)) {
        values = baseValues as Array<string | CandleTooltipValuesChild>
      } else {
        values = (baseValues as CandleTooltipValuesCallback)(data, styles)
      }
      return baseLabels.map((label, i) => {
        const value = values[i]
        if (isString(value)) {
          return { title: label, value: value ?? tooltipStyles.defaultValue, color: textColor }
        }
        return { title: label, value: value.value ?? tooltipStyles.defaultValue, color: value.color }
      })
    }
    return [
      { title: baseLabels[0], value: formatDate(dateTimeFormat, data.timestamp, 'YYYY-MM-DD hh:mm'), color: textColor },
      { title: baseLabels[1], value: formatPrecision(data.open, pricePrecision), color: textColor },
      { title: baseLabels[2], value: formatPrecision(data.high, pricePrecision), color: textColor },
      { title: baseLabels[3], value: formatPrecision(data.low, pricePrecision), color: textColor },
      { title: baseLabels[4], value: formatPrecision(data.close, pricePrecision), color: textColor },
      { title: baseLabels[5], value: formatBigNumber(formatPrecision(data.volume ?? tooltipStyles.defaultValue, volumePrecision)), color: textColor }
    ]
  }
}
