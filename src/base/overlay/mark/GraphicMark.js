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

import { renderFillCircle } from '../../../renderer/circle'
import { checkPointInCircle } from '../../../extension/mark/graphicHelper'
import { renderHorizontalLine, renderLine, renderVerticalLine } from '../../../renderer/line'
import { isValid, isArray, clone } from '../../../utils/typeChecks'

// 标记图形绘制步骤开始
const GRAPHIC_MARK_DRAW_STEP_START = 1

// 标记图形绘制步骤结束
const GRAPHIC_MARK_DRAW_STEP_FINISHED = -1

/**
 * 图形标记鼠标操作元素类型
 * @type {{OTHER: string, POINT: string, NONE: string}}
 */
export const GraphicMarkMouseOperateElement = {
  OTHER: 'other',
  POINT: 'point',
  NONE: 'none'
}

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
 * @type {{STROKE: string, FILL: string, SOLID: string, DASH: string}}
 */
const GraphicMarkDrawStyle = {
  STROKE: 'stroke',
  FILL: 'fill',
  SOLID: 'solid',
  DASH: 'dash'
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
export default class GraphicMark extends Overlay {
  constructor ({
    id, name, totalStep,
    chartData, xAxis, yAxis,
    points, styles, lock
  }) {
    super({ id, chartData, xAxis, yAxis })
    this._name = name
    this._totalStep = totalStep
    this._lock = lock
    this._drawStep = GRAPHIC_MARK_DRAW_STEP_START
    this._points = []
    this.setPoints(points)
    this.setStyles(styles, chartData.styleOptions().graphicMark)
  }

  /**
   * 加载点
   * @param points
   */
  setPoints (points) {
    if (isArray(points) && points.length > 0) {
      let repeatTotalStep
      if (points.length >= this._totalStep - 1) {
        this._drawStep = GRAPHIC_MARK_DRAW_STEP_FINISHED
        this._points = points.slice(0, this._totalStep - 1)
        repeatTotalStep = this._totalStep - 1
      } else {
        this._drawStep = points.length + 1
        this._points = clone(points)
        repeatTotalStep = points.length
      }
      // 重新演练绘制一遍，防止因为点不对而绘制出错误的图形
      for (let i = 0; i < repeatTotalStep; i++) {
        this.performMouseMoveForDrawing(i + 2, this.points, this._points[i], this._xAxis, this._yAxis)
      }
      if (this._drawStep === GRAPHIC_MARK_DRAW_STEP_FINISHED) {
        this.performMousePressedMove(this._points, this._points.length - 1, this._points[this._points.length - 1], this._xAxis, this._yAxis)
      }
    }
  }

  /**
   * 时间戳转换成x轴上点的位置
   * @param point
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
   * @param style
   * @param markOptions
   * @private
   */
  _drawLines (ctx, lines, style, markOptions) {
    ctx.save()
    ctx.strokeStyle = markOptions.line.color
    ctx.lineWidth = markOptions.line.size
    if (style === GraphicMarkDrawStyle.DASH) {
      ctx.setLineDash(markOptions.line.dashValue)
    }
    lines.forEach(points => {
      if (points.length > 1) {
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
      }
    })
    ctx.restore()
  }

  /**
   * 绘制连续线
   * @param ctx
   * @param continuousLines
   * @param style
   * @param markOptions
   * @private
   */
  _drawContinuousLines (ctx, continuousLines, style, markOptions) {
    ctx.save()
    ctx.strokeStyle = markOptions.line.color
    ctx.lineWidth = markOptions.line.size
    if (style === GraphicMarkDrawStyle.DASH) {
      ctx.setLineDash(markOptions.line.dashValue)
    }
    continuousLines.forEach(points => {
      if (points.length > 0) {
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
    })
    ctx.restore()
  }

  /**
   * 绘制多边形
   * @param ctx
   * @param polygons
   * @param style
   * @param markOptions
   * @private
   */
  _drawPolygons (ctx, polygons, style, markOptions) {
    ctx.save()
    let fillStroke
    if (style === GraphicMarkDrawStyle.FILL) {
      ctx.fillStyle = markOptions.polygon.fill.color
      fillStroke = ctx.fill
    } else {
      ctx.lineWidth = markOptions.polygon.stroke.size
      ctx.strokeStyle = markOptions.polygon.stroke.color
      fillStroke = ctx.stroke
    }
    polygons.forEach(points => {
      if (points.length > 0) {
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
    })
    ctx.restore()
  }

  /**
   * 画圆弧
   * @param ctx
   * @param arcs
   * @param style
   * @param markOptions
   * @private
   */
  _drawArcs (ctx, arcs, style, markOptions) {
    ctx.save()
    if (style === GraphicMarkDrawStyle.FILL) {
      ctx.fillStyle = markOptions.arc.fill.color
    } else {
      ctx.lineWidth = markOptions.arc.stroke.size
      ctx.strokeStyle = markOptions.arc.stroke.color
    }
    arcs.forEach(({ x, y, radius, startAngle, endAngle }) => {
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
    ctx.restore()
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
    ctx.save()
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
    ctx.restore()
  }

  /**
   * 绘制
   * @param ctx
   */
  draw (ctx) {
    const coordinates = this._points.map(({ timestamp, price, dataIndex }) => {
      return {
        x: this._timestampOrDataIndexToPointX({ timestamp, dataIndex }),
        y: this._yAxis.convertToPixel(price)
      }
    })
    const markOptions = this._styles || this._chartData.styleOptions().graphicMark
    if (this._drawStep !== GRAPHIC_MARK_DRAW_STEP_START && coordinates.length > 0) {
      const viewport = { width: this._xAxis.width(), height: this._yAxis.height() }
      const precision = { price: this._chartData.pricePrecision(), volume: this._chartData.volumePrecision() }
      const graphicDataSources = this.createGraphicDataSource(
        this._drawStep, this._points, coordinates, viewport,
        precision, this._xAxis, this._yAxis
      ) || []
      graphicDataSources.forEach(({ type, isDraw, style, dataSource = [] }) => {
        if (!isValid(isDraw) || isDraw) {
          switch (type) {
            case GraphicMarkDrawType.LINE: {
              this._drawLines(ctx, dataSource, style, markOptions)
              break
            }
            case GraphicMarkDrawType.CONTINUOUS_LINE: {
              this._drawContinuousLines(ctx, dataSource, style, markOptions)
              break
            }
            case GraphicMarkDrawType.POLYGON: {
              this._drawPolygons(ctx, dataSource, style, markOptions)
              break
            }
            case GraphicMarkDrawType.ARC: {
              this._drawArcs(ctx, dataSource, style, markOptions)
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
      if (this.drawExtend) {
        ctx.save()
        this.drawExtend(
          ctx, graphicDataSources, markOptions,
          viewport, precision, this._xAxis, this._yAxis
        )
        ctx.restore()
      }
    }
    const graphicMarkMouseOperate = this._chartData.graphicMarkMouseOperate()
    if (
      (graphicMarkMouseOperate.hover.id === this._id && graphicMarkMouseOperate.hover.element !== GraphicMarkMouseOperateElement.NONE) ||
      (graphicMarkMouseOperate.click.id === this._id && graphicMarkMouseOperate.click.element !== GraphicMarkMouseOperateElement.NONE)
    ) {
      coordinates.forEach(({ x, y }, index) => {
        let radius = markOptions.point.radius
        let color = markOptions.point.backgroundColor
        let borderColor = markOptions.point.borderColor
        let borderSize = markOptions.point.borderSize
        if (
          graphicMarkMouseOperate.hover.id === this._id &&
          graphicMarkMouseOperate.hover.element === GraphicMarkMouseOperateElement.POINT &&
          index === graphicMarkMouseOperate.hover.elementIndex
        ) {
          radius = markOptions.point.activeRadius
          color = markOptions.point.activeBackgroundColor
          borderColor = markOptions.point.activeBorderColor
          borderSize = markOptions.point.activeBorderSize
        }
        renderFillCircle(ctx, borderColor, { x, y }, radius + borderSize)
        renderFillCircle(ctx, color, { x, y }, radius)
      })
    }
  }

  /**
   * 设置是否锁定
   * @param lock
   */
  setLock (lock) {
    this._lock = lock
  }

  /**
   * 获取名字
   * @return {*}
   */
  name () {
    return this._name
  }

  /**
   * 是否锁定
   * @return {*}
   */
  lock () {
    return this._lock
  }

  /**
   * 总步骤数
   * @return {*}
   */
  totalStep () {
    return this._totalStep
  }

  /**
   * 获取点
   * @return {[]}
   */
  points () {
    return this._points
  }

  /**
   * 是否在绘制中
   * @return {boolean}
   */
  isDrawing () {
    return this._drawStep !== GRAPHIC_MARK_DRAW_STEP_FINISHED
  }

  /**
   * 检查鼠标点是否在图形上
   * @param mouseCoordinate
   * @return {{id: *, elementIndex: number, element: string}}
   */
  checkMousePointOnGraphic (mouseCoordinate) {
    const markOptions = this._styles || this._chartData.styleOptions().graphicMark
    const coordinates = []
    // 检查鼠标点是否在图形的点上
    for (let i = 0; i < this._points.length; i++) {
      const { timestamp, price, dataIndex } = this._points[i]
      const coordinate = {
        x: this._timestampOrDataIndexToPointX({ timestamp, dataIndex }),
        y: this._yAxis.convertToPixel(price)
      }
      coordinates.push(coordinate)
      if (checkPointInCircle(coordinate, markOptions.point.radius, mouseCoordinate)) {
        return {
          id: this._id,
          element: GraphicMarkMouseOperateElement.POINT,
          elementIndex: i,
          instance: this
        }
      }
    }
    // 检查鼠标点是否在点构成的其它图形上
    const graphicDataSources = this.createGraphicDataSource(
      this._drawStep,
      this._points,
      coordinates,
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
    for (const { key, type, isCheck, dataSource = [] } of graphicDataSources) {
      if (isCheck) {
        for (let i = 0; i < dataSource.length; i++) {
          const sources = dataSource[i]
          if (this.checkMousePointOn(key, type, sources, mouseCoordinate)) {
            return {
              id: this._id,
              element: GraphicMarkMouseOperateElement.OTHER,
              elementIndex: i,
              instance: this
            }
          }
        }
      }
    }
  }

  /**
   * 绘制过程中鼠标移动事件
   * @param point
   */
  mouseMoveForDrawing (point) {
    const dataIndex = this._xAxis.convertFromPixel(point.x)
    const timestamp = this._chartData.dataIndexToTimestamp(dataIndex)
    const price = this._yAxis.convertFromPixel(point.y)
    this._points[this._drawStep - 1] = { timestamp, price, dataIndex }
    this.performMouseMoveForDrawing(this._drawStep, this._points, { timestamp, price, dataIndex }, this._xAxis, this._yAxis)
    this.onDrawing({ id: this._id, step: this._drawStep, points: this._points })
  }

  /**
   * 鼠标左边按钮点击事件
   */
  mouseLeftButtonDownForDrawing () {
    if (this._drawStep === this._totalStep - 1) {
      this._drawStep = GRAPHIC_MARK_DRAW_STEP_FINISHED
      this.onDrawEnd({ id: this._id, points: this._points })
    } else {
      this._drawStep++
    }
  }

  /**
   * 鼠标按住移动方法
   * @param point
   * @param event
   */
  mousePressedMove (point, event) {
    const graphicMarkMouseOperate = this._chartData.graphicMarkMouseOperate()
    const elementIndex = graphicMarkMouseOperate.click.elementIndex
    if (
      !this._lock &&
      graphicMarkMouseOperate.click.id === this._id &&
      graphicMarkMouseOperate.click.element === GraphicMarkMouseOperateElement.POINT &&
      elementIndex !== -1
    ) {
      const dataIndex = this._xAxis.convertFromPixel(point.x)
      const timestamp = this._chartData.dataIndexToTimestamp(dataIndex)
      const price = this._yAxis.convertFromPixel(point.y)
      this._points[elementIndex].timestamp = timestamp
      this._points[elementIndex].dataIndex = dataIndex
      this._points[elementIndex].price = price
      this.performMousePressedMove(this._points, elementIndex, { dataIndex, timestamp, price }, this._xAxis, this._yAxis)
      this.onPressedMove({
        id: graphicMarkMouseOperate.click.id,
        points: this._points,
        event
      })
    }
  }

  // -------------------- 事件开始 -------------------

  /**
   * 开始绘制事件回调
   * @param id
   */
  onDrawStart ({ id }) {}

  /**
   * 绘制过程中事件回调
   * @param id
   * @param step
   * @param points
   */
  onDrawing ({ id, step, points }) {}

  /**
   * 绘制结束事件回调
   * @param id
   * @param points
   */
  onDrawEnd ({ id, points }) {}

  /**
   * 按住移动事件
   * @param id
   * @param points
   * @param event
   */
  onPressedMove ({ id, points, event }) {}

  /**
   * 移除事件回调
   * @param id
   */
  onRemove ({ id }) {}

  // -------------------- 事件结束 -------------------

  // --------------------- 自定义时需要实现的一些方法开始 ----------------------

  /**
   * 检查鼠标点在其它图形上
   * @param key
   * @param type
   * @param points
   * @param mousePoint
   */
  checkMousePointOn (key, type, points, mousePoint) {}

  /**
   * 创建图形配置
   * @param step
   * @param points
   * @param coordinates
   * @param viewport
   * @param precision
   * @param xAxis
   * @param yAxis
   */
  createGraphicDataSource (step, points, coordinates, viewport, precision, xAxis, yAxis) {}

  /**
   * 处理绘制过程中鼠标移动
   * @param step
   * @param points
   * @param point
   * @param xAxis
   * @param yAxis
   */
  performMouseMoveForDrawing (step, points, point, xAxis, yAxis) {}

  /**
   * 处理鼠标按住移动
   * @param points
   * @param pressedPointIndex
   * @param point
   * @param xAxis
   * @param yAxis
   */
  performMousePressedMove (points, pressedPointIndex, point, xAxis, yAxis) {}

  // --------------------- 自定义时需要实现的一些方法结束 ----------------------
}
