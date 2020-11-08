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

import GraphicMark, { HoverType } from './GraphicMark'
import { drawHorizontalLine, drawLine, drawVerticalLine } from '../utils/canvas'
import { checkPointOnCircle } from './graphicHelper'

const LineType = {
  COMMON: 0,
  HORIZONTAL: 1,
  VERTICAL: 2
}

/**
 * 获取绘制线类型
 * @param point1
 * @param point2
 * @private
 */
function getLineType (point1, point2) {
  if (point1.x === point2.x) {
    return LineType.VERTICAL
  }
  if (point1.y === point2.y) {
    return LineType.HORIZONTAL
  }
  return LineType.COMMON
}

export default class LineGraphicMark extends GraphicMark {
  /**
   * 鼠标按住移动方法
   * @param point
   */
  mousePressedMove (point) {
    if (this._hoverType === HoverType.POINT && this._hoverIndex !== -1) {
      this._points[this._hoverIndex].xPos = this._xAxis.convertFromPixel(point.x)
      this._points[this._hoverIndex].price = this._yAxis.convertFromPixel(point.y)
    }
  }

  _checkMousePointOnDifGraphic (point) {
    const graphicMark = this._chartData.styleOptions().graphicMark
    const xyPoints = []
    for (let i = 0; i < this._points.length; i++) {
      const { xPos, price } = this._points[i]
      const xyPoint = {
        x: this._xAxis.convertToPixel(xPos),
        y: this._yAxis.convertToPixel(price)
      }
      xyPoints.push(xyPoint)
      if (checkPointOnCircle(xyPoint, graphicMark.point.radius, point)) {
        return {
          hoverType: HoverType.POINT,
          hoverIndex: i
        }
      }
    }
    return this._checkMousePointOnLine(point, xyPoints)
  }

  _checkMousePointOnLine (point, xyPoints) {}

  /**
   * 生成线
   * @param xyPoints
   * @private
   */
  _generatedDrawLines (xyPoints) {}

  /**
   * 绘制拓展
   * @private
   */
  _drawGraphicExtend (ctx, lines, graphicMark) {}

  _drawGraphic (ctx, xyPoints, graphicMark) {
    ctx.strokeStyle = graphicMark.line.color
    ctx.lineWidth = graphicMark.line.size
    let lines = []
    if (xyPoints.length > 0) {
      lines = this._generatedDrawLines(xyPoints)
    }
    lines.forEach(points => {
      const lineType = getLineType(points[0], points[1])
      switch (lineType) {
        case LineType.COMMON: {
          drawLine(ctx, () => {
            ctx.beginPath()
            ctx.moveTo(points[0].x, points[0].y)
            ctx.lineTo(points[1].x, points[1].y)
            ctx.stroke()
            ctx.closePath()
          })
          break
        }
        case LineType.HORIZONTAL: {
          drawHorizontalLine(ctx, points[0].y, points[0].x, points[1].x)
          break
        }
        case LineType.VERTICAL: {
          drawVerticalLine(ctx, points[0].x, points[0].y, points[1].y)
          break
        }
        default: { break }
      }
    })
    this._drawGraphicExtend(ctx, lines, graphicMark)
  }
}
