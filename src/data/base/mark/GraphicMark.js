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

import { renderStrokeFillCircle } from '../../../renderer/circle'
import { checkPointOnCircle } from '../../../extension/mark/graphicHelper'
import { renderHorizontalLine, renderLine, renderVerticalLine } from '../../../renderer/line'
import { isValid, isArray, isBoolean, clone } from '../../../utils/typeChecks'

export const HoverType = {
  OTHER: 'other',
  POINT: 'point',
  NONE: 'none'
}

// 标记图形绘制步骤开始
const GRAPHIC_MARK_DRAW_STEP_START = 1

// 标记图形绘制步骤结束
const GRAPHIC_MARK_DRAW_STEP_FINISHED = -1

/**
 * 绘制类型
 * @type {{ARC: string, POLYGON: string, LINE: string, CONTINUOUS_LINE: string, TEXT: string}}
 */
const GraphicMarkDrawType = {
  LINE: 'line',
  TEXT: 'text',
  CONTINUOUS_LINE: 'continuous_line',
  POLYGON: 'polygon',
  ARC: 'arc'
}

/**
 * 绘制风格
 * @type {{STROKE: string, FILL: string}}
 */
const GraphicMarkDrawStyle = {
  STROKE: 'stroke',
  FILL: 'fill'
}

/**
 * 线类型
 * @type {{VERTICAL: number, COMMON: number, HORIZONTAL: number}}
 */
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

/**
 * 标记图形
 */
export default class GraphicMark {
  constructor ({
    id, name, totalStep,
    chartData, xAxis, yAxis,
    rightClickRemove
  }) {
    this._id = id
    this._name = name
    this._totalStep = totalStep
    this._chartData = chartData
    this._xAxis = xAxis
    this._yAxis = yAxis
    this._rightClickRemove = isBoolean(rightClickRemove) ? rightClickRemove : true
    this._drawStep = GRAPHIC_MARK_DRAW_STEP_START
    this._tpPoints = []
    this._hoverType = HoverType.NONE
    this._hoverIndex = -1
  }

  /**
   * 时间戳转换成x轴上点的位置
   * @param tpPoint
   * @return {*|number}
   * @private
   */
  _timestampOrDataIndexToPointX ({ timestamp, dataIndex }) {
    return timestamp
      ? this._xAxis.convertToPixel(this._chartData.timestampToDataIndex(timestamp))
      : this._xAxis.convertToPixel(dataIndex)
  }

  /**
   * 绘制线
   * @param ctx
   * @param lines
   * @param markOptions
   * @private
   */
  _drawLines (ctx, lines, markOptions) {
    ctx.strokeStyle = markOptions.line.color
    ctx.lineWidth = markOptions.line.size
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
  }

