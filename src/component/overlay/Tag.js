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

import Overlay from './Overlay'
import { LineStyle, OverlayPosition, YAxisPosition } from '../../options/styleOptions'
import { renderHorizontalLine } from '../../renderer/line'
import { isValid, isObject } from '../../utils/typeChecks'
import { createFont, getTextRectWidth, getTextRectHeight } from '../../utils/canvas'
import { renderStrokeFillRoundRect } from '../../renderer/rect'
import { renderText } from '../../renderer/text'

export default class Tag extends Overlay {
  constructor ({
    id, point = {}, text, mark, chartStore, xAxis, yAxis, styles
  }) {
    super({ id, chartStore, points: point, xAxis, yAxis })
    this._text = text
    this._mark = mark
    this.setStyles(styles, chartStore.styleOptions().tag)
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
      this._points = point
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
    if (this.setStyles(styles, this._chartStore.styleOptions().tag)) {
      success = true
    }
    return success
  }

  /**
   * 绘制标记和线
   * @param ctx
   */
  drawMarkLine (ctx) {
    const options = this._chartStore.styleOptions()
    const yAxisOptions = options.yAxis
    const tagOptions = this._styles || options.tag
    const y = this._getY(tagOptions)
    ctx.save()
    this._drawLine(ctx, y, tagOptions, yAxisOptions)
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
    const options = this._chartStore.styleOptions()
    const tagOptions = this._styles || options.tag
    const tagTextOptions = tagOptions.text
    ctx.save()
    const rectWidth = getTextRectWidth(ctx, this._text, tagTextOptions)
    const rectHeight = getTextRectHeight(tagTextOptions)
    let x
    if (this._yAxis.isFromYAxisZero()) {
      x = 0
    } else {
      x = this._yAxis.width() - rectWidth
    }
    const y = this._getY(tagOptions)
    renderStrokeFillRoundRect(
      ctx,
      tagTextOptions.backgroundColor,
      tagTextOptions.borderColor,
      tagTextOptions.borderSize,
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
   * @param tagOptions
   * @private
   */
  _drawLine (ctx, y, tagOptions, yAxisOptions) {
    const tagLineOptions = tagOptions.line
    if (!tagLineOptions.show) {
      return
    }
    ctx.save()
    const textRectWidth = getTextRectWidth(ctx, this._text, tagOptions.text)
    const markRectWidth = getTextRectWidth(ctx, this._mark, tagOptions.mark)
    ctx.strokeStyle = tagLineOptions.color
    ctx.lineWidth = tagLineOptions.size
    if (tagLineOptions.style === LineStyle.DASH) {
      ctx.setLineDash(tagLineOptions.dashValue)
    }
    const markOffset = tagOptions.mark.offset
    const lines = []
    const textValid = isValid(this._text)
    const markValid = isValid(this._mark)
    if (yAxisOptions.inside) {
      if (yAxisOptions.position === YAxisPosition.LEFT) {
        if (textValid && markValid) {
          if (markOffset > 0) {
            lines.push([textRectWidth, textRectWidth + markOffset])
            lines.push([textRectWidth + markOffset + markRectWidth, this._xAxis.width()])
          } else {
            if (Math.abs(markOffset) < Math.min(textRectWidth, markRectWidth)) {
              lines.push([textRectWidth + markOffset + markRectWidth, this._xAxis.width()])
            } else {
              lines.push([Math.max(textRectWidth, markRectWidth), this._xAxis.width()])
            }
          }
        } else {
          if (textValid) {
            lines.push([textRectWidth, this._xAxis.width()])
          } else if (markValid) {
            if (markOffset > 0) {
              lines.push([0, markOffset])
              lines.push([markOffset + markRectWidth, this._xAxis.width()])
            } else {
              if (Math.abs(markOffset) < markRectWidth) {
                lines.push([markOffset + markRectWidth, this._xAxis.width()])
              } else {
                lines.push([0, this._xAxis.width()])
              }
            }
          } else {
            lines.push([0, this._xAxis.width()])
          }
        }
      } else {
        if (textValid && markValid) {
          if (markOffset < 0) {
            lines.push([0, this._xAxis.width() - textRectWidth + markOffset - markRectWidth])
            lines.push([this._xAxis.width() - textRectWidth + markOffset, this._xAxis.width() - textRectWidth])
          } else {
            if (markOffset < Math.min(textRectWidth, markRectWidth)) {
              lines.push([0, this._xAxis.width() - textRectWidth - markRectWidth + markOffset])
            } else {
              lines.push([0, this._xAxis.width() - Math.max(textRectWidth, markRectWidth)])
            }
          }
        } else {
          if (textValid) {
            lines.push([0, this._xAxis.width() - textRectWidth])
          } else if (markValid) {
            if (markOffset < 0) {
              lines.push([0, this._xAxis.width() + markOffset - markRectWidth])
              lines.push([this._xAxis.width() + markOffset, this._xAxis.width()])
            } else {
              if (markOffset < markRectWidth) {
                lines.push([0, this._xAxis.width() - markRectWidth + markOffset])
              } else {
                lines.push([0, this._xAxis.width()])
              }
            }
          } else {
            lines.push([0, this._xAxis.width()])
          }
        }
      }
    } else {
      if (yAxisOptions.position === YAxisPosition.LEFT) {
        if (markValid) {
          if (markOffset > 0) {
            lines.push([0, markOffset])
            lines.push([markOffset + markRectWidth, this._xAxis.width()])
          } else {
            if (Math.abs(markOffset) < markRectWidth) {
              lines.push([markRectWidth + markOffset, this._xAxis.width()])
            } else {
              lines.push([0, this._xAxis.width()])
            }
          }
        } else {
          lines.push([0, this._xAxis.width()])
        }
      } else {
        if (markValid) {
          if (markOffset < 0) {
            lines.push([0, this._xAxis.width() - markRectWidth + markOffset])
            lines.push([this._xAxis.width() + markOffset, this._xAxis.width()])
          } else {
            if (markOffset < markRectWidth) {
              lines.push([0, this._xAxis.width() - markRectWidth + markOffset])
            } else {
              lines.push([0, this._xAxis.width()])
            }
          }
        } else {
          lines.push([0, this._xAxis.width()])
        }
      }
    }
    lines.forEach(line => {
      renderHorizontalLine(ctx, y, line[0], line[1])
    })
    ctx.restore()
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
    const rectWidth = getTextRectWidth(ctx, this._mark, tagMarkOptions)
    const rectHeight = getTextRectHeight(tagMarkOptions)
    let x
    if (yAxisOptions.inside) {
      let textRectWidth = 0
      if (isValid(this._text)) {
        textRectWidth = getTextRectWidth(ctx, this._text, tagOptions.text)
      }
      if (yAxisOptions.position === YAxisPosition.LEFT) {
        x = textRectWidth
      } else {
        x = this._xAxis.width() - textRectWidth - rectWidth
      }
    } else {
      if (yAxisOptions.position === YAxisPosition.LEFT) {
        x = 0
      } else {
        x = this._xAxis.width() - rectWidth
      }
    }
    x += tagMarkOptions.offset
    renderStrokeFillRoundRect(
      ctx,
      tagMarkOptions.backgroundColor,
      tagMarkOptions.borderColor,
      tagMarkOptions.borderSize,
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
        return this._yAxis.convertToNicePixel(this._points.value) + offset
      }
    }
  }
}
