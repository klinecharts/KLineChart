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
import type { KLineData } from '../common/Data'
import type Crosshair from '../common/Crosshair'
import { type IndicatorStyle, type TooltipStyle, type TooltipIconStyle, type TooltipTextStyle, type TooltipLegend, TooltipShowRule, type TooltipLegendChild, TooltipIconPosition, PolygonType, type CandleTooltipRectStyle } from '../common/Styles'
import { ActionType } from '../common/Action'
import { formatPrecision } from '../common/utils/format'
import { isValid, isObject, isString, isNumber, isFunction } from '../common/utils/typeChecks'
import { createFont } from '../common/utils/canvas'
import type Coordinate from '../common/Coordinate'
import type { MeasureCoordinate } from '../common/Coordinate'

import type { Options } from '../Options'

import type { YAxis } from '../component/YAxis'

import type { Indicator, IndicatorFigure, IndicatorFigureStyle, IndicatorTooltipData } from '../component/Indicator'
import type IndicatorImp from '../component/Indicator'
import { eachFigures } from '../component/Indicator'

import type { TooltipIcon } from '../Store'

import View from './View'

export default class IndicatorTooltipView extends View<YAxis> {
  private readonly _boundIconClickEvent = (currentIcon: TooltipIcon) => () => {
    const pane = this.getWidget().getPane()
    pane.getChart().getChartStore().executeAction(ActionType.OnTooltipIconClick, { ...currentIcon })
    return true
  }

