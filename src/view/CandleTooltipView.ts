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
import type Bounding from '../common/Bounding'
import type KLineData from '../common/KLineData'
import type Precision from '../common/Precision'
import type Crosshair from '../common/Crosshair'
import {
  type Styles, type CandleStyle, type TooltipData, type TooltipDataChild, TooltipShowType, CandleTooltipRectPosition,
  type CandleTooltipCustomCallbackData, YAxisPosition, PolygonType
} from '../common/Styles'
import { formatPrecision, formatThousands, formatFoldDecimal } from '../common/utils/format'
import { createFont } from '../common/utils/canvas'
import { isFunction, isObject, isValid } from '../common/utils/typeChecks'

import { type CustomApi, FormatDateType } from '../Options'

import { PaneIdConstants } from '../pane/types'

import type Indicator from '../component/Indicator'

import IndicatorTooltipView from './IndicatorTooltipView'

import { type TooltipIcon } from '../store/TooltipStore'

import { i18n } from '../extension/i18n/index'

export default class CandleTooltipView extends IndicatorTooltipView {
  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const paneId = pane.getId()
    const chartStore = pane.getChart().getChartStore()
    const crosshair = chartStore.getTooltipStore().getCrosshair()
    if (isValid(crosshair.kLineData)) {
      const bounding = widget.getBounding()
      const yAxisBounding = pane.getYAxisWidget()!.getBounding()
      const dataList = chartStore.getDataList()
      const precision = chartStore.getPrecision()
      const locale = chartStore.getLocale()
      const customApi = chartStore.getCustomApi()
      const thousandsSeparator = chartStore.getThousandsSeparator()
      const decimalFoldThreshold = chartStore.getDecimalFoldThreshold()
      const activeIcon = chartStore.getTooltipStore().getActiveIcon()
      const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
      const dateTimeFormat = chartStore.getTimeScaleStore().getDateTimeFormat()
      const styles = chartStore.getStyles()
      const candleStyles = styles.candle
      const indicatorStyles = styles.indicator
      if (
        candleStyles.tooltip.showType === TooltipShowType.Rect &&
        indicatorStyles.tooltip.showType === TooltipShowType.Rect
      ) {
        const isDrawCandleTooltip = this.isDrawTooltip(crosshair, candleStyles.tooltip)
        const isDrawIndicatorTooltip = this.isDrawTooltip(crosshair, indicatorStyles.tooltip)
        this._drawRectTooltip(
          ctx, dataList, indicators,
          bounding, yAxisBounding,
          crosshair, precision,
          dateTimeFormat, locale, customApi, thousandsSeparator, decimalFoldThreshold,
          isDrawCandleTooltip, isDrawIndicatorTooltip,
          styles, 0
        )
      } else if (
        candleStyles.tooltip.showType === TooltipShowType.Standard &&
        indicatorStyles.tooltip.showType === TooltipShowType.Standard
      ) {
        const top = this._drawCandleStandardTooltip(
          ctx, dataList, paneId, bounding, crosshair, activeIcon, precision,
          dateTimeFormat, locale, customApi, thousandsSeparator, decimalFoldThreshold, candleStyles
        )
        this.drawIndicatorTooltip(
          ctx, paneId, dataList, crosshair,
          activeIcon, indicators, customApi,
          thousandsSeparator, decimalFoldThreshold,
          bounding, indicatorStyles, top
        )
      } else if (
        candleStyles.tooltip.showType === TooltipShowType.Rect &&
        indicatorStyles.tooltip.showType === TooltipShowType.Standard
      ) {
        const top = this.drawIndicatorTooltip(
          ctx, paneId, dataList, crosshair,
          activeIcon, indicators, customApi,
          thousandsSeparator, decimalFoldThreshold,
          bounding, indicatorStyles, 0
        )
        const isDrawCandleTooltip = this.isDrawTooltip(crosshair, candleStyles.tooltip)
        this._drawRectTooltip(
          ctx, dataList, indicators,
          bounding, yAxisBounding,
          crosshair, precision, dateTimeFormat,
          locale, customApi, thousandsSeparator, decimalFoldThreshold,
          isDrawCandleTooltip, false,
          styles, top
        )
      } else {
        const top = this._drawCandleStandardTooltip(
          ctx, dataList, paneId, bounding, crosshair, activeIcon, precision,
          dateTimeFormat, locale, customApi, thousandsSeparator, decimalFoldThreshold, candleStyles
        )
        const isDrawIndicatorTooltip = this.isDrawTooltip(crosshair, indicatorStyles.tooltip)
        this._drawRectTooltip(
          ctx, dataList, indicators,
          bounding, yAxisBounding,
          crosshair, precision, dateTimeFormat,
          locale, customApi, thousandsSeparator, decimalFoldThreshold,
          false, isDrawIndicatorTooltip,
          styles, top
        )
      }
    }
  }

  private _drawCandleStandardTooltip (
    ctx: CanvasRenderingContext2D,
    dataList: KLineData[],
    paneId: string,
    bounding: Bounding,
    crosshair: Crosshair,
    activeTooltipIcon: Nullable<TooltipIcon>,
    precision: Precision,
    dateTimeFormat: Intl.DateTimeFormat,
    locale: string,
    customApi: CustomApi,
    thousandsSeparator: string,
    decimalFoldThreshold: number,
    styles: CandleStyle
  ): number {
    const tooltipStyles = styles.tooltip
    const tooltipTextStyles = tooltipStyles.text
    let height = 0
    if (this.isDrawTooltip(crosshair, tooltipStyles)) {
      const dataIndex = crosshair.dataIndex ?? 0
      const values = this._getCandleTooltipData(
        { prev: dataList[dataIndex - 1] ?? null, current: crosshair.kLineData!, next: dataList[dataIndex + 1] ?? null },
        precision, dateTimeFormat, locale, customApi, thousandsSeparator, decimalFoldThreshold, styles
      )
      let x = 0
      let y = 0
      let prevRowHeight = 0
      const [leftIcons, middleIcons, rightIcons] = this.classifyTooltipIcons(tooltipStyles.icons)
      const [leftIconsNextStartX, leftIconsNextStartY, leftIconsLastRowHeight, leftIconsIncreaseHeight] = this.drawStandardTooltipIcons(
        ctx, bounding, { paneId, indicatorName: '', iconId: '' },
        activeTooltipIcon, leftIcons, x, y, 0
      )
      x = leftIconsNextStartX
      y = leftIconsNextStartY
      height += leftIconsIncreaseHeight
      prevRowHeight = leftIconsLastRowHeight

      const [middleIconsNextStartX, middleIconsNextStartY, middleIconsLastRowHeight, middleIconsIncreaseHeight] = this.drawStandardTooltipIcons(
        ctx, bounding, { paneId, indicatorName: '', iconId: '' },
        activeTooltipIcon, middleIcons, x, y, prevRowHeight
      )
      x = middleIconsNextStartX
      y = middleIconsNextStartY
      height += middleIconsIncreaseHeight
      prevRowHeight = middleIconsLastRowHeight

      if (values.length > 0) {
        const [valuesNextStartX, valuesIconsNextStartY, valuesIconsLastRowHeight, valuesIconsIncreaseHeight] = this.drawStandardTooltipLabels(ctx, bounding, values, x, y, prevRowHeight, tooltipTextStyles)
        x = valuesNextStartX
        y = valuesIconsNextStartY
        height += valuesIconsIncreaseHeight
        prevRowHeight = valuesIconsLastRowHeight
      }

      const [rightIconsNextStartX, rightIconsNextStartY, rightIconsLastRowHeight, rightIconsIncreaseHeight] = this.drawStandardTooltipIcons(
        ctx, bounding, { paneId, indicatorName: '', iconId: '' },
        activeTooltipIcon, rightIcons, x, y, prevRowHeight
      )
      x = rightIconsNextStartX
      y = rightIconsNextStartY
      height += rightIconsIncreaseHeight
      prevRowHeight = rightIconsLastRowHeight
    }
    return height
  }

  private _drawRectTooltip (
    ctx: CanvasRenderingContext2D,
    dataList: KLineData[],
    indicators: Indicator[],
    bounding: Bounding,
    yAxisBounding: Bounding,
    crosshair: Crosshair,
    precision: Precision,
    dateTimeFormat: Intl.DateTimeFormat,
    locale: string,
    customApi: CustomApi,
    thousandsSeparator: string,
    decimalFoldThreshold: number,
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
      const dataIndex = crosshair.dataIndex ?? 0
      const candleTooltipDatas = this._getCandleTooltipData(
        { prev: dataList[dataIndex - 1] ?? null, current: crosshair.kLineData!, next: dataList[dataIndex + 1] ?? null },
        precision, dateTimeFormat, locale, customApi, thousandsSeparator, decimalFoldThreshold, candleStyles
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
        position: rectPosition,
        paddingLeft: rectPaddingLeft,
        paddingRight: rectPaddingRight,
        paddingTop: rectPaddingTop,
        paddingBottom: rectPaddingBottom,
        offsetLeft: rectOffsetLeft,
        offsetRight: rectOffsetRight,
        offsetTop: rectOffsetTop,
        offsetBottom: rectOffsetBottom,
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
      const indicatorTooltipDataValuess: TooltipData[][] = []
      if (isDrawIndicatorTooltip) {
        ctx.font = createFont(indicatorTextSize, indicatorTextWeight, indicatorTextFamily)
        indicators.forEach(indicator => {
          const tooltipDataValues = this.getIndicatorTooltipData(dataList, crosshair, indicator, customApi, thousandsSeparator, decimalFoldThreshold, indicatorStyles).values ?? []
          indicatorTooltipDataValuess.push(tooltipDataValues)
          tooltipDataValues.forEach(data => {
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
        const isPointer = rectPosition === CandleTooltipRectPosition.Pointer && crosshair.paneId === PaneIdConstants.CANDLE
        const isLeft = (crosshair.realX ?? 0) > centerX
        let rectX: number = 0
        if (isPointer) {
          const realX = crosshair.realX!
          if (isLeft) {
            rectX = realX - rectOffsetRight - rectWidth
          } else {
            rectX = realX + rectOffsetLeft
          }
        } else {
          if (isLeft) {
            rectX = rectOffsetLeft
            if (styles.yAxis.inside && styles.yAxis.position === YAxisPosition.Left) {
              rectX += yAxisBounding.width
            }
          } else {
            rectX = bounding.width - rectOffsetRight - rectWidth
            if (styles.yAxis.inside && styles.yAxis.position === YAxisPosition.Right) {
              rectX -= yAxisBounding.width
            }
          }
        }

        let rectY = top + rectOffsetTop
        if (isPointer) {
          const y = crosshair.y!
          rectY = y - rectHeight / 2
          if (rectY + rectHeight > bounding.height - rectOffsetBottom) {
            rectY = bounding.height - rectOffsetBottom - rectHeight
          }
          if (rectY < top + rectOffsetTop) {
            rectY = top + rectOffsetTop
          }
        }
        this.createFigure({
          name: 'rect',
          attrs: {
            x: rectX,
            y: rectY,
            width: rectWidth,
            height: rectHeight
          },
          styles: {
            style: PolygonType.StrokeFill,
            color: rectBackgroundColor,
            borderColor: rectBorderColor,
            borderSize: rectBorderSize,
            borderRadius: rectBorderRadius
          }
        })?.draw(ctx)
        const candleTextX = rectX + rectBorderSize + rectPaddingLeft + baseTextMarginLeft
        let textY = rectY + rectBorderSize + rectPaddingTop
        if (isDrawCandleTooltip) {
          // render candle texts
          candleTooltipDatas.forEach(data => {
            textY += baseTextMarginTop
            const title = data.title as TooltipDataChild
            this.createFigure({
              name: 'text',
              attrs: {
                x: candleTextX,
                y: textY,
                text: title.text
              },
              styles: {
                color: title.color,
                size: baseTextSize,
                family: baseTextFamily,
                weight: baseTextWeight
              }
            })?.draw(ctx)
            const value = data.value as TooltipDataChild
            this.createFigure({
              name: 'text',
              attrs: {
                x: rectX + rectWidth - rectBorderSize - baseTextMarginRight - rectPaddingRight,
                y: textY,
                text: value.text,
                align: 'right'
              },
              styles: {
                color: value.color,
                size: baseTextSize,
                family: baseTextFamily,
                weight: baseTextWeight
              }
            })?.draw(ctx)
            textY += (baseTextSize + baseTextMarginBottom)
          })
        }
        if (isDrawIndicatorTooltip) {
          // render indicator texts
          const indicatorTextX = rectX + rectBorderSize + rectPaddingLeft + indicatorTextMarginLeft
          indicatorTooltipDataValuess.forEach(datas => {
            datas.forEach(data => {
              textY += indicatorTextMarginTop
              const title = data.title as TooltipDataChild
              const value = data.value as TooltipDataChild
              this.createFigure({
                name: 'text',
                attrs: {
                  x: indicatorTextX,
                  y: textY,
                  text: title.text
                },
                styles: {
                  color: title.color,
                  size: indicatorTextSize,
                  family: indicatorTextFamily,
                  weight: indicatorTextWeight
                }
              })?.draw(ctx)

              this.createFigure({
                name: 'text',
                attrs: {
                  x: rectX + rectWidth - rectBorderSize - indicatorTextMarginRight - rectPaddingRight,
                  y: textY,
                  text: value.text,
                  align: 'right'
                },
                styles: {
                  color: value.color,
                  size: indicatorTextSize,
                  family: indicatorTextFamily,
                  weight: indicatorTextWeight
                }
              })?.draw(ctx)
              textY += (indicatorTextSize + indicatorTextMarginBottom)
            })
          })
        }
      }
    }
  }

  private _getCandleTooltipData (
    data: CandleTooltipCustomCallbackData,
    precision: Precision,
    dateTimeFormat: Intl.DateTimeFormat,
    locale: string,
    customApi: CustomApi,
    thousandsSeparator: string,
    decimalFoldThreshold: number,
    styles: CandleStyle
  ): TooltipData[] {
    const tooltipStyles = styles.tooltip
    const textColor = tooltipStyles.text.color
    const current = data.current
    const prevClose = data.prev?.close ?? current.close
    const changeValue = current.close - prevClose
    const { price: pricePrecision, volume: volumePrecision } = precision
    const mapping = {
      '{time}': customApi.formatDate(dateTimeFormat, current.timestamp, 'YYYY-MM-DD HH:mm', FormatDateType.Tooltip),
      '{open}': formatFoldDecimal(formatThousands(formatPrecision(current.open, pricePrecision), thousandsSeparator), decimalFoldThreshold),
      '{high}': formatFoldDecimal(formatThousands(formatPrecision(current.high, pricePrecision), thousandsSeparator), decimalFoldThreshold),
      '{low}': formatFoldDecimal(formatThousands(formatPrecision(current.low, pricePrecision), thousandsSeparator), decimalFoldThreshold),
      '{close}': formatFoldDecimal(formatThousands(formatPrecision(current.close, pricePrecision), thousandsSeparator), decimalFoldThreshold),
      '{volume}': formatFoldDecimal(formatThousands(
        customApi.formatBigNumber(formatPrecision(current.volume ?? tooltipStyles.defaultValue, volumePrecision)),
        thousandsSeparator
      ), decimalFoldThreshold),
      '{turnover}': formatFoldDecimal(formatThousands(
        formatPrecision(current.turnover ?? tooltipStyles.defaultValue, pricePrecision),
        thousandsSeparator
      ), decimalFoldThreshold),
      '{change}': prevClose === 0 ? tooltipStyles.defaultValue : `${formatThousands(formatPrecision(changeValue / prevClose * 100), thousandsSeparator)}%`
    }
    const labelValues = (
      isFunction(tooltipStyles.custom)
        ? tooltipStyles.custom?.(data, styles)
        : tooltipStyles.custom
    ) ?? [
      { title: 'time', value: '{time}' },
      { title: 'open', value: '{open}' },
      { title: 'high', value: '{high}' },
      { title: 'low', value: '{low}' },
      { title: 'close', value: '{close}' },
      { title: 'volume', value: '{volume}' }
    ]
    return labelValues.map(({ title, value }) => {
      let t: TooltipDataChild = { text: '', color: '' }
      if (isObject(title)) {
        t = { ...title }
      } else {
        t.text = title
        t.color = textColor
      }
      t.text = i18n(t.text, locale)
      let v: TooltipDataChild = { text: tooltipStyles.defaultValue, color: '' }
      if (isObject(value)) {
        v = { ...value }
      } else {
        v.text = value
        v.color = textColor
      }
      const match = v.text.match(/{(\S*)}/)
      if (match !== null && match.length > 1) {
        const key = `{${match[1]}}`
        v.text = v.text.replace(key, (mapping[key] ?? tooltipStyles.defaultValue) as string)
        if (key === '{change}') {
          v.color = changeValue === 0 ? styles.priceMark.last.noChangeColor : (changeValue > 0 ? styles.priceMark.last.upColor : styles.priceMark.last.downColor)
        }
      }
      return { title: t, value: v }
    })
  }
}
