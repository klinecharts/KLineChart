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

import type Crosshair from '../common/Crosshair'
import type { TooltipStyle, TooltipTextStyle, TooltipLegend, TooltipLegendChild, TooltipFeatureStyle, FeatureIconFontStyle, FeaturePathStyle } from '../common/Styles'
import { formatPrecision } from '../common/utils/format'
import { isValid, isObject, isString, isNumber, isFunction } from '../common/utils/typeChecks'
import { createFont } from '../common/utils/canvas'
import type Coordinate from '../common/Coordinate'
import type Nullable from '../common/Nullable'
import type { MouseTouchEvent } from '../common/SyntheticEvent'

import type { YAxis } from '../component/YAxis'

import type { Indicator, IndicatorFigure, IndicatorFigureStyle, IndicatorTooltipData } from '../component/Indicator'
import { eachFigures } from '../component/Indicator'

import type DrawPane from '../pane/DrawPane'
import type DrawWidget from '../widget/DrawWidget'
import View from './View'

interface FeatureInfo {
  paneId: string
  indicator: Nullable<Indicator>
  feature: TooltipFeatureStyle
}

export default class IndicatorTooltipView extends View<YAxis> {
  private _activeFeatureInfo: Nullable<FeatureInfo> = null

  private readonly _featureClickEvent = (featureInfo: FeatureInfo) => () => {
    const pane = this.getWidget().getPane()
    const { indicator, ...others } = featureInfo
    if (isValid(indicator)) {
      indicator.onClick?.({
        target: 'feature',
        chart: pane.getChart(),
        indicator,
        ...others
      })
    } else {
      pane.getChart().getChartStore().executeAction('onCandleTooltipFeatureClick', featureInfo)
    }
    return true
  }

  private readonly _featureMouseMoveEvent = (featureInfo: FeatureInfo) => () => {
    this._activeFeatureInfo = featureInfo
    return true
  }

  constructor (widget: DrawWidget<DrawPane<YAxis>>) {
    super(widget)
    this.registerEvent('mouseMoveEvent', _ => {
      this._activeFeatureInfo = null
      return false
    })
  }

