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
import { Styles, CandleStyle, TooltipData, TooltipDataChild, TooltipShowType, YAxisPosition, PolygonType, CustomApi, FormatDateType } from '../common/Options'

import Indicator from '../component/Indicator'

import IndicatorTooltipView from './IndicatorTooltipView'

import { i18n } from '../extension/i18n/index'

import { formatPrecision } from '../common/utils/format'
import { createFont } from '../common/utils/canvas'
import { isString, isFunction } from '../common/utils/typeChecks'

export default class CandleTooltipView extends IndicatorTooltipView {
  protected drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const bounding = widget.getBounding()
    const yAxisBounding = pane.getYAxisWidget()?.getBounding() as Bounding
    const chartStore = pane.getChart().getChartStore()
    const dataList = chartStore.getDataList()
    const precision = chartStore.getPrecision()
    const locale = chartStore.getLocale()
    const customApi = chartStore.getCustomApi()
    const crosshair = chartStore.getCrosshairStore().get()
    const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
    const dateTimeFormat = chartStore.getTimeScaleStore().getDateTimeFormat()
    const styles = chartStore.getStyles()
    const candleStyles = styles.candle
    const indicatorStyles = styles.indicator
    if (
      candleStyles.tooltip.showType === TooltipShowType.RECT &&
      indicatorStyles.tooltip.showType === TooltipShowType.RECT
    ) {
      const isDrawCandleTooltip = this.isDrawTooltip(crosshair, candleStyles.tooltip)
      const isDrawIndicatorTooltip = this.isDrawTooltip(crosshair, indicatorStyles.tooltip)
      this._drawRectTooltip(
        ctx, dataList, indicators,
        bounding, yAxisBounding,
        crosshair, precision,
        dateTimeFormat, locale, customApi,
        isDrawCandleTooltip, isDrawIndicatorTooltip,
        styles, 0
      )
    } else if (
      candleStyles.tooltip.showType === TooltipShowType.STANDARD &&
      indicatorStyles.tooltip.showType === TooltipShowType.STANDARD
    ) {
      const top = this._drawCandleStandardTooltip(
        ctx, bounding, crosshair, precision,
        dateTimeFormat, locale, customApi, candleStyles
      )
      this.drawIndicatorTooltip(ctx, dataList, crosshair, indicators, customApi, bounding, indicatorStyles, top)
    } else if (
      candleStyles.tooltip.showType === TooltipShowType.RECT &&
      indicatorStyles.tooltip.showType === TooltipShowType.STANDARD
    ) {
      const top = this.drawIndicatorTooltip(ctx, dataList, crosshair, indicators, customApi, bounding, indicatorStyles, 0)
      const isDrawCandleTooltip = this.isDrawTooltip(crosshair, candleStyles.tooltip)
      this._drawRectTooltip(
        ctx, dataList, indicators,
        bounding, yAxisBounding,
        crosshair, precision, dateTimeFormat,
        locale, customApi,
        isDrawCandleTooltip, false,
        styles, top
      )
    } else {
      const top = this._drawCandleStandardTooltip(
        ctx, bounding, crosshair, precision,
        dateTimeFormat, locale, customApi, candleStyles
      )
      const isDrawIndicatorTooltip = this.isDrawTooltip(crosshair, indicatorStyles.tooltip)
      this._drawRectTooltip(
        ctx, dataList, indicators,
        bounding, yAxisBounding,
        crosshair, precision, dateTimeFormat,
        locale, customApi,
        false, isDrawIndicatorTooltip,
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
    locale: string,
    customApi: CustomApi,
    styles: CandleStyle
  ): number {
    const tooltipStyles = styles.tooltip
    const tooltipTextStyles = tooltipStyles.text
    let height = 0
    if (this.isDrawTooltip(crosshair, tooltipStyles)) {
      const values = this._getCandleTooltipData(
        crosshair.kLineData as KLineData, precision,
        dateTimeFormat, locale, customApi, styles
      )
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
    locale: string,
    customApi: CustomApi,
    isDrawCandleTooltip: boolean,
    isDrawIndicatorTooltip: boolean,
    styles: Styles,
    top: number
  ): void {
    const candleStyles = styles.candle
    const indicatorStyles = styles.indicator
    const candleTooltipStyles = candleStyles.tooltip
    const indicatorTooltipStyles = indicatorStyles.tooltip
    if (isDrawCandleTooltip || isDrawIndicatorTooltip) {
      const candleTooltipDatas = this._getCandleTooltipData(
        crosshair.kLineData as KLineData, precision,
        dateTimeFormat, locale, customApi, candleStyles
      )
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

      let maxTextWidth = 0
      let rectWidth = 0
      let rectHeight = 0
      if (isDrawCandleTooltip) {
        ctx.font = createFont(baseTextSize, baseTextWeight, baseTextFamily)
        candleTooltipDatas.forEach(data => {
          const title = data.title as TooltipDataChild
          const value = data.value as TooltipDataChild
          const text = `${title.text}${value.text}`
          const labelWidth = ctx.measureText(text).width + baseTextMarginLeft + baseTextMarginRight
          maxTextWidth = Math.max(maxTextWidth, labelWidth)
        })
        rectHeight += ((baseTextMarginBottom + baseTextMarginTop + baseTextSize) * candleTooltipDatas.length)
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
      const indicatorTooltipDatas: TooltipData[][] = []
      if (isDrawIndicatorTooltip) {
        ctx.font = createFont(indicatorTextSize, indicatorTextWeight, indicatorTextFamily)
        indicators.forEach(indicator => {
          const tooltipDatas = this.getIndicatorTooltipData(dataList, crosshair, indicator, customApi, indicatorStyles).values ?? []
          indicatorTooltipDatas.push(tooltipDatas)
          tooltipDatas.forEach(data => {
            const title = data.title as TooltipDataChild
            const value = data.value as TooltipDataChild
            const text = `${title.text}${value.text}`
            const textWidth = ctx.measureText(text).width + indicatorTextMarginLeft + indicatorTextMarginRight
            maxTextWidth = Math.max(maxTextWidth, textWidth)
            rectHeight += (indicatorTextMarginTop + indicatorTextMarginBottom + indicatorTextSize)
          })
        })
      }
      rectWidth += maxTextWidth
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
            style: PolygonType.STROKE_FILL,
            color: rectBackgroundColor,
            borderColor: rectBorderColor,
            borderSize: rectBorderSize,
            borderRadius: rectBorderRadius
          }
        )?.draw(ctx)
        const candleTextX = rectX + rectBorderSize + rectPaddingLeft + baseTextMarginLeft
        let textY = rectY + rectBorderSize + rectPaddingTop
        if (isDrawCandleTooltip) {
          // 开始渲染基础数据文字
          candleTooltipDatas.forEach(data => {
            textY += baseTextMarginTop
            const title = data.title as TooltipDataChild
            this.createFigure(
              'text',
              {
                x: candleTextX,
                y: textY,
                text: title.text
              },
              {
                color: title.color,
                size: baseTextSize,
                family: baseTextFamily,
                weight: baseTextWeight
              }
            )?.draw(ctx)
            const value = data.value as TooltipDataChild
            this.createFigure(
              'text',
              {
                x: rectX + rectWidth - rectBorderSize - baseTextMarginRight - rectPaddingRight,
                y: textY,
                text: value.text,
                align: 'right'
              },
              {
                color: value.color,
                size: baseTextSize,
                family: baseTextFamily,
                weight: baseTextWeight
              }
            )?.draw(ctx)
            textY += (baseTextSize + baseTextMarginBottom)
          })
        }
        if (isDrawIndicatorTooltip) {
          // 开始渲染指标数据文字
          const indicatorTextX = rectX + rectBorderSize + rectPaddingLeft + indicatorTextMarginLeft
          indicatorTooltipDatas.forEach(datas => {
            datas.forEach(data => {
              textY += indicatorTextMarginTop
              const title = data.title as TooltipDataChild
              const value = data.value as TooltipDataChild
              this.createFigure(
                'text',
                {
                  x: indicatorTextX,
                  y: textY,
                  text: title.text
                },
                {
                  color: title.color,
                  size: indicatorTextSize,
                  family: indicatorTextFamily,
                  weight: indicatorTextWeight
                }
              )?.draw(ctx)

              this.createFigure(
                'text',
                {
                  x: rectX + rectWidth - rectBorderSize - indicatorTextMarginRight - rectPaddingRight,
                  y: textY,
                  text: value.text,
                  align: 'right'
                },
                {
                  color: value.color,
                  size: indicatorTextSize,
                  family: indicatorTextFamily,
                  weight: indicatorTextWeight
                }
              )?.draw(ctx)
              textY += (indicatorTextSize + indicatorTextMarginBottom)
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
    locale: string,
    customApi: CustomApi,
    styles: CandleStyle
  ): TooltipData[] {
    const tooltipStyles = styles.tooltip
    const textColor = tooltipStyles.text.color
    let tooltipData: TooltipData[] = []
    if (isFunction(tooltipStyles.custom)) {
      const labelValues = tooltipStyles.custom?.(data, styles) ?? []
      labelValues.forEach(({ title, value }) => {
        let t: TooltipDataChild = { text: '', color: '' }
        if (isString(title)) {
          t.text = title as string
          t.color = textColor
        } else {
          t = title as TooltipDataChild
        }
        t.text = i18n(t.text, locale)
        let v: TooltipDataChild = { text: '', color: '' }
        if (isString(value)) {
          v.text = value as string
          v.color = textColor
        } else {
          v = value as TooltipDataChild
        }
        tooltipData.push({ title: t, value: v })
      })
    } else {
      const { price: pricePrecision, volume: volumePrecision } = precision
      tooltipData = [
        {
          title: { text: i18n('time', locale), color: textColor },
          value: { text: customApi.formatDate(dateTimeFormat, data.timestamp, 'YYYY-MM-DD HH:mm', FormatDateType.TOOLTIP), color: textColor }
        }, {
          title: { text: i18n('open', locale), color: textColor },
          value: { text: formatPrecision(data.open, pricePrecision), color: textColor }
        }, {
          title: { text: i18n('high', locale), color: textColor },
          value: { text: formatPrecision(data.high, pricePrecision), color: textColor }
        }, {
          title: { text: i18n('low', locale), color: textColor },
          value: { text: formatPrecision(data.low, pricePrecision), color: textColor }
        }, {
          title: { text: i18n('close', locale), color: textColor },
          value: { text: formatPrecision(data.close, pricePrecision), color: textColor }
        }, {
          title: { text: i18n('volume', locale), color: textColor },
          value: {
            text: customApi.formatBigNumber(formatPrecision(data.volume ?? tooltipStyles.defaultValue, volumePrecision)),
            color: textColor
          }
        }
      ]
    }
    return tooltipData
  }
}
