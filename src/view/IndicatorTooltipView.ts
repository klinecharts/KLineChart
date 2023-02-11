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
import { MouseTouchEvent } from '../common/SyntheticEvent'
import { IndicatorStyle, TooltipStyle, TooltipIconStyle, MarginTextStyle, TooltipData, TooltipShowRule, TooltipDataChild, TooltipIconPosition, CustomApi } from '../common/Options'
import { ActionType } from '../common/Action'

import XAxis from '../component/XAxis'
import YAxis from '../component/YAxis'

import IndicatorImp, { eachFigures, Indicator, IndicatorFigure, IndicatorFigureStyle, IndicatorTooltipData } from '../component/Indicator'

import { PaneIdConstants } from '../pane/Pane'

import { formatPrecision } from '../common/utils/format'
import { isValid, isObject } from '../common/utils/typeChecks'
import { createFont } from '../common/utils/canvas'

import { TooltipIconInfo } from '../store/TooltipStore'

import View from './View'

export default class IndicatorTooltipView extends View<YAxis> {
  private readonly _boundIconClickEvent = (currentIconInfo: TooltipIconInfo, iconId: string) => (event: MouseTouchEvent) => {
    const pane = this.getWidget().getPane()
    pane.getChart().getChartStore().getActionStore().execute(ActionType.onTooltipIconClick, { ...currentIconInfo, iconId })
    return true
  }

  private readonly _boundIconMouseMoveEvent = (currentIconInfo: TooltipIconInfo, iconId: string) => (event: MouseTouchEvent) => {
    const pane = this.getWidget().getPane()
    const tooltipStore = pane.getChart().getChartStore().getTooltipStore()
    tooltipStore.setActiveIconInfo({ ...currentIconInfo, iconId })
    return true
  }

  protected drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chartStore = pane.getChart().getChartStore()
    const crosshair = chartStore.getCrosshairStore().get()
    if (crosshair.kLineData !== undefined) {
      const bounding = widget.getBounding()
      const customApi = chartStore.getCustomApi()
      const indicators = chartStore.getIndicatorStore().getInstances(pane.getId())
      const activeIconInfo = chartStore.getTooltipStore().getActiveIconInfo()
      const defaultStyles = chartStore.getStyles().indicator
      this.drawIndicatorTooltip(
        ctx, pane.getId(), chartStore.getDataList(), crosshair, activeIconInfo, indicators, customApi, bounding, defaultStyles
      )
    }
  }

  protected drawIndicatorTooltip (
    ctx: CanvasRenderingContext2D,
    paneId: string,
    dataList: KLineData[],
    crosshair: Crosshair,
    activeTooltipIconInfo: TooltipIconInfo,
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
      let x = 0
      let y = top ?? 0
      let prevRowHeight = 0
      indicators.forEach(indicator => {
        const { name, calcParamsText, values, icons } = this.getIndicatorTooltipData(dataList, crosshair, indicator, customApi, styles)
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
            const [valuesStartX, valuestartY, valuesLastRowHeight, valuesIncreaseHeight] = this.drawStandardTooltipLabels(ctx, bounding, values, x, y, prevRowHeight, tooltipTextStyles)
            x = valuesStartX
            y = valuestartY
            height += valuesIncreaseHeight
            prevRowHeight = valuesLastRowHeight
          }

          // draw right icons
          const [rightIconsNextStartX, rightIconsNextStartY, rightIconsLastRowHeight, rightIconsIncreaseHeight] = this.drawStandardTooltipIcons(
            ctx, bounding, { paneId, indicatorName: indicator.name, iconId: '' },
            activeTooltipIconInfo, rightIcons, x, y, prevRowHeight
          )
          x = rightIconsNextStartX
          y = rightIconsNextStartY
          height += rightIconsIncreaseHeight
          prevRowHeight = rightIconsLastRowHeight
        }
      })
    }
    return height
  }

  protected drawStandardTooltipIcons (
    ctx: CanvasRenderingContext2D,
    bounding: Bounding,
    currentIconInfo: TooltipIconInfo,
    activeIconInfo: TooltipIconInfo,
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
        const active = activeIconInfo.paneId === currentIconInfo.paneId && activeIconInfo.indicatorName === currentIconInfo.indicatorName && activeIconInfo.iconId === icon.id
        this.createFigure(
          'rectText',
          { text, x, y: y + marginTop },
          {
            paddingLeft,
            paddingTop,
            paddingRight,
            paddingBottom,
            color: active ? activeColor : color,
            size,
            family: fontFamily,
            backgroundColor: active ? activeBackgroundColor : backgroundColor
          },
          {
            mouseDownEvent: this._boundIconClickEvent(currentIconInfo, icon.id),
            mouseMoveEvent: this._boundIconMouseMoveEvent(currentIconInfo, icon.id)
          }
        )?.draw(ctx)
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
    styles: Omit<MarginTextStyle, 'show'>
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
          this.createFigure(
            'text',
            { x, y: y + marginTop, text: title.text },
            { color: title.color, size, family, weight }
          )?.draw(ctx)
          x += titleTextWidth
        }
        this.createFigure(
          'text',
          { x, y: y + marginTop, text: value.text },
          { color: value.color, size, family, weight }
        )?.draw(ctx)
        x += (valueTextWidth + marginRight)
      })
    }
    return [x, y, rowHeight, increaseHeight]
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
    const tooltipStyles = styles.tooltip
    const name = tooltipStyles.showName ? indicator.shortName : ''
    let calcParamsText = ''
    const calcParams = indicator.calcParams
    if (calcParams.length > 0 && tooltipStyles.showParams) {
      calcParamsText = `(${calcParams.join(',')})`
    }

    const tooltipData: IndicatorTooltipData = { name, calcParamsText, values: [], icons: tooltipStyles.icons }

    const dataIndex = crosshair.dataIndex as number
    const result = indicator.result ?? []

    const values: TooltipData[] = []
    if (indicator.visible) {
      const indicatorData = result[dataIndex] ?? {}
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
          values.push({ title: { text: figure.title, color }, value: { text: value ?? tooltipStyles.defaultValue, color } })
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
        xAxis: pane.getChart().getPaneById(PaneIdConstants.XAXIS)?.getAxisComponent() as XAxis,
        yAxis: pane.getAxisComponent()
      })
      if (customName !== undefined && tooltipStyles.showName) {
        tooltipData.name = customName
      }
      if (customCalcParamsText !== undefined && tooltipStyles.showParams) {
        tooltipData.calcParamsText = customCalcParamsText
      }
      if (customIcons !== undefined) {
        tooltipData.icons = customIcons
      }
      if (customValues !== undefined && indicator.visible) {
        const optimizedValues: TooltipData[] = []
        const color = styles.tooltip.text.color
        customValues.forEach(data => {
          let title = { text: '', color }
          if (isObject(data.title)) {
            title = data.title as TooltipDataChild
          } else {
            title.text = data.title as string
          }
          let value = { text: '', color }
          if (isObject(data.value)) {
            value = data.value as TooltipDataChild
          } else {
            value.text = data.value as string
          }
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
        case TooltipIconPosition.LEFT: {
          leftIcons.push(icon)
          break
        }
        case TooltipIconPosition.MIDDLE: {
          middleIcons.push(icon)
          break
        }
        case TooltipIconPosition.RIGHT: {
          rightIcons.push(icon)
          break
        }
      }
    })
    return [leftIcons, middleIcons, rightIcons]
  }
}