  override checkEventOn (_: MouseTouchEvent): boolean {
    return true
  }

  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chartStore = pane.getChart().getChartStore()
    const crosshair = chartStore.getCrosshair()
    if (isValid(crosshair.kLineData)) {
      const bounding = widget.getBounding()
      const { offsetLeft, offsetTop, offsetRight } = chartStore.getStyles().indicator.tooltip
      this.drawIndicatorTooltip(
        ctx, offsetLeft, offsetTop,
        bounding.width - offsetRight
      )
    }
  }

  protected drawIndicatorTooltip (
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    maxWidth: number
  ): number {
    const pane = this.getWidget().getPane()
    const chartStore = pane.getChart().getChartStore()
    const styles = chartStore.getStyles().indicator
    const tooltipStyles = styles.tooltip
    if (this.isDrawTooltip(chartStore.getCrosshair(), tooltipStyles)) {
      const indicators = chartStore.getIndicatorsByPaneId(pane.getId())
      const tooltipTextStyles = tooltipStyles.text
      indicators.forEach(indicator => {
        let prevRowHeight = 0
        const coordinate = { x: left, y: top }
        const { name, calcParamsText, legends, features } = this.getIndicatorTooltipData(indicator)
        const nameValid = name.length > 0
        const legendValid = legends.length > 0
        if (nameValid || legendValid) {
          const [leftFeatures, middleFeatures, rightFeatures] = this.classifyTooltipFeatures(features)
          prevRowHeight = this.drawStandardTooltipFeatures(
            ctx, leftFeatures,
            coordinate, indicator,
            left, prevRowHeight, maxWidth
          )

          if (nameValid) {
            let text = name
            if (calcParamsText.length > 0) {
              text = `${text}${calcParamsText}`
            }
            prevRowHeight = this.drawStandardTooltipLegends(
              ctx,
              [
                {
                  title: { text: '', color: tooltipTextStyles.color },
                  value: { text, color: tooltipTextStyles.color }
                }
              ],
              coordinate, left, prevRowHeight, maxWidth, tooltipTextStyles
            )
          }

          prevRowHeight = this.drawStandardTooltipFeatures(
            ctx, middleFeatures,
            coordinate, indicator,
            left, prevRowHeight, maxWidth
          )

          if (legendValid) {
            prevRowHeight = this.drawStandardTooltipLegends(
              ctx, legends, coordinate,
              left, prevRowHeight, maxWidth, tooltipStyles.text
            )
          }

          // draw right icons
          prevRowHeight = this.drawStandardTooltipFeatures(
            ctx, rightFeatures,
            coordinate, indicator,
            left, prevRowHeight, maxWidth
          )
          top = coordinate.y + prevRowHeight
        }
      })
    }
    return top
  }

  protected drawStandardTooltipFeatures (
    ctx: CanvasRenderingContext2D,
    features: TooltipFeatureStyle[],
    coordinate: Coordinate,
    indicator: Nullable<Indicator>,
    left: number,
    prevRowHeight: number,
    maxWidth: number
  ): number {
    if (features.length > 0) {
      let width = 0
      let height = 0
      features.forEach(feature => {
        const {
          marginLeft = 0, marginTop = 0, marginRight = 0, marginBottom = 0,
          paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0,
          size = 0, type, content
        } = feature
        let contentWidth = 0
        if (type === 'icon_font') {
          const iconFont = content as FeatureIconFontStyle
          ctx.font = createFont(size, 'normal', iconFont.family)
          contentWidth = ctx.measureText(iconFont.code).width
        } else {
          contentWidth = size
        }
        width += (marginLeft + paddingLeft + contentWidth + paddingRight + marginRight)
        height = Math.max(height, marginTop + paddingTop + size + paddingBottom + marginBottom)
      })
      if (coordinate.x + width > maxWidth) {
        coordinate.x = left
        coordinate.y += prevRowHeight
        prevRowHeight = height
      } else {
        prevRowHeight = Math.max(prevRowHeight, height)
      }
      const pane = this.getWidget().getPane()
      const paneId = pane.getId()

      features.forEach(feature => {
        const {
          marginLeft = 0, marginTop = 0, marginRight = 0,
          paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0,
          backgroundColor, activeBackgroundColor, borderRadius,
          size = 0, color, activeColor, type, content
        } = feature

        let finalColor = color
        let finalBackgroundColor = backgroundColor
        if (
          this._activeFeatureInfo?.paneId === paneId &&
          this._activeFeatureInfo.indicator?.id === indicator?.id &&
          this._activeFeatureInfo.feature.id === feature.id
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
          finalColor = activeColor ?? color
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
          finalBackgroundColor = activeBackgroundColor ?? backgroundColor
        }
        const eventHandler = {
          mouseClickEvent: this._featureClickEvent({ paneId, indicator, feature }),
          mouseMoveEvent: this._featureMouseMoveEvent({ paneId, indicator, feature })
        }
        let contentWidth = 0
        if (type === 'icon_font') {
          const iconFont = content as FeatureIconFontStyle
          this.createFigure({
            name: 'text',
            attrs: { text: iconFont.code, x: coordinate.x + marginLeft, y: coordinate.y + marginTop },
            styles: {
              paddingLeft,
              paddingTop,
              paddingRight,
              paddingBottom,
              borderRadius,
              size,
              family: iconFont.family,
              color: finalColor,
              backgroundColor: finalBackgroundColor
            }
          }, eventHandler)?.draw(ctx)
          contentWidth = ctx.measureText(iconFont.code).width
        } else {
          this.createFigure({
            name: 'rect',
            attrs: { x: coordinate.x + marginLeft, y: coordinate.y + marginTop, width: size, height: size },
            styles: {
              paddingLeft,
              paddingTop,
              paddingRight,
              paddingBottom,
              color: finalBackgroundColor
            }
          }, eventHandler)?.draw(ctx)
          const path = content as FeaturePathStyle
          this.createFigure({
            name: 'path',
            attrs: { path: path.path, x: coordinate.x + marginLeft + paddingLeft, y: coordinate.y + marginTop + paddingTop, width: size, height: size },
            styles: {
              style: path.style,
              lineWidth: path.lineWidth,
              color: finalColor
            }
          })?.draw(ctx)
          contentWidth = size
        }
        coordinate.x += (marginLeft + paddingLeft + contentWidth + paddingRight + marginRight)
      })
    }
    return prevRowHeight
  }

  protected drawStandardTooltipLegends (
    ctx: CanvasRenderingContext2D,
    legends: TooltipLegend[],
    coordinate: Coordinate,
    left: number,
    prevRowHeight: number,
    maxWidth: number,
    styles: TooltipTextStyle
  ): number {
    if (legends.length > 0) {
      const { marginLeft, marginTop, marginRight, marginBottom, size, family, weight } = styles
      ctx.font = createFont(size, weight, family)
      legends.forEach(data => {
        const title = data.title as TooltipLegendChild
        const value = data.value as TooltipLegendChild
        const titleTextWidth = ctx.measureText(title.text).width
        const valueTextWidth = ctx.measureText(value.text).width
        const totalTextWidth = titleTextWidth + valueTextWidth
        const h = marginTop + size + marginBottom
        if (coordinate.x + marginLeft + totalTextWidth + marginRight > maxWidth) {
          coordinate.x = left
          coordinate.y += prevRowHeight
          prevRowHeight = h
        } else {
          prevRowHeight = Math.max(prevRowHeight, h)
        }
        if (title.text.length > 0) {
          this.createFigure({
            name: 'text',
            attrs: { x: coordinate.x + marginLeft, y: coordinate.y + marginTop, text: title.text },
            styles: { color: title.color, size, family, weight }
          })?.draw(ctx)
        }
        this.createFigure({
          name: 'text',
          attrs: { x: coordinate.x + marginLeft + titleTextWidth, y: coordinate.y + marginTop, text: value.text },
          styles: { color: value.color, size, family, weight }
        })?.draw(ctx)
        coordinate.x += (marginLeft + totalTextWidth + marginRight)
      })
    }
    return prevRowHeight
  }

  protected isDrawTooltip (crosshair: Crosshair, styles: TooltipStyle): boolean {
    const showRule = styles.showRule
    return showRule === 'always' ||
      (showRule === 'follow_cross' && isString(crosshair.paneId))
  }

  protected getIndicatorTooltipData (indicator: Indicator): IndicatorTooltipData {
    const chartStore = this.getWidget().getPane().getChart().getChartStore()
    const styles = chartStore.getStyles().indicator
    const tooltipStyles = styles.tooltip
    const name = tooltipStyles.showName ? indicator.shortName : ''
    let calcParamsText = ''
    if (tooltipStyles.showParams) {
      const calcParams = indicator.calcParams
      if (calcParams.length > 0) {
        calcParamsText = `(${calcParams.join(',')})`
      }
    }
    const tooltipData: IndicatorTooltipData = { name, calcParamsText, legends: [], features: tooltipStyles.features }

    const dataIndex = chartStore.getCrosshair().dataIndex!
    const result = indicator.result

    const formatter = chartStore.getInnerFormatter()
    const decimalFold = chartStore.getDecimalFold()
    const thousandsSeparator = chartStore.getThousandsSeparator()
    const legends: TooltipLegend[] = []
    if (indicator.visible) {
      const data = result[dataIndex] ?? result[dataIndex - 1] ?? {}
      eachFigures(indicator, dataIndex, styles, (figure: IndicatorFigure, figureStyles: Required<IndicatorFigureStyle>) => {
        if (isString(figure.title)) {
          const color = figureStyles.color
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment  -- ignore
          let value = data[figure.key]
          if (isNumber(value)) {
            value = formatPrecision(value, indicator.precision)
            if (indicator.shouldFormatBigNumber) {
              value = formatter.formatBigNumber(value as string)
            }
            value = decimalFold.format(thousandsSeparator.format(value as string))
          }
          legends.push({ title: { text: figure.title, color }, value: { text: (value ?? tooltipStyles.defaultValue) as string, color } })
        }
      })
      tooltipData.legends = legends
    }

    if (isFunction(indicator.createTooltipDataSource)) {
      const widget = this.getWidget()
      const pane = widget.getPane()
      const chart = pane.getChart()
      const { name: customName, calcParamsText: customCalcParamsText, legends: customLegends, features: customFeatures } = indicator.createTooltipDataSource({
        chart,
        indicator,
        crosshair: chartStore.getCrosshair(),
        bounding: widget.getBounding(),
        xAxis: pane.getChart().getXAxisPane().getAxisComponent(),
        yAxis: pane.getAxisComponent()
      })
      if (isString(customName) && tooltipStyles.showName) {
        tooltipData.name = customName
      }
      if (isString(customCalcParamsText) && tooltipStyles.showParams) {
        tooltipData.calcParamsText = customCalcParamsText
      }
      if (isValid(customFeatures)) {
        tooltipData.features = customFeatures
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
          if (isNumber(Number(value.text))) {
            value.text = decimalFold.format(thousandsSeparator.format(value.text))
          }
          optimizedLegends.push({ title, value })
        })
        tooltipData.legends = optimizedLegends
      }
    }
    return tooltipData
  }

  protected classifyTooltipFeatures (features: TooltipFeatureStyle[]): TooltipFeatureStyle[][] {
    const leftFeatures: TooltipFeatureStyle[] = []
    const middleFeatures: TooltipFeatureStyle[] = []
    const rightFeatures: TooltipFeatureStyle[] = []
    features.forEach(feature => {
      if (feature.show) {
        switch (feature.position) {
          case 'left': {
            leftFeatures.push(feature)
            break
          }
          case 'middle': {
            middleFeatures.push(feature)
            break
          }
          case 'right': {
            rightFeatures.push(feature)
            break
          }
        }
      }
    })
    return [leftFeatures, middleFeatures, rightFeatures]
  }
}
