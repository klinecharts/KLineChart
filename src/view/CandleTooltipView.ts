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

import type {
  TooltipLegend, TooltipLegendChild
} from '../common/Styles'
import { formatPrecision, formatTemplateString } from '../common/utils/format'
import { createFont } from '../common/utils/canvas'
import { isFunction, isObject, isValid } from '../common/utils/typeChecks'
import { PeriodTypeCrosshairTooltipFormat } from '../common/Period'

import { PaneIdConstants } from '../pane/types'

import IndicatorTooltipView from './IndicatorTooltipView'

import { i18n } from '../extension/i18n/index'

export default class CandleTooltipView extends IndicatorTooltipView {
  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const chartStore = widget.getPane().getChart().getChartStore()
    const crosshair = chartStore.getCrosshair()
    if (isValid(crosshair.kLineData)) {
      const bounding = widget.getBounding()
      const styles = chartStore.getStyles()
      const candleStyles = styles.candle
      const indicatorStyles = styles.indicator
      if (
        candleStyles.tooltip.showType === 'rect' &&
        indicatorStyles.tooltip.showType === 'rect'
      ) {
        const isDrawCandleTooltip = this.isDrawTooltip(crosshair, candleStyles.tooltip)
        const isDrawIndicatorTooltip = this.isDrawTooltip(crosshair, indicatorStyles.tooltip)
        this._drawRectTooltip(
          ctx, isDrawCandleTooltip, isDrawIndicatorTooltip,
          candleStyles.tooltip.offsetTop
        )
      } else if (
        candleStyles.tooltip.showType === 'standard' &&
        indicatorStyles.tooltip.showType === 'standard'
      ) {
        const { offsetLeft, offsetTop, offsetRight } = candleStyles.tooltip
        const maxWidth = bounding.width - offsetRight
        const top = this._drawCandleStandardTooltip(
          ctx, offsetLeft, offsetTop, maxWidth
        )
        this.drawIndicatorTooltip(ctx, offsetLeft, top, maxWidth)
      } else if (
        candleStyles.tooltip.showType === 'rect' &&
        indicatorStyles.tooltip.showType === 'standard'
      ) {
        const { offsetLeft, offsetTop, offsetRight } = candleStyles.tooltip
        const maxWidth = bounding.width - offsetRight
        const top = this.drawIndicatorTooltip(
          ctx, offsetLeft, offsetTop, maxWidth
        )
        const isDrawCandleTooltip = this.isDrawTooltip(crosshair, candleStyles.tooltip)
        this._drawRectTooltip(
          ctx, isDrawCandleTooltip, false, top
        )
      } else {
        const { offsetLeft, offsetTop, offsetRight } = candleStyles.tooltip
        const maxWidth = bounding.width - offsetRight
        const top = this._drawCandleStandardTooltip(
          ctx, offsetLeft, offsetTop, maxWidth
        )
        const isDrawIndicatorTooltip = this.isDrawTooltip(crosshair, indicatorStyles.tooltip)
        this._drawRectTooltip(
          ctx, false, isDrawIndicatorTooltip, top
        )
      }
    }
  }

  private _drawCandleStandardTooltip (
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    maxWidth: number
  ): number {
    const chartStore = this.getWidget().getPane().getChart().getChartStore()
    const styles = chartStore.getStyles().candle
    const tooltipStyles = styles.tooltip
    const tooltipLegendStyles = tooltipStyles.legend
    let prevRowHeight = 0
    const coordinate = { x: left, y: top }
    const crosshair = chartStore.getCrosshair()
    if (this.isDrawTooltip(crosshair, tooltipStyles)) {
      const tooltipTitleStyles = tooltipStyles.title
      if (tooltipTitleStyles.show) {
        const { type = '', span = '' } = chartStore.getPeriod() ?? {}
        const text = formatTemplateString(tooltipTitleStyles.template, { ...chartStore.getSymbol(), period: `${span}${i18n(type, chartStore.getLocale())}` })
        const color = tooltipTitleStyles.color
        const height = this.drawStandardTooltipLegends(
          ctx, [
            {
              title: { text: '', color },
              value: { text, color }
            }
          ], { x: left, y: top }, left,
          0, maxWidth, tooltipTitleStyles
        )
        coordinate.y = coordinate.y + height
      }

      const legends = this._getCandleTooltipLegends()
      const features = this.classifyTooltipFeatures(tooltipStyles.features)
      prevRowHeight = this.drawStandardTooltipFeatures(
        ctx, features[0], coordinate,
        null, left, prevRowHeight, maxWidth
      )
      prevRowHeight = this.drawStandardTooltipFeatures(
        ctx, features[1], coordinate,
        null, left, prevRowHeight, maxWidth
      )
      if (legends.length > 0) {
        prevRowHeight = this.drawStandardTooltipLegends(
          ctx, legends, coordinate, left,
          prevRowHeight, maxWidth, tooltipLegendStyles
        )
      }

      prevRowHeight = this.drawStandardTooltipFeatures(
        ctx, features[2], coordinate,
        null, left, prevRowHeight, maxWidth
      )
    }
    return coordinate.y + prevRowHeight
  }

  private _drawRectTooltip (
    ctx: CanvasRenderingContext2D,
    isDrawCandleTooltip: boolean,
    isDrawIndicatorTooltip: boolean,
    top: number
  ): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chartStore = pane.getChart().getChartStore()

    const styles = chartStore.getStyles()
    const candleStyles = styles.candle
    const indicatorStyles = styles.indicator
    const candleTooltipStyles = candleStyles.tooltip
    const indicatorTooltipStyles = indicatorStyles.tooltip
    if (isDrawCandleTooltip || isDrawIndicatorTooltip) {
      const candleLegends = this._getCandleTooltipLegends()
      const { offsetLeft, offsetTop, offsetRight, offsetBottom } = candleTooltipStyles

      const {
        marginLeft: baseLegendMarginLeft,
        marginRight: baseLegendMarginRight,
        marginTop: baseLegendMarginTop,
        marginBottom: baseLegendMarginBottom,
        size: baseLegendSize,
        weight: baseLegendWeight,
        family: baseLegendFamily
      } = candleTooltipStyles.legend

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
        ctx.font = createFont(baseLegendSize, baseLegendWeight, baseLegendFamily)
        candleLegends.forEach(data => {
          const title = data.title as TooltipLegendChild
          const value = data.value as TooltipLegendChild
          const text = `${title.text}${value.text}`
          const labelWidth = ctx.measureText(text).width + baseLegendMarginLeft + baseLegendMarginRight
          maxTextWidth = Math.max(maxTextWidth, labelWidth)
        })
        rectHeight += ((baseLegendMarginBottom + baseLegendMarginTop + baseLegendSize) * candleLegends.length)
      }

      const {
        marginLeft: indicatorLegendMarginLeft,
        marginRight: indicatorLegendMarginRight,
        marginTop: indicatorLegendMarginTop,
        marginBottom: indicatorLegendMarginBottom,
        size: indicatorLegendSize,
        weight: indicatorLegendWeight,
        family: indicatorLegendFamily
      } = indicatorTooltipStyles.legend
      const indicatorLegendsArray: TooltipLegend[][] = []
      if (isDrawIndicatorTooltip) {
        const indicators = chartStore.getIndicatorsByPaneId(pane.getId())
        ctx.font = createFont(indicatorLegendSize, indicatorLegendWeight, indicatorLegendFamily)
        indicators.forEach(indicator => {
          const tooltipDataLegends = this.getIndicatorTooltipData(indicator).legends
          indicatorLegendsArray.push(tooltipDataLegends)
          tooltipDataLegends.forEach(data => {
            const title = data.title as TooltipLegendChild
            const value = data.value as TooltipLegendChild
            const text = `${title.text}${value.text}`
            const textWidth = ctx.measureText(text).width + indicatorLegendMarginLeft + indicatorLegendMarginRight
            maxTextWidth = Math.max(maxTextWidth, textWidth)
            rectHeight += (indicatorLegendMarginTop + indicatorLegendMarginBottom + indicatorLegendSize)
          })
        })
      }
      rectWidth += maxTextWidth
      if (rectWidth !== 0 && rectHeight !== 0) {
        const crosshair = chartStore.getCrosshair()
        const bounding = widget.getBounding()
        const yAxisBounding = pane.getYAxisWidget()!.getBounding()
        rectWidth += (rectBorderSize * 2 + rectPaddingLeft + rectPaddingRight)
        rectHeight += (rectBorderSize * 2 + rectPaddingTop + rectPaddingBottom)
        const centerX = bounding.width / 2
        const isPointer = rectPosition === 'pointer' && crosshair.paneId === PaneIdConstants.CANDLE
        const isLeft = (crosshair.realX ?? 0) > centerX
        let rectX = 0
        if (isPointer) {
          const realX = crosshair.realX!
          if (isLeft) {
            rectX = realX - rectOffsetRight - rectWidth
          } else {
            rectX = realX + rectOffsetLeft
          }
        } else {
          const yAxis = this.getWidget().getPane().getAxisComponent()
          if (isLeft) {
            rectX = rectOffsetLeft + offsetLeft
            if (yAxis.inside && yAxis.position === 'left') {
              rectX += yAxisBounding.width
            }
          } else {
            rectX = bounding.width - rectOffsetRight - rectWidth - offsetRight
            if (yAxis.inside && yAxis.position === 'right') {
              rectX -= yAxisBounding.width
            }
          }
        }

        let rectY = top + rectOffsetTop
        if (isPointer) {
          const y = crosshair.y!
          rectY = y - rectHeight / 2
          if (rectY + rectHeight > bounding.height - rectOffsetBottom - offsetBottom) {
            rectY = bounding.height - rectOffsetBottom - rectHeight - offsetBottom
          }
          if (rectY < top + rectOffsetTop) {
            rectY = top + rectOffsetTop + offsetTop
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
            style: 'stroke_fill',
            color: rectBackgroundColor,
            borderColor: rectBorderColor,
            borderSize: rectBorderSize,
            borderRadius: rectBorderRadius
          }
        })?.draw(ctx)
        const candleTextX = rectX + rectBorderSize + rectPaddingLeft + baseLegendMarginLeft
        let textY = rectY + rectBorderSize + rectPaddingTop
        if (isDrawCandleTooltip) {
          // render candle texts
          candleLegends.forEach(data => {
            textY += baseLegendMarginTop
            const title = data.title as TooltipLegendChild
            this.createFigure({
              name: 'text',
              attrs: {
                x: candleTextX,
                y: textY,
                text: title.text
              },
              styles: {
                color: title.color,
                size: baseLegendSize,
                family: baseLegendFamily,
                weight: baseLegendWeight
              }
            })?.draw(ctx)
            const value = data.value as TooltipLegendChild
            this.createFigure({
              name: 'text',
              attrs: {
                x: rectX + rectWidth - rectBorderSize - baseLegendMarginRight - rectPaddingRight,
                y: textY,
                text: value.text,
                align: 'right'
              },
              styles: {
                color: value.color,
                size: baseLegendSize,
                family: baseLegendFamily,
                weight: baseLegendWeight
              }
            })?.draw(ctx)
            textY += (baseLegendSize + baseLegendMarginBottom)
          })
        }
        if (isDrawIndicatorTooltip) {
          // render indicator legends
          const indicatorTextX = rectX + rectBorderSize + rectPaddingLeft + indicatorLegendMarginLeft
          indicatorLegendsArray.forEach(legends => {
            legends.forEach(data => {
              textY += indicatorLegendMarginTop
              const title = data.title as TooltipLegendChild
              const value = data.value as TooltipLegendChild
              this.createFigure({
                name: 'text',
                attrs: {
                  x: indicatorTextX,
                  y: textY,
                  text: title.text
                },
                styles: {
                  color: title.color,
                  size: indicatorLegendSize,
                  family: indicatorLegendFamily,
                  weight: indicatorLegendWeight
                }
              })?.draw(ctx)

              this.createFigure({
                name: 'text',
                attrs: {
                  x: rectX + rectWidth - rectBorderSize - indicatorLegendMarginRight - rectPaddingRight,
                  y: textY,
                  text: value.text,
                  align: 'right'
                },
                styles: {
                  color: value.color,
                  size: indicatorLegendSize,
                  family: indicatorLegendFamily,
                  weight: indicatorLegendWeight
                }
              })?.draw(ctx)
              textY += (indicatorLegendSize + indicatorLegendMarginBottom)
            })
          })
        }
      }
    }
  }

  private _getCandleTooltipLegends (): TooltipLegend[] {
    const chartStore = this.getWidget().getPane().getChart().getChartStore()
    const styles = chartStore.getStyles().candle
    const dataList = chartStore.getDataList()
    const formatter = chartStore.getInnerFormatter()
    const decimalFold = chartStore.getDecimalFold()
    const thousandsSeparator = chartStore.getThousandsSeparator()
    const locale = chartStore.getLocale()
    const { pricePrecision = 2, volumePrecision = 0 } = chartStore.getSymbol() ?? {}
    const period = chartStore.getPeriod()
    const dataIndex = chartStore.getCrosshair().dataIndex ?? 0

    const tooltipStyles = styles.tooltip
    const { color: textColor, defaultValue, custom } = tooltipStyles.legend
    const prev = dataList[dataIndex - 1] ?? null
    const current = dataList[dataIndex]

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
    const prevClose = prev?.close ?? current.close
    const changeValue = current.close - prevClose
    const mapping = {
      ...current,
      time: formatter.formatDate(current.timestamp, PeriodTypeCrosshairTooltipFormat[period?.type ?? 'day'], 'tooltip'),
      open: decimalFold.format(thousandsSeparator.format(formatPrecision(current.open, pricePrecision))),
      high: decimalFold.format(thousandsSeparator.format(formatPrecision(current.high, pricePrecision))),
      low: decimalFold.format(thousandsSeparator.format(formatPrecision(current.low, pricePrecision))),
      close: decimalFold.format(thousandsSeparator.format(formatPrecision(current.close, pricePrecision))),
      volume: decimalFold.format(thousandsSeparator.format(
        formatter.formatBigNumber(formatPrecision(current.volume ?? defaultValue, volumePrecision))
      )),
      turnover: decimalFold.format(thousandsSeparator.format(
        formatPrecision(current.turnover ?? defaultValue, pricePrecision)
      )),
      change: prevClose === 0 ? defaultValue : `${thousandsSeparator.format(formatPrecision(changeValue / prevClose * 100))}%`
    }
    const legends = (
      isFunction(custom)
        ? custom({ prev, current, next: dataList[dataIndex + 1] ?? null }, styles)
        : custom
    )
    return legends.map(({ title, value }) => {
      let t: TooltipLegendChild = { text: '', color: textColor }
      if (isObject(title)) {
        t = { ...title }
      } else {
        t.text = title
      }
      t.text = i18n(t.text, locale)
      let v = { text: defaultValue, color: textColor }
      if (isObject(value)) {
        v = { ...value }
      } else {
        v.text = value
      }
      if (isValid(/{change}/.exec(v.text))) {
        v.color = changeValue === 0 ? styles.priceMark.last.noChangeColor : (changeValue > 0 ? styles.priceMark.last.upColor : styles.priceMark.last.downColor)
      }
      v.text = formatTemplateString(v.text, mapping)
      return { title: t, value: v }
    })
  }
}
