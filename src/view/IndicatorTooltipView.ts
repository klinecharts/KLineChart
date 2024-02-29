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
import type Crosshair from '../common/Crosshair'
import { type IndicatorStyle, type TooltipStyle, type TooltipIconStyle, type TooltipTextStyle, type TooltipData, TooltipShowRule, type TooltipDataChild, TooltipIconPosition } from '../common/Styles'
import { ActionType } from '../common/Action'
import { formatPrecision, formatThousands, formatFoldDecimal } from '../common/utils/format'
import { isValid, isObject, isString, isNumber } from '../common/utils/typeChecks'
import { createFont } from '../common/utils/canvas'

import { type CustomApi } from '../Options'

import type YAxis from '../component/YAxis'

import { type Indicator, type IndicatorFigure, type IndicatorFigureStyle, type IndicatorTooltipData } from '../component/Indicator'
import type IndicatorImp from '../component/Indicator'
import { eachFigures } from '../component/Indicator'

import { type TooltipIcon } from '../store/TooltipStore'

import View from './View'

export default class IndicatorTooltipView extends View<YAxis> {
  private readonly _boundIconClickEvent = (currentIcon: TooltipIcon, iconId: string) => () => {
    const pane = this.getWidget().getPane()
    pane.getChart().getChartStore().getActionStore().execute(ActionType.OnTooltipIconClick, { ...currentIcon, iconId })
    return true
  }

