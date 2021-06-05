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
import { LineStyle, YAxisPosition } from '../../../data/options/styleOptions'
import { renderHorizontalLine } from '../../../renderer/line'
import { isValid } from '../../../utils/typeChecks'
import { calcTextWidth, createFont } from '../../../utils/canvas'
import { renderFillRoundRect } from '../../../renderer/rect'
import { renderText } from '../../../renderer/text'

export default class Tag extends Overlay {
  constructor ({
    id, value, mark, coordinate, chartData, xAxis, yAxis, styles
  }) {
    super({ id, chartData, xAxis, yAxis })
    this._value = value
    this._mark = mark
    this._coordinate = coordinate
    this.setStyles(styles, chartData.styleOptions().tag)
  }

  /**
   * 绘制标记和线
   * @param ctx
   */
  drawMarkLine (ctx) {
    const options = this._chartData.styleOptions()
    const yAxisOptions = options.yAxis
    const tagOptions = this._styles || options.tag
    const y = this._getY(tagOptions.offset)
    ctx.save()
    this._drawLine(ctx, y, tagOptions.line)
    this._drawMark(ctx, y, tagOptions.text, yAxisOptions)
    ctx.restore()
  }

  /**
   * 绘制值
   */
  drawValue (ctx) {
    const options = this._chartData.styleOptions()
    const tagOptions = this._styles || options.tag
    if (!tagOptions.text.show || !tagOptions.text.value.show || !isValid(this._value)) {
      return
    }
    const tagTextValueOptions = tagOptions.text.value
    ctx.font = createFont(tagTextValueOptions.size, tagTextValueOptions.weight, tagTextValueOptions.family)
    const rectWidth = this._getValueRectWidth(ctx, tagTextValueOptions)
    const rectHeight = tagTextValueOptions.paddingTop + tagTextValueOptions.paddingBottom + tagTextValueOptions.size
    let x
    if (this._yAxis.isFromYAxisZero()) {
      x = 0
    } else {
      x = this._yAxis.width() - rectWidth
    }
    const y = this._getY(tagOptions.offset)
    renderFillRoundRect(
      ctx,
      tagTextValueOptions.backgroundColor,
      x,
      y - rectHeight / 2,
      rectWidth,
      rectHeight,
      tagTextValueOptions.borderRadius
    )
    renderText(ctx, tagTextValueOptions.color, x + tagTextValueOptions.paddingLeft, y, this._value)
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
   * @param tagTextOptions
   * @param yAxisOptions
   * @private
   */
  _drawMark (ctx, y, tagTextOptions, yAxisOptions) {
    if (!tagTextOptions.show || !tagTextOptions.mark.show || !isValid(this._mark)) {
      return
    }
    const tagTextMarkOptions = tagTextOptions.mark
    ctx.font = createFont(tagTextMarkOptions.size, tagTextMarkOptions.weight, tagTextMarkOptions.family)
    const rectWidth = tagTextMarkOptions.paddingLeft + tagTextMarkOptions.paddingRight + calcTextWidth(ctx, this._mark)
    const rectHeight = tagTextMarkOptions.paddingTop + tagTextMarkOptions.paddingBottom + tagTextMarkOptions.size
    let x
    if (yAxisOptions.inside) {
      let valueRectWidth = 0
      if (isValid(this._value) && tagTextOptions.value.show) {
        valueRectWidth = this._getValueRectWidth(ctx, tagTextOptions.value)
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
      tagTextMarkOptions.backgroundColor,
      x,
      y - rectHeight / 2,
      rectWidth,
      rectHeight,
      tagTextMarkOptions.borderRadius
    )
    ctx.textBaseline = 'middle'
    ctx.font = createFont(tagTextMarkOptions.size, tagTextMarkOptions.weight, tagTextMarkOptions.family)
    renderText(ctx, tagTextMarkOptions.color, x + tagTextMarkOptions.paddingLeft, y, this._mark)
  }

  /**
   * 获取坐标y值
   * @param offset
   * @return {*}
   * @private
   */
  _getY (offset = 0) {
    if (isValid(this._coordinate)) {
      return this._coordinate
    }
    return this._yAxis.convertToNicePixel(+this._value) + offset
  }

  /**
   * 获取值的矩形宽度
   * @param ctx
   * @param valueOptions
   * @return {*}
   * @private
   */
  _getValueRectWidth (ctx, valueOptions) {
    ctx.font = createFont(valueOptions.size, valueOptions.weight, valueOptions.family)
    return valueOptions.paddingLeft + valueOptions.paddingRight + calcTextWidth(ctx, this._value)
  }
}