  private readonly _boundIconMouseMoveEvent = (currentIconInfo: TooltipIcon) => () => {
    this.getWidget().getPane().getChart().getChartStore().setActiveTooltipIcon({ ...currentIconInfo })
    return true
  }

  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chartStore = pane.getChart().getChartStore()
    const crosshair = chartStore.getCrosshair()
    if (isValid(crosshair.kLineData)) {
      const bounding = widget.getBounding()
      const options = chartStore.getOptions()
      const indicators = chartStore.getIndicatorsByPaneId(pane.getId())
      const activeIcon = chartStore.getActiveTooltipIcon()
      const defaultStyles = options.styles.indicator
      const defaultTooltipRectStyles = options.styles.candle.tooltip.rect
      const { offsetLeft, offsetTop, offsetRight } = defaultStyles.tooltip
      this.drawIndicatorTooltip(
        ctx, pane.getId(), chartStore.getDataList(),
        crosshair, activeIcon, indicators, options, offsetLeft, offsetTop,
        bounding.width - offsetRight, defaultStyles, defaultTooltipRectStyles
      )
    }
  }

  protected drawIndicatorTooltip (
    ctx: CanvasRenderingContext2D,
    paneId: string,
    dataList: KLineData[],
    crosshair: Crosshair,
    activeTooltipIcon: Nullable<TooltipIcon>,
    indicators: IndicatorImp[],
    options: Options,
    left: number,
    top: number,
    maxWidth: number,
    styles: IndicatorStyle,
    defaultTooltipRectStyles: CandleTooltipRectStyle
  ): number {
    const tooltipStyles = styles.tooltip
    if (this.isDrawTooltip(crosshair, tooltipStyles)) {
      const tooltipTextStyles = tooltipStyles.text
      indicators.forEach(indicator => {
        let prevRowHeight = 0
        const coordinate = { x: left, y: top }
        const { name, calcParamsText, legends, icons } = this.getIndicatorTooltipData(dataList, crosshair, indicator, options, styles)
        const nameValid = name.length > 0
        const legendValid = legends.length > 0
        if (nameValid || legendValid) {
          const [leftIcons, middleIcons, rightIcons] = this.classifyTooltipIcons(icons)

          const [measureResult, prevCalcHeight] = this.drawStandardTooltipRect(ctx, leftIcons, name, middleIcons, legends, rightIcons, coordinate, maxWidth, tooltipTextStyles, defaultTooltipRectStyles)

          this.drawStandardTooltipIcons(
            ctx, activeTooltipIcon, leftIcons,
            paneId, indicator.name,
            measureResult[0] as Coordinate[]
          )

          if (nameValid) {
            let text = name
            if (calcParamsText.length > 0) {
              text = `${text}${calcParamsText}`
            }
            this.drawStandardTooltipLegends(
              ctx,
              [
                {
                  title: { text: '', color: tooltipTextStyles.color },
                  value: { text, color: tooltipTextStyles.color }
                }
              ],
              tooltipTextStyles,
              measureResult[1] as Array<[Coordinate, Coordinate]>
            )
          }

          this.drawStandardTooltipIcons(
            ctx, activeTooltipIcon, middleIcons,
            paneId, indicator.name,
            measureResult[2] as Coordinate[]
          )

          if (legendValid) {
             this.drawStandardTooltipLegends(
              ctx, legends, tooltipTextStyles,
              measureResult[3] as Array<[Coordinate, Coordinate]>
            )
          }

          // draw right icons
          this.drawStandardTooltipIcons(
            ctx, activeTooltipIcon, rightIcons,
            paneId, indicator.name,
            measureResult[4] as Coordinate[]
          )
          prevRowHeight = prevCalcHeight;
          top = coordinate.y + prevRowHeight
        }
      })
    }
    return top
  }

  protected drawStandardTooltipIcons (
    ctx: CanvasRenderingContext2D,
    activeIcon: Nullable<TooltipIcon>,
    icons: TooltipIconStyle[],
    // coordinate: Coordinate,
    paneId: string,
    indicatorName: string,
    // left: number,
    // prevRowHeight: number,
    // maxWidth: number,
    measureResult: Coordinate[]
  ): void {
    if (icons.length > 0) {
      // let width = 0
      // let height = 0
      // icons.forEach(icon => {
      //   const {
      //     marginLeft = 0, marginTop = 0, marginRight = 0, marginBottom = 0,
      //     paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0,
      //     size, fontFamily, icon: text
      //   } = icon
      //   ctx.font = createFont(size, 'normal', fontFamily)
      //   width += (marginLeft + paddingLeft + ctx.measureText(text).width + paddingRight + marginRight)
      //   height = Math.max(height, marginTop + paddingTop + size + paddingBottom + marginBottom)
      // })
      // if (coordinate.x + width > maxWidth) {
      //   coordinate.x = left
      //   coordinate.y += prevRowHeight
      //   prevRowHeight = height
      // } else {
      //   prevRowHeight = Math.max(prevRowHeight, height)
      // }
      icons.forEach((icon, index) => {
        const {
          marginLeft = 0, marginTop = 0,
          paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0,
          color, activeColor, size, fontFamily, icon: text,
          backgroundColor, activeBackgroundColor
        } = icon
        const active = activeIcon?.paneId === paneId && activeIcon.indicatorName === indicatorName && activeIcon.iconId === icon.id
        this.createFigure({
          name: 'text',
          attrs: { text, x: measureResult[index].x + marginLeft, y: measureResult[index].y + marginTop },
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
          mouseClickEvent: this._boundIconClickEvent({ paneId, indicatorName, iconId: icon.id }),
          mouseMoveEvent: this._boundIconMouseMoveEvent({ paneId, indicatorName, iconId: icon.id })
        })?.draw(ctx)
        // coordinate.x += (marginLeft + paddingLeft + ctx.measureText(text).width + paddingRight + marginRight)
      })
    }
    // return prevRowHeight
  }

  protected drawStandardTooltipLegends (
    ctx: CanvasRenderingContext2D,
    legends: TooltipLegend[],
    // coordinate: Coordinate,
    // left: number,
    // prevRowHeight: number,
    // maxWidth: number,
    styles: TooltipTextStyle,
    measureResult: Array<[Coordinate, Coordinate]>
  ): void {
    if (legends.length > 0 && measureResult.length > 0) {
      const { marginLeft, marginTop, size, family, weight } = styles
      ctx.font = createFont(size, weight, family)
      legends.forEach((data, index) => {
        const title = data.title as TooltipLegendChild
        const value = data.value as TooltipLegendChild
        // const titleTextWidth = ctx.measureText(title.text).width
        // const valueTextWidth = ctx.measureText(value.text).width
        // const totalTextWidth = titleTextWidth + valueTextWidth
        // const h = marginTop + size + marginBottom
        // if (coordinate.x + marginLeft + totalTextWidth + marginRight > maxWidth) {
        //   coordinate.x = left
        //   coordinate.y += prevRowHeight
        //   prevRowHeight = h
        // } else {
        //   prevRowHeight = Math.max(prevRowHeight, h)
        // }
        if (title.text.length > 0) {
          this.createFigure({
            name: 'text',
            attrs: { x: measureResult[index][0].x + marginLeft, y: measureResult[index][0].y + marginTop, text: title.text },
            styles: { color: title.color, size, family, weight }
          })?.draw(ctx)
        }
        this.createFigure({
          name: 'text',
          attrs: { x: measureResult[index][1].x, y: measureResult[index][1].y + marginTop, text: value.text },
          styles: { color: value.color, size, family, weight }
        })?.draw(ctx)
        // coordinate.x += (marginLeft + totalTextWidth + marginRight)
      })
    }
    // return prevRowHeight
  }

  protected drawStandardTooltipRect (
    ctx: CanvasRenderingContext2D,
    leftIcons: TooltipIconStyle[],
    name: string,
    middleIcons: TooltipIconStyle[],
    legends: TooltipLegend[],
    rightIcons: TooltipIconStyle[],
    coordinate: Coordinate, maxWidth: number, tooltipTextStyles: TooltipTextStyle, rectStyles: CandleTooltipRectStyle): [MeasureCoordinate, number] {
    let rectWidth = 0
    let rectHeight = 0
    let elmWidth = 0
    let elmHeight = 0
    let positionX = 0

    const measureResult: MeasureCoordinate = []

    function updateRectSize (width: number, height: number): void {
      rectWidth = Math.max(rectWidth, positionX + width)
      rectHeight = Math.max(rectHeight, height)
      if (rectWidth > maxWidth) {
        rectHeight += height
        positionX = width
        rectWidth -= width
      } else {
        positionX += width
      }
    }

    let tmpMeasureResult: Array<Coordinate | [Coordinate, Coordinate]> = []

    //  measure box left icons
    if (leftIcons.length > 0) {
      leftIcons.forEach(icon => {
        const {
          marginLeft = 0, marginTop = 0, marginRight = 0, marginBottom = 0,
          paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0,
          size, fontFamily, icon: text
        } = icon
        ctx.font = createFont(size, 'normal', fontFamily)
        elmWidth = marginLeft + paddingLeft + ctx.measureText(text).width + paddingRight + marginRight
        elmHeight = marginTop + paddingTop + size + paddingBottom + marginBottom
        updateRectSize(elmWidth, elmHeight)
        tmpMeasureResult.push({
          x: coordinate.x + positionX - elmWidth,
          y: coordinate.y + rectHeight - elmHeight
        })
      })
    }

    measureResult.push(tmpMeasureResult)
    tmpMeasureResult = [];  //  reset for new box

    //  measure box name
    if (name.length > 0) {
      ctx.font = createFont(tooltipTextStyles.size, tooltipTextStyles.weight, tooltipTextStyles.family)
      elmWidth = tooltipTextStyles.marginLeft + ctx.measureText(name).width + tooltipTextStyles.marginRight
      elmHeight = tooltipTextStyles.marginTop + tooltipTextStyles.size + tooltipTextStyles.marginBottom
      updateRectSize(elmWidth, elmHeight)
      tmpMeasureResult.push([
        { x: 0, y: 0 },
        { x: coordinate.x + positionX - elmWidth + tooltipTextStyles.marginLeft, y: coordinate.y + rectHeight - elmHeight },
      ]);
    }

    measureResult.push(tmpMeasureResult)
    tmpMeasureResult = [];  //  reset for new box

    //  measure box middle icons
    if (middleIcons.length > 0) {
      middleIcons.forEach(icon => {
        const {
          marginLeft = 0, marginTop = 0, marginRight = 0, marginBottom = 0,
          paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0,
          size, fontFamily, icon: text
        } = icon
        ctx.font = createFont(size, 'normal', fontFamily)
        elmWidth = (marginLeft + paddingLeft + ctx.measureText(text).width + paddingRight + marginRight)
        elmHeight = marginTop + paddingTop + size + paddingBottom + marginBottom
        updateRectSize(elmWidth, elmHeight)
        tmpMeasureResult.push({
          x: coordinate.x + positionX - elmWidth,
          y: coordinate.y + rectHeight - elmHeight,
        })
      })
    }

    measureResult.push(tmpMeasureResult)
    tmpMeasureResult = [];  //  reset for new box

    //  measure box legends
    if (legends.length > 0) {
      ctx.font = createFont(tooltipTextStyles.size, tooltipTextStyles.weight, tooltipTextStyles.family)
      legends.forEach(legend => {
        const title = legend.title as TooltipLegendChild
        const value = legend.value as TooltipLegendChild
        const titleTextWidth = ctx.measureText(title.text).width
        const valueTextWidth = ctx.measureText(value.text).width
        elmWidth = tooltipTextStyles.marginLeft + titleTextWidth + valueTextWidth + tooltipTextStyles.marginRight
        elmHeight = tooltipTextStyles.marginTop + tooltipTextStyles.size + tooltipTextStyles.marginBottom
        updateRectSize(elmWidth, elmHeight)
        tmpMeasureResult.push([
          {
            x: coordinate.x + positionX - elmWidth,
            y: coordinate.y + rectHeight - elmHeight,
          },
          {
            x:
              coordinate.x +
              positionX -
              valueTextWidth -
              tooltipTextStyles.marginRight,
            y: coordinate.y + rectHeight - elmHeight,
          },
        ])
      })
    }

    measureResult.push(tmpMeasureResult)
    tmpMeasureResult = [];  //  reset for new box

    //  measure box right icons
    if (rightIcons.length > 0) {
      rightIcons.forEach(icon => {
        const {
          marginLeft = 0, marginTop = 0, marginRight = 0, marginBottom = 0,
          paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0,
          size, fontFamily, icon: text
        } = icon
        ctx.font = createFont(size, 'normal', fontFamily)
        elmWidth = (marginLeft + paddingLeft + ctx.measureText(text).width + paddingRight + marginRight)
        elmHeight = marginTop + paddingTop + size + paddingBottom + marginBottom
        updateRectSize(elmWidth, elmHeight)
        tmpMeasureResult.push({
          x: coordinate.x + positionX - elmWidth,
          y: coordinate.y + rectHeight - elmHeight,
        })
      })
    }

    this.createFigure({
      name: 'rect',
      attrs: {
        x: coordinate.x,
        y: coordinate.y,
        width: rectWidth,
        height: rectHeight
      },
      styles: {
        style: PolygonType.Fill,
        color: rectStyles.color,
        borderColor: rectStyles.borderColor,
        borderSize: rectStyles.borderSize,
        borderRadius: rectStyles.borderRadius,
        globalAlpha: rectStyles.globalAlpha
      }
    })?.draw(ctx)

    return [measureResult, rectHeight];
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
    options: Options,
    styles: IndicatorStyle
  ): IndicatorTooltipData {
    const tooltipStyles = styles.tooltip
    const name = tooltipStyles.showName ? indicator.shortName : ''
    let calcParamsText = ''
    const calcParams = indicator.calcParams
    if (calcParams.length > 0 && tooltipStyles.showParams) {
      calcParamsText = `(${calcParams.join(',')})`
    }

    const tooltipData: IndicatorTooltipData = { name, calcParamsText, legends: [], icons: tooltipStyles.icons }

    const dataIndex = crosshair.dataIndex!
    const result = indicator.result

    const { customApi, decimalFold, thousandsSeparator } = options
    const legends: TooltipLegend[] = []
    if (indicator.visible) {
      const data = result[dataIndex] ?? result[dataIndex - 1] ?? {}
      eachFigures(dataList, indicator, dataIndex, styles, (figure: IndicatorFigure, figureStyles: Required<IndicatorFigureStyle>) => {
        if (isString(figure.title)) {
          const color = figureStyles.color
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          let value = data[figure.key]
          if (isNumber(value)) {
            value = formatPrecision(value, indicator.precision)
            if (indicator.shouldFormatBigNumber) {
              value = customApi.formatBigNumber(value as string)
            }
          }
          legends.push({ title: { text: figure.title, color }, value: { text: decimalFold.format(thousandsSeparator.format((value ?? tooltipStyles.defaultValue) as string)), color } })
        }
      })
      tooltipData.legends = legends
    }

    if (isFunction(indicator.createTooltipDataSource)) {
      const widget = this.getWidget()
      const pane = widget.getPane()
      const chart = pane.getChart()
      const { name: customName, calcParamsText: customCalcParamsText, legends: customLegends, icons: customIcons } = indicator.createTooltipDataSource({
        chart,
        indicator,
        bounding: widget.getBounding(),
        crosshair,
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
      if (isValid(customLegends) && indicator.visible) {
        const optimizedLegends: TooltipLegend[] = []
        const color = styles.tooltip.text.color
        customLegends.forEach(data => {
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
          value.text = decimalFold.format(thousandsSeparator.format(value.text))
          optimizedLegends.push({ title, value })
        })
        tooltipData.legends = optimizedLegends
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