  private readonly _boundIconMouseMoveEvent = (currentIconInfo: TooltipIcon, iconId: string) => () => {
    const pane = this.getWidget().getPane()
    const tooltipStore = pane.getChart().getChartStore().getTooltipStore()
    tooltipStore.setActiveIcon({ ...currentIconInfo, iconId })
    return true
  }

  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chartStore = pane.getChart().getChartStore()
    const crosshair = chartStore.getTooltipStore().getCrosshair()
    if (isValid(crosshair.kLineData)) {
      const bounding = widget.getBounding()
      const customApi = chartStore.getCustomApi()
      const thousandsSeparator = chartStore.getThousandsSeparator()
      const decimalFoldThreshold = chartStore.getDecimalFoldThreshold()
      const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
      const activeIcon = chartStore.getTooltipStore().getActiveIcon()
      const defaultStyles = chartStore.getStyles().indicator
      this.drawIndicatorTooltip(
        ctx, pane.getId(), chartStore.getDataList(),
        crosshair, activeIcon, indicators, customApi,
        thousandsSeparator, decimalFoldThreshold, bounding, defaultStyles
      )
    }
  }

  protected drawIndicatorTooltip (
    ctx: CanvasRenderingContext2D,
    paneId: string,
    dataList: KLineData[],
    crosshair: Crosshair,
    activeTooltipIconInfo: Nullable<TooltipIcon>,
    indicators: IndicatorImp[],
    customApi: CustomApi,
    thousandsSeparator: string,
    decimalFoldThreshold: number,
    bounding: Bounding,
    styles: IndicatorStyle,
    top?: number
  ): number {
    const tooltipStyles = styles.tooltip
    let height = 0
    if (this.isDrawTooltip(crosshair, tooltipStyles)) {
      const tooltipTextStyles = tooltipStyles.text
      let x = 0
      let y = top ?? 0
      let prevRowHeight = 0
      indicators.forEach(indicator => {
        const { name, calcParamsText, values, icons } = this.getIndicatorTooltipData(dataList, crosshair, indicator, customApi, thousandsSeparator, decimalFoldThreshold, styles)
        const nameValid = name.length > 0
        const valuesValid = values.length > 0
        if (nameValid || valuesValid) {
          const [leftIcons, middleIcons, rightIcons] = this.classifyTooltipIcons(icons)

          // draw left icons
          const [leftIconsNextStartX, leftIconsNextStartY, leftIconsLastRowHeight, leftIconsIncreaseHeight] = this.drawStandardTooltipIcons(
            ctx, bounding, { paneId, indicatorName: indicator.name, iconId: '' },
            activeTooltipIconInfo, leftIcons, x, y, prevRowHeight
          )
          x = leftIconsNextStartX
          y = leftIconsNextStartY
          height += leftIconsIncreaseHeight
          prevRowHeight = leftIconsLastRowHeight

          if (nameValid) {
            let text = name
            if (calcParamsText.length > 0) {
              text = `${text}${calcParamsText}`
            }
            const [nameStartX, nameStartY, nameLastRowHeight, nameIncreaseHeight] = this.drawStandardTooltipLabels(
              ctx,
              bounding,
              [{ title: { text: '', color: tooltipTextStyles.color }, value: { text, color: tooltipTextStyles.color } }],
              x,
              y,
              prevRowHeight,
              tooltipTextStyles
            )
            x = nameStartX
            y = nameStartY
            height += nameIncreaseHeight
            prevRowHeight = nameLastRowHeight
          }

          // draw middle icons
          const [middleIconsNextStartX, middleIconsNextStartY, middleIconsLastRowHeight, middleIconsIncreaseHeight] = this.drawStandardTooltipIcons(
            ctx, bounding, { paneId, indicatorName: indicator.name, iconId: '' },
            activeTooltipIconInfo, middleIcons, x, y, prevRowHeight
          )
          x = middleIconsNextStartX
          y = middleIconsNextStartY
          height += middleIconsIncreaseHeight
          prevRowHeight = middleIconsLastRowHeight

          if (valuesValid) {
            const [valuesStartX, valueStartY, valuesLastRowHeight, valuesIncreaseHeight] = this.drawStandardTooltipLabels(ctx, bounding, values, x, y, prevRowHeight, tooltipTextStyles)
            x = valuesStartX
            y = valueStartY
            height += valuesIncreaseHeight
            prevRowHeight = valuesLastRowHeight
          }

          // draw right icons
          const [, rightIconsNextStartY, rightIconsLastRowHeight, rightIconsIncreaseHeight] = this.drawStandardTooltipIcons(
            ctx, bounding, { paneId, indicatorName: indicator.name, iconId: '' },
            activeTooltipIconInfo, rightIcons, x, y, prevRowHeight
          )
          x = 0
          height += rightIconsIncreaseHeight
          y = rightIconsNextStartY + rightIconsLastRowHeight
          prevRowHeight = 0
        }
      })
    }
    return height
  }

  protected drawStandardTooltipIcons (
    ctx: CanvasRenderingContext2D,
    bounding: Bounding,
    currentIcon: TooltipIcon,
    activeIcon: Nullable<TooltipIcon>,
    icons: TooltipIconStyle[],
    startX: number,
    startY: number,
    prevRowHeight: number
  ): [number, number, number, number] {
    let x = startX
    let y = startY
    let width = 0
    let rowHeight = 0
    let increaseHeight = 0
    if (icons.length > 0) {
      icons.forEach(icon => {
        const {
          marginLeft, marginTop, marginRight, marginBottom,
          paddingLeft, paddingTop, paddingRight, paddingBottom,
          size, fontFamily, icon: text
        } = icon
        ctx.font = createFont(size, 'normal', fontFamily)
        width += (marginLeft + paddingLeft + ctx.measureText(text).width + paddingRight + marginRight)
        rowHeight = Math.max(rowHeight, marginTop + paddingTop + size + paddingBottom + marginBottom)
      })
      if (x + width > bounding.width) {
        x = icons[0].marginLeft
        y += prevRowHeight
        increaseHeight = rowHeight
      } else {
        increaseHeight = Math.max(0, rowHeight - prevRowHeight)
      }
      icons.forEach(icon => {
        const {
          marginLeft, marginTop, marginRight,
          paddingLeft, paddingTop, paddingRight, paddingBottom,
          color, activeColor, size, fontFamily, icon: text, backgroundColor, activeBackgroundColor
        } = icon
        x += marginLeft
        const active = activeIcon?.paneId === currentIcon.paneId && activeIcon?.indicatorName === currentIcon.indicatorName && activeIcon?.iconId === icon.id
        this.createFigure({
          name: 'text',
          attrs: { text, x, y: y + marginTop },
          styles: {
            paddingLeft,
            paddingTop,
            paddingRight,
            paddingBottom,
            color: active ? activeColor : color,
            size,
            family: fontFamily,
            backgroundColor: active ? activeBackgroundColor : backgroundColor
          }
        }, {
          mouseClickEvent: this._boundIconClickEvent(currentIcon, icon.id),
          mouseMoveEvent: this._boundIconMouseMoveEvent(currentIcon, icon.id)
        })?.draw(ctx)
        x += (paddingLeft + ctx.measureText(text).width + paddingRight + marginRight)
      })
    }
    return [x, y, Math.max(prevRowHeight, rowHeight), increaseHeight]
  }

  protected drawStandardTooltipLabels (
    ctx: CanvasRenderingContext2D,
    bounding: Bounding,
    labels: TooltipData[],
    startX: number,
    startY: number,
    prevRowHeight: number,
    styles: TooltipTextStyle
  ): [number, number, number, number] {
    let x = startX
    let y = startY
    let rowHeight = 0
    let increaseHeight = 0
    let currentPrevRowHeight = prevRowHeight
    if (labels.length > 0) {
      const { marginLeft, marginTop, marginRight, marginBottom, size, family, weight } = styles
      ctx.font = createFont(size, weight, family)
      labels.forEach(data => {
        const title = data.title as TooltipDataChild
        const value = data.value as TooltipDataChild
        const titleTextWidth = ctx.measureText(title.text).width
        const valueTextWidth = ctx.measureText(value.text).width
        const totalTextWidth = titleTextWidth + valueTextWidth
        const height = size + marginTop + marginBottom
        if (x + marginLeft + totalTextWidth + marginRight > bounding.width) {
          x = marginLeft
          y += height
          increaseHeight += height
        } else {
          x += marginLeft
          increaseHeight += Math.max(0, height - currentPrevRowHeight)
        }
        rowHeight = Math.max(currentPrevRowHeight, height)
        currentPrevRowHeight = rowHeight
        if (title.text.length > 0) {
          this.createFigure({
            name: 'text',
            attrs: { x, y: y + marginTop, text: title.text },
            styles: { color: title.color, size, family, weight }
          })?.draw(ctx)
          x += titleTextWidth
        }
        this.createFigure({
          name: 'text',
          attrs: { x, y: y + marginTop, text: value.text },
          styles: { color: value.color, size, family, weight }
        })?.draw(ctx)
        x += (valueTextWidth + marginRight)
      })
    }
    return [x, y, rowHeight, increaseHeight]
  }

  protected isDrawTooltip (crosshair: Crosshair, styles: TooltipStyle): boolean {
    const showRule = styles.showRule
    return showRule === TooltipShowRule.Always ||
      (showRule === TooltipShowRule.FollowCross && isString(crosshair.paneId))
  }

  protected getIndicatorTooltipData (
    dataList: KLineData[],
    crosshair: Crosshair,
    indicator: Indicator,
    customApi: CustomApi,
    thousandsSeparator: string,
    decimalFoldThreshold: number,
    styles: IndicatorStyle
  ): IndicatorTooltipData {
    const tooltipStyles = styles.tooltip
    const name = tooltipStyles.showName ? indicator.shortName : ''
    let calcParamsText = ''
    const calcParams = indicator.calcParams
    if (calcParams.length > 0 && tooltipStyles.showParams) {
      calcParamsText = `(${calcParams.join(',')})`
    }

    const tooltipData: IndicatorTooltipData = { name, calcParamsText, values: [], icons: tooltipStyles.icons }

    const dataIndex = crosshair.dataIndex!
    const result = indicator.result ?? []

    const values: TooltipData[] = []
    if (indicator.visible) {
      const indicatorData = result[dataIndex] ?? {}
      eachFigures(dataList, indicator, dataIndex, styles, (figure: IndicatorFigure, figureStyles: Required<IndicatorFigureStyle>) => {
        if (isString(figure.title)) {
          const color = figureStyles.color
          let value = indicatorData[figure.key]
          if (isNumber(value)) {
            value = formatPrecision(value, indicator.precision)
            if (indicator.shouldFormatBigNumber) {
              value = customApi.formatBigNumber(value as string)
            }
          }
          values.push({ title: { text: figure.title, color }, value: { text: formatFoldDecimal(formatThousands((value ?? tooltipStyles.defaultValue) as string, thousandsSeparator), decimalFoldThreshold), color } })
        }
      })
      tooltipData.values = values
    }

    if (indicator.createTooltipDataSource !== null) {
      const widget = this.getWidget()
      const pane = widget.getPane()
      const chartStore = pane.getChart().getChartStore()
      const { name: customName, calcParamsText: customCalcParamsText, values: customValues, icons: customIcons } = indicator.createTooltipDataSource({
        kLineDataList: dataList,
        indicator,
        visibleRange: chartStore.getTimeScaleStore().getVisibleRange(),
        bounding: widget.getBounding(),
        crosshair,
        defaultStyles: styles,
        xAxis: pane.getChart().getXAxisPane().getAxisComponent(),
        yAxis: pane.getAxisComponent()
      })
      if (isString(customName) && tooltipStyles.showName) {
        tooltipData.name = customName
      }
      if (isString(customCalcParamsText) && tooltipStyles.showParams) {
        tooltipData.calcParamsText = customCalcParamsText
      }
      if (isValid(customIcons)) {
        tooltipData.icons = customIcons
      }
      if (isValid(customValues) && indicator.visible) {
        const optimizedValues: TooltipData[] = []
        const color = styles.tooltip.text.color
        customValues.forEach(data => {
          let title = { text: '', color }
          if (isObject(data.title)) {
            title = data.title
          } else {
            title.text = data.title
          }
          let value = { text: '', color }
          if (isObject(data.value)) {
            value = data.value
          } else {
            value.text = data.value
          }
          value.text = formatFoldDecimal(formatThousands(value.text, thousandsSeparator), decimalFoldThreshold)
          optimizedValues.push({ title, value })
        })
        tooltipData.values = optimizedValues
      }
    }
    return tooltipData
  }

  protected classifyTooltipIcons (icons: TooltipIconStyle[]): TooltipIconStyle[][] {
    const leftIcons: TooltipIconStyle[] = []
    const middleIcons: TooltipIconStyle[] = []
    const rightIcons: TooltipIconStyle[] = []
    icons.forEach(icon => {
      switch (icon.position) {
        case TooltipIconPosition.Left: {
          leftIcons.push(icon)
          break
        }
        case TooltipIconPosition.Middle: {
          middleIcons.push(icon)
          break
        }
        case TooltipIconPosition.Right: {
          rightIcons.push(icon)
          break
        }
      }
    })
    return [leftIcons, middleIcons, rightIcons]
  }
}
