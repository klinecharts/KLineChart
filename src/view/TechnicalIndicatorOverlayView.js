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

import View from './View'
import { TooltipShowRule, LineStyle } from '../options/styleOptions'
import { TechnicalIndicatorPlotType, getTechnicalIndicatorPlotStyle } from '../component/technicalindicator/TechnicalIndicator'
import { isValid, isObject, isFunction } from '../utils/typeChecks'
import { formatPrecision, formatBigNumber } from '../utils/format'
import { renderHorizontalLine, renderVerticalLine } from '../renderer/line'
import { calcTextWidth, createFont } from '../utils/canvas'
import { renderText } from '../renderer/text'

export default class TechnicalIndicatorOverlayView extends View {
  constructor (container, chartStore, xAxis, yAxis, paneId) {
    super(container, chartStore)
    this._xAxis = xAxis
    this._yAxis = yAxis
    this._paneId = paneId
  }

  _draw () {
    this._ctx.textBaseline = 'alphabetic'
    this._drawTag()
    this._drawShape()
    this._drawAnnotation()
    const crosshair = this._chartStore.crosshairStore().get()
    if (crosshair.kLineData) {
      const styleOptions = this._chartStore.styleOptions()
      const crosshairOptions = styleOptions.crosshair
      if (crosshair.paneId === this._paneId) {
        // 绘制十字光标水平线
        this._drawCrosshairLine(crosshairOptions, 'horizontal', crosshair.y, 0, this._width, renderHorizontalLine)
      }
      if (crosshair.paneId) {
        // 绘制十字光标垂直线
        this._drawCrosshairLine(crosshairOptions, 'vertical', crosshair.realX, 0, this._height, renderVerticalLine)
      }
      this._drawTooltip(crosshair, this._chartStore.technicalIndicatorStore().instances(this._paneId))
    }
  }

  /**
   * 绘制注解
   */
  _drawAnnotation () {
    const annotations = this._chartStore.annotationStore().get(this._paneId)
    if (annotations) {
      annotations.forEach(annotation => {
        annotation.draw(this._ctx)
      })
    }
  }

  /**
   * 绘制标签
   */
  _drawTag () {
    const tags = this._chartStore.tagStore().get(this._paneId)
    if (tags) {
      tags.forEach(tag => {
        tag.drawMarkLine(this._ctx)
      })
    }
  }

  /**
   * 绘制图形标记
   * @private
   */
  _drawShape () {
    this._chartStore.shapeStore().instances(this._paneId).forEach(shape => {
      shape.draw(this._ctx)
    })
    const progressShape = this._chartStore.shapeStore().progressInstance()
    if (progressShape.paneId === this._paneId) {
      progressShape.instance.draw(this._ctx)
    }
  }

  /**
   * 绘制图例
   * @param crosshair
   * @param techs
   * @private
   */
  _drawTooltip (crosshair, techs) {
    const techOptions = this._chartStore.styleOptions().technicalIndicator
    this._drawBatchTechToolTip(
      crosshair,
      techs,
      techOptions,
      0,
      this._shouldDrawTooltip(crosshair, techOptions.tooltip)
    )
  }

  /**
   * 绘制十字光标线
   * @param crosshairOptions
   * @param optionsKey
   * @param fixed
   * @param start
   * @param end
   * @param drawLine
   * @private
   */
  _drawCrosshairLine (crosshairOptions, optionsKey, fixed, start, end, drawLine) {
    const crosshairDirectionOptions = crosshairOptions[optionsKey]
    const crosshairLineOptions = crosshairDirectionOptions.line
    if (!crosshairOptions.show || !crosshairDirectionOptions.show || !crosshairLineOptions.show) {
      return
    }
    this._ctx.save()
    this._ctx.lineWidth = crosshairLineOptions.size
    this._ctx.strokeStyle = crosshairLineOptions.color

    if (crosshairLineOptions.style === LineStyle.DASH) {
      this._ctx.setLineDash(crosshairLineOptions.dashValue)
    }
    drawLine(this._ctx, fixed, start, end)
    this._ctx.restore()
  }

  /**
   * 批量绘制技术指标提示
   * @param crosshair
   * @param techs
   * @param techOptions
   * @param offsetTop
   * @param isDrawTechTooltip
   * @returns {number}
   */
  _drawBatchTechToolTip (crosshair, techs, techOptions, offsetTop = 0, isDrawTechTooltip) {
    if (!isDrawTechTooltip) {
      return 0
    }
    const techTooltipOptions = techOptions.tooltip
    let top = offsetTop
    const startTop = top
    techs.forEach(tech => {
      top += (
        techTooltipOptions.text.marginTop +
        this._drawTechTooltip(crosshair, tech, techOptions, top) +
        techTooltipOptions.text.marginBottom
      )
    })
    return top - startTop
  }

