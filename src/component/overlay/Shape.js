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

import { renderFillCircle } from '../../renderer/circle'
import { checkCoordinateInCircle } from '../../extension/shape/shapeHelper'
import { renderHorizontalLine, renderLine, renderVerticalLine } from '../../renderer/line'
import { renderCloseStrokePath, renderCloseFillPath } from '../../renderer/path'
import { isArray, isValid, clone } from '../../utils/typeChecks'
import { createFont } from '../../utils/canvas'

import { StrokeFillStyle, LineStyle } from '../../options/styleOptions'

// 标记图形绘制步骤开始
const SHAPE_DRAW_STEP_START = 1

// 标记图形绘制步骤结束
const SHAPE_DRAW_STEP_FINISHED = -1

/**
 * 事件操作元素类型
 * @type {{OTHER: string, POINT: string, NONE: string}}
 */
export const ShapeEventOperateElement = {
  OTHER: 'other',
  POINT: 'point',
  NONE: 'none'
}

/**
 * 绘制类型
 * @type {{ARC: string, POLYGON: string, LINE: string, CONTINUOUS_LINE: string, TEXT: string}}
 */
const ShapeElementType = {
  LINE: 'line',
  TEXT: 'text',
  CONTINUOUS_LINE: 'continuous_line',
  POLYGON: 'polygon',
  ARC: 'arc'
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
 * 图形模式
 */
const ShapeMode = {
  NORMAL: 'normal',
  WEAK_MAGNET: 'weak_magnet',
  STRONG_MAGNET: 'strong_magnet'
}

/**
 * 获取绘制线类型
 * @param coordinate1
 * @param coordinate2
 * @private
 */
function getLineType (coordinate1, coordinate2) {
  if (coordinate1.x === coordinate2.x) {
    return LineType.VERTICAL
  }
  if (coordinate1.y === coordinate2.y) {
    return LineType.HORIZONTAL
  }
  return LineType.COMMON
}

/**
 * 标记图形
 */
export default class Shape extends Overlay {
  constructor ({
    id, name, totalStep,
    chartStore, xAxis, yAxis,
    points = [], styles, lock, mode, data
  }) {
    super({ id, chartStore, points, xAxis, yAxis })
    this._name = name
    this._totalStep = totalStep
    this._lock = lock
    this._mode = ShapeMode.NORMAL
    this.setMode(mode)
    this._data = data
    this._drawStep = SHAPE_DRAW_STEP_START
    this.setPoints(points)
    this.setStyles(styles, chartStore.styleOptions().shape)
    this._prevPressPoint = null
    this._prevPoints = null
    this._coordinates = []
  }

  /**
   * 加载点
   * @param points
   * @return {undefined|boolean}
   */
  setPoints (points) {
    if (isArray(points) && points.length > 0) {
      let repeatTotalStep
      if (points.length >= this._totalStep - 1) {
        this._drawStep = SHAPE_DRAW_STEP_FINISHED
        this._points = points.slice(0, this._totalStep - 1)
        repeatTotalStep = this._totalStep - 1
      } else {
        this._drawStep = points.length + 1
        this._points = clone(points)
        repeatTotalStep = points.length
      }
      // 重新演练绘制一遍，防止因为点不对而绘制出错误的图形
      for (let i = 0; i < repeatTotalStep; i++) {
        this.performEventMoveForDrawing({
          step: i + 2,
          mode: this._mode,
          points: this._points,
          movePoint: this._points[i],
          xAxis: this._xAxis,
          yAxis: this._yAxis
        })
      }
      if (this._drawStep === SHAPE_DRAW_STEP_FINISHED) {
        this.performEventPressedMove({
          mode: this._mode,
          points: this._points,
          pressPointIndex: this._points.length - 1,
          pressPoint: this._points[this._points.length - 1],
          xAxis: this._xAxis,
          yAxis: this._yAxis
        })
      }
      // 设置点后需要重绘，返回重绘标识
      return true
    }
  }

  /**
   * 时间戳转换成x轴上点的位置
   * @param point
   * @return {*|number}
   * @private
   */
  _timestampOrDataIndexToCoordinateX ({ timestamp, dataIndex }) {
    if (timestamp) {
      dataIndex = this._chartStore.timeScaleStore().timestampToDataIndex(timestamp)
    }
    return this._xAxis.convertToPixel(dataIndex)
  }

  /**
   * 绘制线
   * @param ctx
   * @param lines
   * @param styles
   * @param defaultStyles
   * @private
   */
  _drawLines (ctx, lines, styles, defaultStyles) {
    ctx.save()
    ctx.strokeStyle = styles.color || defaultStyles.color
    ctx.lineWidth = styles.size || defaultStyles.size
    if (styles.style === LineStyle.DASH) {
      ctx.setLineDash(styles.dashValue || defaultStyles.dashValue)
    }
    lines.forEach(coordinates => {
      if (coordinates.length > 1) {
        const lineType = getLineType(coordinates[0], coordinates[1])
        switch (lineType) {
          case LineType.COMMON: {
            renderLine(ctx, coordinates)
            break
          }
          case LineType.HORIZONTAL: {
            renderHorizontalLine(ctx, coordinates[0].y, coordinates[0].x, coordinates[1].x)
            break
          }
          case LineType.VERTICAL: {
            renderVerticalLine(ctx, coordinates[0].x, coordinates[0].y, coordinates[1].y)
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
   * @param styles
   * @param styles
   * @private
   */
  _drawContinuousLines (ctx, continuousLines, styles, defaultStyles) {
    ctx.save()
    ctx.strokeStyle = styles.color || defaultStyles.color
    ctx.lineWidth = styles.size || defaultStyles.size
    if (styles.style === LineStyle.DASH) {
      ctx.setLineDash(styles.dashValue || defaultStyles.dashValue)
    }
    continuousLines.forEach(coordinates => {
      if (coordinates.length > 0) {
        renderLine(ctx, coordinates)
      }
    })
    ctx.restore()
  }

  /**
   * 绘制多边形
   * @param ctx
   * @param polygons
   * @param styles
   * @param defaultStyles
   * @private
   */
  _drawPolygons (ctx, polygons, styles, defaultStyles) {
    ctx.save()
    let strokeFill
    if (styles.style === StrokeFillStyle.FILL) {
      ctx.fillStyle = (styles.fill || defaultStyles.fill).color
      strokeFill = renderCloseFillPath
    } else {
      const strokeStyles = styles.stroke || defaultStyles.stroke
      if (strokeStyles.style === LineStyle.DASH) {
        ctx.setLineDash(strokeStyles.dashValue)
      }
      ctx.lineWidth = strokeStyles.size
      ctx.strokeStyle = strokeStyles.color
      strokeFill = renderCloseStrokePath
    }
    polygons.forEach(coordinates => {
      if (coordinates.length > 0) {
        strokeFill(ctx, coordinates)
      }
    })
    ctx.restore()
  }

  /**
   * 画圆弧
   * @param ctx
   * @param arcs
   * @param styles
   * @param defaultStyles
   * @private
   */
  _drawArcs (ctx, arcs, styles, defaultStyles) {
    ctx.save()
    if (styles.style === StrokeFillStyle.FILL) {
      ctx.fillStyle = (styles.fill || defaultStyles.fill).color
    } else {
      const strokeStyles = styles.stroke || defaultStyles.stroke
      if (strokeStyles.style === LineStyle.DASH) {
        ctx.setLineDash(strokeStyles.dashValue)
      }
      ctx.lineWidth = strokeStyles.size
      ctx.strokeStyle = strokeStyles.color
    }
    arcs.forEach(({ x, y, radius, startAngle, endAngle }) => {
      ctx.beginPath()
      ctx.arc(x, y, radius, startAngle, endAngle)
      if (styles.style === StrokeFillStyle.FILL) {
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
   * @param styles
   * @param defaultStyles
   * @private
   */
  _drawText (ctx, texts, styles, defaultStyles) {
    ctx.save()
    let fillStroke
    if (styles.style === StrokeFillStyle.STROKE) {
      ctx.strokeStyle = styles.color || defaultStyles.color
      fillStroke = ctx.strokeText
    } else {
      ctx.fillStyle = styles.color || defaultStyles.color
      fillStroke = ctx.fillText
    }
    ctx.font = createFont(
      styles.size || defaultStyles.size,
      styles.weight || defaultStyles.weight,
      styles.family || defaultStyles.family
    )
    const offset = styles.offset || defaultStyles.offset || [0, 0]
    texts.forEach(({ x, y, text }) => {
      fillStroke.call(
        ctx,
        text,
        x + offset[1],
        y + offset[0]
      )
    })
    ctx.restore()
  }

  /**
   * 绘制
   * @param ctx
   */
  draw (ctx) {
    this._coordinates = this._points.map(({ timestamp, value, dataIndex }) => {
      return {
        x: this._timestampOrDataIndexToCoordinateX({ timestamp, dataIndex }),
        y: this._yAxis.convertToPixel(value)
      }
    })
    const shapeOptions = this._styles || this._chartStore.styleOptions().shape
    if (this._drawStep !== SHAPE_DRAW_STEP_START && this._coordinates.length > 0) {
      const viewport = { width: this._xAxis.width(), height: this._yAxis.height() }
      const precision = { price: this._chartStore.pricePrecision(), volume: this._chartStore.volumePrecision() }
      this._shapeDataSources = this.createShapeDataSource({
        step: this._drawStep,
        mode: this._mode,
        points: this._points,
        coordinates: this._coordinates,
        viewport: { width: this._xAxis.width(), height: this._yAxis.height() },
        precision: { price: this._chartStore.pricePrecision(), volume: this._chartStore.volumePrecision() },
        styles: shapeOptions,
        xAxis: this._xAxis,
        yAxis: this._yAxis,
        data: this._data
      }) || []
      this._shapeDataSources.forEach(({ type, isDraw, styles, dataSource = [] }) => {
        if (isDraw) {
          switch (type) {
            case ShapeElementType.LINE: {
              this._drawLines(ctx, dataSource, styles || shapeOptions.line, shapeOptions.line)
              break
            }
            case ShapeElementType.CONTINUOUS_LINE: {
              this._drawContinuousLines(ctx, dataSource, styles || shapeOptions.line, shapeOptions.line)
              break
            }
            case ShapeElementType.POLYGON: {
              this._drawPolygons(ctx, dataSource, styles || shapeOptions.polygon, shapeOptions.polygon)
              break
            }
            case ShapeElementType.ARC: {
              this._drawArcs(ctx, dataSource, styles || shapeOptions.arc, shapeOptions.arc)
              break
            }
            case ShapeElementType.TEXT: {
              this._drawText(ctx, dataSource, styles || shapeOptions.text, shapeOptions.text)
              break
            }
            default: { break }
          }
        }
      })
      if (this.drawExtend) {
        ctx.save()
        this.drawExtend({
          ctx,
          dataSource: this._shapeDataSources,
          styles: shapeOptions,
          viewport,
          precision,
          mode: this._mode,
          xAxis: this._xAxis,
          yAxis: this._yAxis,
          data: this._data
        })
        ctx.restore()
      }
    }
    const shapeEventOperate = this._chartStore.shapeStore().eventOperate()
    if (
      (shapeEventOperate.hover.id === this._id && shapeEventOperate.hover.element !== ShapeEventOperateElement.NONE) ||
      (shapeEventOperate.click.id === this._id && shapeEventOperate.click.element !== ShapeEventOperateElement.NONE) ||
      this.isDrawing()
    ) {
      this._coordinates.forEach(({ x, y }, index) => {
        let radius = shapeOptions.point.radius
        let color = shapeOptions.point.backgroundColor
        let borderColor = shapeOptions.point.borderColor
        let borderSize = shapeOptions.point.borderSize
        if (
          shapeEventOperate.hover.id === this._id &&
          shapeEventOperate.hover.element === ShapeEventOperateElement.POINT &&
          index === shapeEventOperate.hover.elementIndex
        ) {
          radius = shapeOptions.point.activeRadius
          color = shapeOptions.point.activeBackgroundColor
          borderColor = shapeOptions.point.activeBorderColor
          borderSize = shapeOptions.point.activeBorderSize
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
   * 获取模式类型
   * @returns
   */
  mode () {
    return this._mode
  }

  /**
   * 设置模式
   * @param mode
   */
  setMode (mode) {
    if (Object.values(ShapeMode).indexOf(mode) > -1) {
      this._mode = mode
    }
  }

  /**
   * 设置数据
   * @param data
   */
  setData (data) {
    if (data !== undefined && data !== this._data) {
      this._data = data
      return true
    }
    return false
  }

  /**
   * 获取数据
   * @returns
   */
  data () {
    return this._data
  }

  /**
   * 是否在绘制中
   * @return {boolean}
   */
  isDrawing () {
    return this._drawStep !== SHAPE_DRAW_STEP_FINISHED
  }

  /**
   * 是否开始
   * @returns
   */
  isStart () {
    return this._drawStep === SHAPE_DRAW_STEP_START
  }

  /**
   * 检查事件点是否在图形上
   * @param eventCoordinate
   * @return {{id: *, elementIndex: number, element: string}}
   */
  checkEventCoordinateOn (eventCoordinate) {
    const shapeOptions = this._styles || this._chartStore.styleOptions().shape
    // 检查鼠标点是否在图形的点上
    const start = this._coordinates.length - 1
    for (let i = start; i > -1; i--) {
      if (checkCoordinateInCircle(this._coordinates[i], shapeOptions.point.radius, eventCoordinate)) {
        return {
          id: this._id,
          element: ShapeEventOperateElement.POINT,
          elementIndex: i,
          instance: this
        }
      }
    }
    // 检查鼠标点是否在点构成的其它图形上
    if (this._shapeDataSources) {
      for (const { key, type, isCheck, dataSource = [] } of this._shapeDataSources) {
        if (isCheck) {
          for (let i = 0; i < dataSource.length; i++) {
            const sources = dataSource[i]
            if (this.checkEventCoordinateOnShape({ key, type, dataSource: sources, eventCoordinate })) {
              return {
                id: this._id,
                element: ShapeEventOperateElement.OTHER,
                elementIndex: i,
                instance: this
              }
            }
          }
        }
      }
    }
  }

  /**
   * 不同的模式下处理值
   * @param value
   * @param dataIndex
   * @param paneId
   */
  _performValue (y, dataIndex, paneId) {
    const value = this._yAxis.convertFromPixel(y)
    if (this._mode === ShapeMode.NORMAL || paneId !== 'candle_pane') {
      return value
    }
    const kLineData = this._chartStore.timeScaleStore().getDataByDataIndex(dataIndex)
    if (!kLineData) {
      return value
    }
    if (value > kLineData.high) {
      if (this._mode === ShapeMode.WEAK_MAGNET) {
        const highY = this._yAxis.convertToPixel(kLineData.high)
        const buffValue = this._yAxis.convertFromPixel(highY - 8)
        if (value < buffValue) {
          return kLineData.high
        }
        return value
      }
      return kLineData.high
    }
    if (value < kLineData.low) {
      if (this._mode === ShapeMode.WEAK_MAGNET) {
        const lowY = this._yAxis.convertToPixel(kLineData.low)
        const buffValue = this._yAxis.convertFromPixel(lowY - 8)
        if (value > buffValue) {
          return kLineData.low
        }
        return value
      }
      return kLineData.low
    }
    const max = Math.max(kLineData.open, kLineData.close)
    if (value > max) {
      if (value - max < kLineData.high - value) {
        return max
      }
      return kLineData.high
    }
    const min = Math.min(kLineData.open, kLineData.close)
    if (value < min) {
      if (value - kLineData.low < min - value) {
        return kLineData.low
      }
      return min
    }
    if (max - value < value - min) {
      return max
    }
    return min
  }

  /**
   * 绘制过程中鼠标移动事件
   * @param coordinate
   * @param event
   */
  mouseMoveForDrawing (coordinate, event) {
    const dataIndex = this._xAxis.convertFromPixel(coordinate.x)
    const timestamp = this._chartStore.timeScaleStore().dataIndexToTimestamp(dataIndex)
    const value = this._performValue(coordinate.y, dataIndex, event.paneId)
    this._points[this._drawStep - 1] = { timestamp, value, dataIndex }
    this.performEventMoveForDrawing({
      step: this._drawStep,
      mode: this._mode,
      points: this._points,
      movePoint: { timestamp, value, dataIndex },
      xAxis: this._xAxis,
      yAxis: this._yAxis
    })
    this.onDrawing({ id: this._id, step: this._drawStep, points: this._points })
  }

  /**
   * 鼠标左边按钮点击事件
   */
  mouseLeftButtonDownForDrawing () {
    if (this._drawStep === this._totalStep - 1) {
      this._drawStep = SHAPE_DRAW_STEP_FINISHED
      this._chartStore.shapeStore().progressInstanceComplete()
      this.onDrawEnd({ id: this._id, points: this._points })
    } else {
      this._drawStep++
    }
  }

  /**
   * 鼠标按住移动方法
   * @param coordinate
   * @param event
   */
  mousePressedPointMove (coordinate, event) {
    const shapeEventOperate = this._chartStore.shapeStore().eventOperate()
    const elementIndex = shapeEventOperate.click.elementIndex
    if (
      !this._lock &&
      shapeEventOperate.click.id === this._id &&
      shapeEventOperate.click.element === ShapeEventOperateElement.POINT &&
      elementIndex !== -1
    ) {
      const dataIndex = this._xAxis.convertFromPixel(coordinate.x)
      const timestamp = this._chartStore.timeScaleStore().dataIndexToTimestamp(dataIndex)
      const value = this._performValue(coordinate.y, dataIndex, event.paneId)
      this._points[elementIndex].timestamp = timestamp
      this._points[elementIndex].dataIndex = dataIndex
      this._points[elementIndex].value = value
      this.performEventPressedMove({
        points: this._points,
        mode: this._mode,
        pressPointIndex: elementIndex,
        pressPoint: { dataIndex, timestamp, value },
        xAxis: this._xAxis,
        yAxis: this._yAxis
      })
      this.onPressedMove({
        id: this._id,
        element: ShapeEventOperateElement.POINT,
        points: this._points,
        event
      })
    }
  }

  /**
   * 按住非点拖动开始事件
   * @param coordinate
   */
  startPressedOtherMove (coordinate) {
    const dataIndex = this._xAxis.convertFromPixel(coordinate.x)
    const value = this._yAxis.convertFromPixel(coordinate.y)
    this._prevPressPoint = { dataIndex, value }
    this._prevPoints = clone(this._points)
  }

  /**
   * 按住非点拖动时事件
   * @param coordinate
   */
  mousePressedOtherMove (coordinate, event) {
    if (!this._lock && this._prevPressPoint) {
      const dataIndex = this._xAxis.convertFromPixel(coordinate.x)
      const value = this._yAxis.convertFromPixel(coordinate.y)
      const difDataIndex = dataIndex - this._prevPressPoint.dataIndex
      const difValue = value - this._prevPressPoint.value
      this._points = this._prevPoints.map(point => {
        // 防止因为创建时传入进来的point没有dataIndex，导致无法计算时间戳问题
        if (!isValid(point.dataIndex)) {
          point.dataIndex = this._chartStore.timeScaleStore().timestampToDataIndex(point.timestamp)
        }
        const dataIndex = point.dataIndex + difDataIndex
        const value = point.value + difValue
        return {
          dataIndex,
          value,
          timestamp: this._chartStore.timeScaleStore().dataIndexToTimestamp(dataIndex)
        }
      })
      this.onPressedMove({
        id: this._id,
        element: ShapeEventOperateElement.OTHER,
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
   * 检查事件坐标是否在图形上
   * @param key
   * @param type
   * @param points
   * @param mousePoint
   */
  checkEventCoordinateOnShape ({ key, type, dataSource, eventCoordinate }) {}

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
  createShapeDataSource ({ step, mode, points, coordinates, viewport, precision, styles, xAxis, yAxis, data }) {}

  /**
   * 处理绘制过程中鼠标移动
   * @param step
   * @param mode
   * @param points
   * @param point
   * @param xAxis
   * @param yAxis
   */
  performEventMoveForDrawing ({ step, mode, points, movePoint, xAxis, yAxis }) {}

  /**
   * 处理鼠标按住移动
   * @param mode
   * @param points
   * @param pressPointIndex
   * @param point
   * @param xAxis
   * @param yAxis
   */
  performEventPressedMove ({ mode, points, pressPointIndex, pressPoint, xAxis, yAxis }) {}

  // --------------------- 自定义时需要实现的一些方法结束 ----------------------
}
