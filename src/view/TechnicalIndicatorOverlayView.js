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
import { TechnicalIndicatorPlotType } from '../component/technicalindicator/TechnicalIndicator'
import { isValid } from '../utils/typeChecks'
import { renderHorizontalLine, renderVerticalLine } from '../renderer/line'
import { calcTextWidth, createFont } from '../utils/canvas'
import { getTechnicalIndicatorTooltipData } from '../store/TechnicalIndicatorStore'
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
   */
  _drawBatchTechToolTip (crosshair, techs, techOptions, offsetTop = 0, isDrawTechTooltip) {
    if (!isDrawTechTooltip) {
      return
    }
    const techTooltipOptions = techOptions.tooltip
    let top = offsetTop
    techs.forEach(tech => {
      this._drawTechTooltip(crosshair, tech, techOptions, top)
      top += (
        techTooltipOptions.text.marginTop +
        techTooltipOptions.text.size +
        techTooltipOptions.text.marginBottom
      )
    })
  }

  /**
   * 绘制指标图例
   * @param crosshair
   * @param tech
   * @param techOptions
   * @param offsetTop
   * @private
   */
  _drawTechTooltip (crosshair, tech, techOptions, offsetTop = 0) {
    const techTooltipOptions = techOptions.tooltip
    const styles = tech.styles || techOptions
    const techResult = tech.result
    const techData = techResult[crosshair.dataIndex]
    const tooltipData = getTechnicalIndicatorTooltipData(techData, tech)
    const colors = styles.line.colors
    const dataList = this._chartStore.dataList()
    const cbData = {
      prev: { kLineData: dataList[crosshair.dataIndex - 1], technicalIndicatorData: techResult[crosshair.dataIndex - 1] },
      current: { kLineData: dataList[crosshair.dataIndex], technicalIndicatorData: techData },
      next: { kLineData: dataList[crosshair.dataIndex + 1], technicalIndicatorData: techResult[crosshair.dataIndex + 1] }
    }
    const plots = tech.plots
    const techTooltipTextOptions = techTooltipOptions.text
    const values = tooltipData.values
    const textMarginLeft = techTooltipTextOptions.marginLeft
    const textMarginRight = techTooltipTextOptions.marginRight
    let labelX = 0
    const labelY = techTooltipTextOptions.marginTop + offsetTop
    const textSize = techTooltipTextOptions.size
    const textColor = techTooltipTextOptions.color
    const colorSize = colors.length
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
    let lineCount = 0
    let valueColor
    plots.forEach((plot, i) => {
      switch (plot.type) {
        case TechnicalIndicatorPlotType.CIRCLE: {
          valueColor = (plot.color && plot.color(cbData, styles)) || styles.circle.noChangeColor
          break
        }
        case TechnicalIndicatorPlotType.BAR: {
          valueColor = (plot.color && plot.color(cbData, styles)) || styles.bar.noChangeColor
          break
        }
        case TechnicalIndicatorPlotType.LINE: {
          valueColor = colors[lineCount % colorSize] || textColor
          lineCount++
          break
        }
        default: { break }
      }
      const title = values[i].title
      if (isValid(title)) {
        labelX += textMarginLeft
        const text = `${title}${values[i].value || techTooltipTextOptions.defaultValue}`
        const textWidth = calcTextWidth(this._ctx, text)
        renderText(this._ctx, valueColor, labelX, labelY, text)
        labelX += (textWidth + textMarginRight)
      }
    })
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
}
