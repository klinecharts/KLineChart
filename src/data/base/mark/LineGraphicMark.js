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
import { renderHorizontalLine, renderLine, renderVerticalLine } from '../../../renderer/line'
import { checkPointOnCircle } from '../../../extension/mark/graphicHelper'

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
      const dataIndex = this._xAxis.convertFromPixel(point.x)
      this.performMarkPoints(this._tpPoints, this._hoverIndex, {
        dataIndex,
        timestamp: this._chartData.dataIndexToTimestamp(dataIndex),
        price: this._yAxis.convertFromPixel(point.y)
      })
    }
  }

  /**
   * 处理标记点
   * @param tpPoints
   * @param pressedPointIndex
   * @param dataIndex
   * @param timestamp
   * @param price
   */
  performMarkPoints (tpPoints, pressedPointIndex, { dataIndex, timestamp, price }) {
    tpPoints[pressedPointIndex].timestamp = timestamp
    tpPoints[pressedPointIndex].dataIndex = dataIndex
    tpPoints[pressedPointIndex].price = price
  }

  _checkMousePointOnDifGraphic (point) {
    const graphicMark = this._chartData.styleOptions().graphicMark
    const xyPoints = []
    for (let i = 0; i < this._tpPoints.length; i++) {
      const { timestamp, price, dataIndex } = this._tpPoints[i]
      const xyPoint = {
        x: this._timestampOrDataIndexToPointX({ timestamp, dataIndex }),
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
    const lines = this.generatedLines(xyPoints, {
      width: this._xAxis.width(),
      height: this._yAxis.height()
    })
    for (let i = 0; i < lines.length; i++) {
      const points = lines[i]
      if (this.checkMousePointOnLine(points[0], points[1], point)) {
        return {
          hoverType: HoverType.LINE,
          hoverIndex: i
        }
      }
    }
  }

  /**
   * 检查鼠标点是否在线上
   * @param point1
   * @param point2
   * @param mousePoint
   */
  checkMousePointOnLine (point1, point2, mousePoint) {}

  /**
   * 生成线
   * @param xyPoints
   * @param viewport
   * @private
   */
  generatedLines (xyPoints, viewport) {}

  /**
   * 绘制拓展
   * @param ctx
   * @param lines
   * @param markOptions
   * @param precision
   * @param xAxis
   * @param yAxis
   */
  drawExtend (ctx, lines, markOptions, precision, xAxis, yAxis) {}

  _drawGraphic (ctx, xyPoints, markOptions) {
    ctx.strokeStyle = markOptions.line.color
    ctx.lineWidth = markOptions.line.size
    let lines = []
    if (xyPoints.length > 0) {
      lines = this.generatedLines(xyPoints, {
        width: this._xAxis.width(),
        height: this._yAxis.height()
      })
    }
    lines.forEach(points => {
      const lineType = getLineType(points[0], points[1])
      switch (lineType) {
        case LineType.COMMON: {
          renderLine(ctx, () => {
            ctx.beginPath()
            ctx.moveTo(points[0].x, points[0].y)
            ctx.lineTo(points[1].x, points[1].y)
            ctx.stroke()
            ctx.closePath()
          })
          break
        }
        case LineType.HORIZONTAL: {
          renderHorizontalLine(ctx, points[0].y, points[0].x, points[1].x)
          break
        }
        case LineType.VERTICAL: {
          renderVerticalLine(ctx, points[0].x, points[0].y, points[1].y)
          break
        }
        default: { break }
      }
    })
    this.drawExtend(
      ctx, lines, markOptions,
      {
        price: this._chartData.pricePrecision(),
        volume: this._chartData.volumePrecision()
      },
      this._xAxis,
      this._yAxis
    )
  }
}
