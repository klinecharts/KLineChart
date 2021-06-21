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

import Overlay from '../Overlay'
import { LineStyle, OverlayPosition, YAxisPosition } from '../../../data/options/styleOptions'
import { renderHorizontalLine } from '../../../renderer/line'
import { isValid, isObject } from '../../../utils/typeChecks'
import { calcTextWidth, createFont } from '../../../utils/canvas'
import { renderFillRoundRect } from '../../../renderer/rect'
import { renderText } from '../../../renderer/text'

export default class Tag extends Overlay {
  constructor ({
    id, point, text, mark, chartData, xAxis, yAxis, styles
  }) {
    super({ id, chartData, xAxis, yAxis })
    this._point = point || {}
    this._text = text
    this._mark = mark
    this.setStyles(styles, chartData.styleOptions().tag)
  }

  /**
   * 更新
   * @param point
   * @param text
   * @param mark
   * @param styles
   * @return {boolean}
   */
  update ({ point, text, mark, styles }) {
    let success = false
    if (isObject(point)) {
      this._point = point
      success = true
    }
    if (isValid(text)) {
      this._text = text
      success = true
    }
    if (isValid(mark)) {
      this._mark = mark
      success = true
    }
    if (this.setStyles(styles, this._chartData.styleOptions().tag)) {
      success = true
    }
    return success
  }

  /**
   * 绘制标记和线
   * @param ctx
   */
  drawMarkLine (ctx) {
    const options = this._chartData.styleOptions()
    const yAxisOptions = options.yAxis
    const tagOptions = this._styles || options.tag
    const y = this._getY(tagOptions)
    ctx.save()
    this._drawLine(ctx, y, tagOptions.line)
    this._drawMark(ctx, y, tagOptions, yAxisOptions)
    ctx.restore()
  }

  /**
   * 绘制值
   */
  drawText (ctx) {
    if (!isValid(this._text)) {
      return
    }
    const options = this._chartData.styleOptions()
    const tagOptions = this._styles || options.tag
    const tagTextOptions = tagOptions.text
    ctx.save()
    ctx.font = createFont(tagTextOptions.size, tagTextOptions.weight, tagTextOptions.family)
    const rectWidth = this._getTextRectWidth(ctx, tagTextOptions)
    const rectHeight = tagTextOptions.paddingTop + tagTextOptions.paddingBottom + tagTextOptions.size
    let x
    if (this._yAxis.isFromYAxisZero()) {
      x = 0
    } else {
      x = this._yAxis.width() - rectWidth
    }
    const y = this._getY(tagOptions)
    renderFillRoundRect(
      ctx,
      tagTextOptions.backgroundColor,
      x,
      y - rectHeight / 2,
      rectWidth,
      rectHeight,
      tagTextOptions.borderRadius
    )
    renderText(ctx, tagTextOptions.color, x + tagTextOptions.paddingLeft, y, this._text)
    ctx.restore()
  }

  /**
   * 绘制线
   * @param ctx
   * @param y
   * @param tagLineOptions
   * @private
   */
  _drawLine (ctx, y, tagLineOptions) {
    if (!tagLineOptions.show) {
      return
    }
    ctx.strokeStyle = tagLineOptions.color
    ctx.lineWidth = tagLineOptions.size
    if (tagLineOptions.style === LineStyle.DASH) {
      ctx.setLineDash(tagLineOptions.dashValue)
    }
    renderHorizontalLine(ctx, y, 0, this._xAxis.width())
  }

  /**
   * 绘制标记
   * @param ctx
   * @param y
   * @param tagOptions
   * @param yAxisOptions
   * @private
   */
  _drawMark (ctx, y, tagOptions, yAxisOptions) {
    if (!isValid(this._mark)) {
      return
    }
    const tagMarkOptions = tagOptions.mark
    ctx.font = createFont(tagMarkOptions.size, tagMarkOptions.weight, tagMarkOptions.family)
    const rectWidth = tagMarkOptions.paddingLeft + tagMarkOptions.paddingRight + calcTextWidth(ctx, this._mark)
    const rectHeight = tagMarkOptions.paddingTop + tagMarkOptions.paddingBottom + tagMarkOptions.size
    let x
    if (yAxisOptions.inside) {
      let valueRectWidth = 0
      if (isValid(this._text)) {
        valueRectWidth = this._getTextRectWidth(ctx, tagOptions.text)
      }
      if (yAxisOptions.position === YAxisPosition.LEFT) {
        x = valueRectWidth
      } else {
        x = this._xAxis.width() - valueRectWidth - rectWidth
      }
    } else {
      if (yAxisOptions.position === YAxisPosition.LEFT) {
        x = 0
      } else {
        x = this._xAxis.width() - rectWidth
      }
    }
    renderFillRoundRect(
      ctx,
      tagMarkOptions.backgroundColor,
      x,
      y - rectHeight / 2,
      rectWidth,
      rectHeight,
      tagMarkOptions.borderRadius
    )
    ctx.textBaseline = 'middle'
    ctx.font = createFont(tagMarkOptions.size, tagMarkOptions.weight, tagMarkOptions.family)
    renderText(ctx, tagMarkOptions.color, x + tagMarkOptions.paddingLeft, y, this._mark)
  }

  /**
   * 获取坐标y值
   * @param tagOptions
   * @return {*}
   * @private
   */
  _getY (tagOptions) {
    const offset = tagOptions.offset
    switch (tagOptions.position) {
      case OverlayPosition.TOP: {
        return offset
      }
      case OverlayPosition.BOTTOM: {
        return this._yAxis.height() + offset
      }
      default: {
        return this._yAxis.convertToNicePixel(this._point.price) + offset
      }
    }
  }

  /**
   * 获取值的矩形宽度
   * @param ctx
   * @param textOptions
   * @return {*}
   * @private
   */
  _getTextRectWidth (ctx, textOptions) {
    ctx.font = createFont(textOptions.size, textOptions.weight, textOptions.family)
    return textOptions.paddingLeft + textOptions.paddingRight + calcTextWidth(ctx, this._text)
  }
}