  /**
   * 绘制连续线
   * @param ctx
   * @param points
   * @param markOptions
   * @private
   */
  _drawContinuousLine (ctx, points, markOptions) {
    if (points.length > 0) {
      ctx.strokeStyle = markOptions.line.color
      ctx.lineWidth = markOptions.line.size
      renderLine(ctx, () => {
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y)
        }
        ctx.stroke()
        ctx.closePath()
      })
    }
  }

  /**
   * 绘制多边形
   * @param ctx
   * @param points
   * @param style
   * @param markOptions
   * @private
   */
  _drawPolygon (ctx, points, style, markOptions) {
    if (points.length > 0) {
      let fillStroke
      if (style === GraphicMarkDrawStyle.FILL) {
        ctx.fillStyle = markOptions.polygon.fill.color
        fillStroke = ctx.fill
      } else {
        ctx.lineWidth = markOptions.polygon.stroke.size
        ctx.strokeStyle = markOptions.polygon.stroke.color
        fillStroke = ctx.stroke
      }
      renderLine(ctx, () => {
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y)
        }
        ctx.closePath()
        fillStroke.call(ctx)
      })
    }
  }

  /**
   * 画圆弧
   * @param ctx
   * @param points
   * @param style
   * @param markOptions
   * @private
   */
  _drawArc (ctx, points, style, markOptions) {
    if (style === GraphicMarkDrawStyle.FILL) {
      ctx.fillStyle = markOptions.arc.fill.color
    } else {
      ctx.lineWidth = markOptions.arc.stroke.size
      ctx.strokeStyle = markOptions.arc.stroke.color
    }
    points.forEach(({ x, y, radius, startAngle, endAngle }) => {
      ctx.beginPath()
      ctx.arc(x, y, radius, startAngle, endAngle)
      if (style === GraphicMarkDrawStyle.FILL) {
        ctx.closePath()
        ctx.fill()
      } else {
        ctx.stroke()
        ctx.closePath()
      }
    })
  }

  /**
   * 绘制文字
   * @param ctx
   * @param texts
   * @param style
   * @param markOptions
   * @private
   */
  _drawText (ctx, texts, style, markOptions) {
    let fillStroke
    if (style === GraphicMarkDrawStyle.STROKE) {
      ctx.strokeStyle = markOptions.text.color
      fillStroke = ctx.strokeText
    } else {
      ctx.fillStyle = markOptions.text.color
      fillStroke = ctx.fillText
    }
    ctx.font = `${markOptions.text.weight} ${markOptions.text.size}px ${markOptions.text.family}`
    texts.forEach(({ x, y, text }) => {
      fillStroke.call(ctx, text, x + markOptions.text.marginLeft, y - markOptions.text.marginBottom)
    })
  }

  /**
   * 绘制
   * @param ctx
   */
  draw (ctx) {
    const xyPoints = this._tpPoints.map(({ timestamp, price, dataIndex }) => {
      return {
        x: this._timestampOrDataIndexToPointX({ timestamp, dataIndex }),
        y: this._yAxis.convertToPixel(price)
      }
    })
    const markOptions = this._chartData.styleOptions().graphicMark
    if (this._drawStep !== GRAPHIC_MARK_DRAW_STEP_START && xyPoints.length > 0) {
      const viewport = { width: this._xAxis.width(), height: this._yAxis.height() }
      const precision = { price: this._chartData.pricePrecision(), volume: this._chartData.volumePrecision() }
      const graphicDataSources = this.createGraphicDataSource(
        this._drawStep, this._tpPoints, xyPoints, viewport,
        precision, this._xAxis, this._yAxis
      ) || []
      graphicDataSources.forEach(({ type, isDraw, style, dataSource = [] }) => {
        if (!isValid(isDraw) || isDraw) {
          switch (type) {
            case GraphicMarkDrawType.LINE: {
              this._drawLines(ctx, dataSource, markOptions)
              break
            }
            case GraphicMarkDrawType.CONTINUOUS_LINE: {
              this._drawContinuousLine(ctx, dataSource, markOptions)
              break
            }
            case GraphicMarkDrawType.POLYGON: {
              this._drawPolygon(ctx, dataSource, style, markOptions)
              break
            }
            case GraphicMarkDrawType.ARC: {
              this._drawArc(ctx, dataSource, style, markOptions)
              break
            }
            case GraphicMarkDrawType.TEXT: {
              this._drawText(ctx, dataSource, style, markOptions)
              break
            }
            default: { break }
          }
        }
      })
      this.drawExtend(
        ctx, graphicDataSources, markOptions,
        viewport, precision, this._xAxis, this._yAxis
      )
    }
    if (this._hoverType !== HoverType.NONE) {
      xyPoints.forEach(({ x, y }, index) => {
        let radius = markOptions.point.radius
        let color = markOptions.point.backgroundColor
        let borderColor = markOptions.point.borderColor
        let borderSize = markOptions.point.borderSize
        if (this._hoverType === HoverType.POINT && index === this._hoverIndex) {
          radius = markOptions.point.activeRadius
          color = markOptions.point.activeBackgroundColor
          borderColor = markOptions.point.activeBorderColor
          borderSize = markOptions.point.activeBorderSize
        }
        renderStrokeFillCircle(ctx, color, borderColor, borderSize, { x, y }, radius)
      })
    }
  }

  /**
   * 设置点
   * @param points
   */
  setPoints (points) {
    if (isArray(points) && points.length > 0) {
      let repeatTotalStep
      if (points.length >= this._totalStep - 1) {
        this._drawStep = GRAPHIC_MARK_DRAW_STEP_FINISHED
        this._tpPoints = points.slice(0, this._totalStep - 1)
        repeatTotalStep = this._totalStep - 1
      } else {
        this._drawStep = points.length + 1
        this._tpPoints = clone(points)
        repeatTotalStep = points.length
      }
      // 重新演练绘制一遍，防止因为点不对而绘制出错误的图形
      for (let i = 0; i < repeatTotalStep; i++) {
        this.performMouseMoveForDrawing(i + 2, this._tpPoints, this._tpPoints[i])
      }
      if (this._drawStep === GRAPHIC_MARK_DRAW_STEP_FINISHED) {
        this.performMousePressedMove(this._tpPoints, this._tpPoints.length - 1, this._tpPoints[this._tpPoints.length - 1])
      }
    }
  }

  /**
   * 获取id
   * @return {*}
   */
  id () {
    return this._id
  }

  /**
   * 获取右击是否删除
   * @return {boolean}
   */
  rightClickRemove () {
    return this._rightClickRemove
  }

  /**
   * 获取鼠标点在图形上的类型
   * @return {string}
   */
  hoverType () {
    return this._hoverType
  }

  /**
   * 是否是活动状态
   * @return {boolean}
   */
  isActive () {
    return this._hoverType !== HoverType.NONE
  }

  /**
   * 是否在绘制中
   * @return {boolean}
   */
  isDrawing () {
    return this._drawStep !== GRAPHIC_MARK_DRAW_STEP_FINISHED
  }

  /**
   * 重置鼠标点在图形上的参数
   */
  resetHoverParams () {
    this._hoverType = HoverType.NONE
    this._hoverIndex = -1
  }

  /**
   * 检查鼠标点是否在图形上
   * @param point
   * @return {boolean}
   */
  checkMousePointOnGraphic (point) {
    const markOptions = this._chartData.styleOptions().graphicMark
    const xyPoints = []
    // 检查鼠标点是否在图形的点上
    for (let i = 0; i < this._tpPoints.length; i++) {
      const { timestamp, price, dataIndex } = this._tpPoints[i]
      const xyPoint = {
        x: this._timestampOrDataIndexToPointX({ timestamp, dataIndex }),
        y: this._yAxis.convertToPixel(price)
      }
      xyPoints.push(xyPoint)
      if (checkPointOnCircle(xyPoint, markOptions.point.radius, point)) {
        this._hoverType = HoverType.POINT
        this._hoverIndex = i
        return true
      }
    }
    // 检查鼠标点是否在点构成的其它图形上
    const graphicDataSources = this.createGraphicDataSource(
      this._drawStep,
      this._tpPoints,
      xyPoints,
      {
        width: this._xAxis.width(),
        height: this._yAxis.height()
      },
      {
        price: this._chartData.pricePrecision(),
        volume: this._chartData.volumePrecision()
      },
      this._xAxis,
      this._yAxis
    ) || []
    for (const { type, isCheck, dataSource = [] } of graphicDataSources) {
      if (isCheck) {
        for (let i = 0; i < dataSource.length; i++) {
          const points = dataSource[i]
          if (this.checkMousePointOn(type, points, point)) {
            this._hoverType = HoverType.OTHER
            this._hoverIndex = i
            return true
          }
        }
      }
    }
    this.resetHoverParams()
  }

  /**
   * 绘制过程总鼠标移动事件
   * @param point
   */
  mouseMoveForDrawing (point) {
    const dataIndex = this._xAxis.convertFromPixel(point.x)
    const timestamp = this._chartData.dataIndexToTimestamp(dataIndex)
    const price = this._yAxis.convertFromPixel(point.y)
    this._tpPoints[this._drawStep - 1] = { timestamp, price, dataIndex }
    this.performMouseMoveForDrawing(this._drawStep, this._tpPoints, { timestamp, price, dataIndex })
  }

  /**
   * 鼠标左边按钮点击事件
   */
  mouseLeftButtonDownForDrawing () {
    if (this._drawStep === this._totalStep - 1) {
      this._drawStep = GRAPHIC_MARK_DRAW_STEP_FINISHED
    } else {
      this._drawStep++
    }
  }

  /**
   * 鼠标按住移动方法
   * @param point
   */
  mousePressedMove (point) {
    if (this._hoverType === HoverType.POINT && this._hoverIndex !== -1) {
      const dataIndex = this._xAxis.convertFromPixel(point.x)
      const timestamp = this._chartData.dataIndexToTimestamp(dataIndex)
      const price = this._yAxis.convertFromPixel(point.y)
      this._tpPoints[this._hoverIndex].timestamp = timestamp
      this._tpPoints[this._hoverIndex].dataIndex = dataIndex
      this._tpPoints[this._hoverIndex].price = price
      this.performMousePressedMove(this._tpPoints, this._hoverIndex, { dataIndex, timestamp, price })
    }
  }

  /**
   * 检查鼠标点在其它图形上
   * @param type
   * @param points
   * @param mousePoint
   */
  checkMousePointOn (type, points, mousePoint) {}

  /**
   * 创建图形配置
   * @param step
   * @param tpPoints
   * @param xyPoints
   * @param viewport
   * @param precision
   * @param xAxis
   * @param yAxis
   */
  createGraphicDataSource (step, tpPoints, xyPoints, viewport, precision, xAxis, yAxis) {}

  /**
   * 处理绘制过程中鼠标移动
   * @param step
   * @param tpPoints
   * @param tpPoint
   */
  performMouseMoveForDrawing (step, tpPoints, tpPoint) {}

  /**
   * 处理鼠标按住移动
   * @param tpPoints
   * @param pressedPointIndex
   * @param tpPoint
   */
  performMousePressedMove (tpPoints, pressedPointIndex, tpPoint) {}

  /**
   * 扩展绘制
   * @param ctx
   * @param graphicDataSources
   * @param markOptions
   * @param viewport
   * @param precision
   * @param xAxis
   * @param yAxis
   */
  drawExtend (ctx, graphicDataSources, markOptions, viewport, precision, xAxis, yAxis) {}
}