  /**
   * 绘制指标图例
   * @param crosshair
   * @param tech
   * @param techOptions
   * @param offsetTop
   * @returns {number}
   * @private
   */
  _drawTechTooltip (crosshair, tech, techOptions, offsetTop = 0) {
    const techTooltipOptions = techOptions.tooltip
    const techTooltipTextOptions = techTooltipOptions.text
    const textMarginLeft = techTooltipTextOptions.marginLeft
    const textMarginRight = techTooltipTextOptions.marginRight
    const textSize = techTooltipTextOptions.size
    const textColor = techTooltipTextOptions.color
    let labelX = 0
    let labelY = techTooltipTextOptions.marginTop + offsetTop
    let tooltipHeight = textSize
    const tooltipData = this._getTechTooltipData(crosshair, tech, techOptions)
    this._ctx.textBaseline = 'top'
    this._ctx.font = createFont(textSize, techTooltipTextOptions.weight, techTooltipTextOptions.family)
    if (techTooltipOptions.showName) {
      const nameText = tooltipData.name
      const nameTextWidth = calcTextWidth(this._ctx, nameText)
      labelX += textMarginLeft
      renderText(this._ctx, textColor, labelX, labelY, nameText)
      labelX += nameTextWidth
      if (!techTooltipOptions.showParams) {
        labelX += textMarginRight
      }
    }
    if (techTooltipOptions.showParams) {
      const calcParamText = tooltipData.calcParamText
      const calcParamTextWidth = calcTextWidth(this._ctx, calcParamText)
      if (!techTooltipOptions.showName) {
        labelX += textMarginLeft
      }
      renderText(this._ctx, textColor, labelX, labelY, calcParamText)
      labelX += (calcParamTextWidth + textMarginRight)
    }
    tooltipData.values.forEach(v => {
      labelX += textMarginLeft
      const text = `${v.title}${v.value}`
      const textWidth = calcTextWidth(this._ctx, text)
      if (labelX + textWidth > this._width) {
        labelX = textMarginLeft
        tooltipHeight += (textSize + 1)
        labelY += (textSize + 1)
      }
      renderText(this._ctx, v.color || techTooltipTextOptions.color, labelX, labelY, text)
      labelX += (textWidth + textMarginRight)
    })
    return tooltipHeight
  }

  /**
   * 是否需要绘制图例
   * @param crosshair
   * @param tooltipOptions
   * @return {boolean|boolean|*}
   */
  _shouldDrawTooltip (crosshair, tooltipOptions) {
    const showRule = tooltipOptions.showRule
    return showRule === TooltipShowRule.ALWAYS ||
      (showRule === TooltipShowRule.FOLLOW_CROSS && (!!crosshair.paneId))
  }

  /**
   * 获取技术指标提示数据
   * @param techData
   * @param tech
   * @returns
   */
  _getTechTooltipData (crosshair, tech, techOptions) {
    const dataList = this._chartStore.dataList()
    const techResult = tech.result

    let calcParamText = ''
    const calcParams = tech.calcParams
    if (calcParams.length > 0) {
      const params = calcParams.map(param => {
        if (isObject(param)) {
          return param.value
        }
        return param
      })
      calcParamText = `(${params.join(',')})`
    }

    let values = []
    if (isFunction(tech.createToolTipDataSource)) {
      values = tech.createToolTipDataSource({
        dataSource: {
          from: this._chartStore.timeScaleStore().from(),
          to: this._chartStore.timeScaleStore().to(),
          kLineDataList: this._chartStore.dataList(),
          technicalIndicatorDataList: techResult
        },
        viewport: {
          width: this._width,
          height: this._height,
          dataSpace: this._chartStore.timeScaleStore().dataSpace(),
          barSpace: this._chartStore.timeScaleStore().barSpace()
        },
        crosshair,
        technicalIndicator: tech,
        xAxis: this._xAxis,
        yAxis: this._yAxis,
        defaultStyles: techOptions
      }) || []
    } else {
      const dataIndex = crosshair.dataIndex
      const styles = tech.styles || techOptions
      const techData = techResult[dataIndex]

      const plots = tech.plots
      const precision = tech.precision
      const shouldFormatBigNumber = tech.shouldFormatBigNumber
      const lineColors = styles.line.colors || []
      const colorSize = lineColors.length
      let lineCount = 0
      plots.forEach(plot => {
        let defaultStyle = {}
        switch (plot.type) {
          case TechnicalIndicatorPlotType.CIRCLE: {
            defaultStyle = { color: styles.circle.noChangeColor }
            break
          }
          case TechnicalIndicatorPlotType.BAR: {
            defaultStyle = { color: styles.bar.noChangeColor }
            break
          }
          case TechnicalIndicatorPlotType.LINE: {
            defaultStyle = { color: lineColors[lineCount % colorSize] || techOptions.tooltip.text.color }
            lineCount++
            break
          }
          default: { break }
        }
        const plotStyle = getTechnicalIndicatorPlotStyle(
          dataList, techResult, crosshair.dataIndex, plot, styles, defaultStyle
        )
        const data = {}
        if (isValid(plot.title)) {
          let value = (techData || {})[plot.key]
          if (isValid(value)) {
            value = formatPrecision(value, precision)
            if (shouldFormatBigNumber) {
              value = formatBigNumber(value)
            }
          }
          data.title = plot.title
          data.value = value || techOptions.tooltip.defaultValue
          data.color = plotStyle.color
          values.push(data)
        }
      })
    }
    return { values, name: tech.shortName, calcParamText }
  }
}
