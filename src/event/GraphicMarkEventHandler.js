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

import {
  checkPointOnCircle, checkPointOnStraightLine,
  checkPointOnRayLine, checkPointOnSegmentLine,
  getParallelLines, getFibonacciLines
} from '../utils/graphic'
import { isFunction } from '../utils/typeChecks'
import { CANDLE_STICK_PANE_TAG } from '../pane/ChartPane'
import { GraphicMarkType } from '../data/ChartData'
import EventHandler from './EventHandler'

/**
 * 标记图形绘制步骤
 * @type {{STEP_3: *, STEP_DONE: *, STEP_1: *, STEP_2: *}}
 */
export const GraphicMarkDrawStep = {
  STEP_1: 'step_1',
  STEP_2: 'step_2',
  STEP_3: 'step_3',
  STEP_DONE: 'step_done'
}

export default class GraphicMarkEventHandler extends EventHandler {
  constructor (chartData, xAxis, yAxis) {
    super(chartData)
    this._xAxis = xAxis
    this._yAxis = yAxis
    // 标记当没有画线时鼠标是否按下
    this._noneGraphicMarkMouseDownFlag = false

    // 用来记录当没有绘制标记图形时，鼠标操作后落点线上的数据
    this._noneGraphicMarkMouseDownActiveData = {
      markKey: null,
      dataIndex: -1,
      onLine: false,
      onCircle: false,
      pointIndex: -1
    }
  }

  /**
   * 鼠标抬起事件
   * @param event
   */
  mouseUpEvent (event) {
    this._chartData.setDragGraphicMarkFlag(false)
    this._noneGraphicMarkMouseDownFlag = false
    this._noneGraphicMarkMouseDownActiveData = {
      markKey: null,
      dataIndex: -1,
      onLine: false,
      onCircle: false,
      pointIndex: -1
    }
  }

  /**
   * 鼠标按下事件
   * @param event
   */
  mouseDownEvent (event) {
    if (!this._checkEventPointX(event.localX) || !this._checkEventPointY(event.localY)) {
      return
    }
    const point = { x: event.localX, y: event.localY }
    this._chartData.setGraphicMarkPoint(point)
    const graphicMarkType = this._chartData.graphicMarkType()
    switch (graphicMarkType) {
      case GraphicMarkType.HORIZONTAL_STRAIGHT_LINE:
      case GraphicMarkType.VERTICAL_STRAIGHT_LINE:
      case GraphicMarkType.STRAIGHT_LINE:
      case GraphicMarkType.HORIZONTAL_RAY_LINE:
      case GraphicMarkType.VERTICAL_RAY_LINE:
      case GraphicMarkType.RAY_LINE:
      case GraphicMarkType.HORIZONTAL_SEGMENT_LINE:
      case GraphicMarkType.VERTICAL_SEGMENT_LINE:
      case GraphicMarkType.SEGMENT_LINE:
      case GraphicMarkType.PRICE_LINE:
      case GraphicMarkType.FIBONACCI_LINE: {
        this._twoStepGraphicMarkMouseDown(event, graphicMarkType)
        break
      }
      case GraphicMarkType.PRICE_CHANNEL_LINE:
      case GraphicMarkType.PARALLEL_STRAIGHT_LINE: {
        this._threeStepGraphicMarkMouseDown(event, graphicMarkType)
        break
      }
      case GraphicMarkType.NONE: {
        this._noneGraphicMarkMouseLeftDown(event)
        break
      }
    }
  }

  mouseRightDownEvent (event) {
    const graphicMarkType = this._chartData.graphicMarkType()
    if (graphicMarkType === GraphicMarkType.NONE) {
      this._findNoneGraphicMarkMouseDownActiveData(event)
      const markKey = this._noneGraphicMarkMouseDownActiveData.markKey
      const dataIndex = this._noneGraphicMarkMouseDownActiveData.dataIndex
      if (markKey && dataIndex !== -1) {
        const graphicMarkDatas = this._chartData.graphicMarkData()
        const graphicMarkData = graphicMarkDatas[markKey]
        graphicMarkData.splice(dataIndex, 1)
        graphicMarkDatas[markKey] = graphicMarkData
        this._chartData.setGraphicMarkData(graphicMarkDatas)
        this.mouseUpEvent(event)
      }
    }
  }

  /**
   * 两步形成的标记图形鼠标按下处理
   * @param event
   * @param markKey
   */
  _twoStepGraphicMarkMouseDown (event, markKey) {
    this._graphicMarkMouseDown(event, markKey, (lastLineData) => {
      switch (lastLineData.drawStep) {
        case GraphicMarkDrawStep.STEP_1: {
          lastLineData.drawStep = GraphicMarkDrawStep.STEP_2
          break
        }
        case GraphicMarkDrawStep.STEP_2: {
          lastLineData.drawStep = GraphicMarkDrawStep.STEP_DONE
          this._chartData.setGraphicMarkType(GraphicMarkType.NONE)
          break
        }
      }
    })
  }

  /**
   * 两个点形成的标记图形鼠标按下事件
   * @param event
   * @param markKey
   */
  _threeStepGraphicMarkMouseDown (event, markKey) {
    this._graphicMarkMouseDown(event, markKey, (lastLineData) => {
      switch (lastLineData.drawStep) {
        case GraphicMarkDrawStep.STEP_1: {
          lastLineData.drawStep = GraphicMarkDrawStep.STEP_2
          break
        }
        case GraphicMarkDrawStep.STEP_2: {
          lastLineData.drawStep = GraphicMarkDrawStep.STEP_3
          break
        }
        case GraphicMarkDrawStep.STEP_3: {
          lastLineData.drawStep = GraphicMarkDrawStep.STEP_DONE
          this._chartData.setGraphicMarkType(GraphicMarkType.NONE)
          break
        }
      }
    })
  }

  /**
   * 绘制标记图形时鼠标按下事件
   * @param event
   * @param markKey
   * @param performDifPoint
   */
  _graphicMarkMouseDown (event, markKey, performDifPoint) {
    const graphicMarkDatas = this._chartData.graphicMarkData()
    const graphicMarkData = graphicMarkDatas[markKey]
    if (event.button === 2) {
      graphicMarkData.splice(graphicMarkData.length - 1, 1)
      this._chartData.setGraphicMarkType(GraphicMarkType.NONE)
    } else {
      const lastLineData = graphicMarkData[graphicMarkData.length - 1]
      performDifPoint(lastLineData)
      graphicMarkData[graphicMarkData.length - 1] = lastLineData
    }
    graphicMarkDatas[markKey] = graphicMarkData
    this._chartData.setGraphicMarkData(graphicMarkDatas)
  }

  /**
   * 没有绘制时鼠标按下事件
   */
  _noneGraphicMarkMouseLeftDown (event) {
    this._findNoneGraphicMarkMouseDownActiveData(event)
    const markKey = this._noneGraphicMarkMouseDownActiveData.markKey
    const dataIndex = this._noneGraphicMarkMouseDownActiveData.dataIndex
    if (markKey && dataIndex !== -1) {
      if (this._noneGraphicMarkMouseDownActiveData.onCircle) {
        this._noneGraphicMarkMouseDownFlag = true
        this._chartData.setDragGraphicMarkFlag(true)
      }
    }
  }

  /**
   * 查找没有绘制时鼠标按下时在哪条数据上
   * @param event
   */
  _findNoneGraphicMarkMouseDownActiveData (event) {
    const point = { x: event.localX, y: event.localY }
    const keys = Object.keys(this._chartData.graphicMarkData())
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      switch (key) {
        case GraphicMarkType.HORIZONTAL_STRAIGHT_LINE:
        case GraphicMarkType.PRICE_LINE: {
          if (this._realFindNoneGraphicMarkMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnStraightLine(
              xyPoints[0], { x: this._chartContentSize.contentRight, y: xyPoints[0].y }, point
            )
          })) {
            return
          }
          break
        }
        case GraphicMarkType.VERTICAL_STRAIGHT_LINE: {
          if (this._realFindNoneGraphicMarkMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnStraightLine(
              xyPoints[0], { x: xyPoints[0].x, y: this._paneContentSize[CANDLE_STICK_PANE_TAG].contentBottom }, point
            )
          })) {
            return
          }
          break
        }
        case GraphicMarkType.STRAIGHT_LINE: {
          if (this._realFindNoneGraphicMarkMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnStraightLine(xyPoints[0], xyPoints[1], point)
          })) {
            return
          }
          break
        }
        case GraphicMarkType.HORIZONTAL_RAY_LINE:
        case GraphicMarkType.VERTICAL_RAY_LINE:
        case GraphicMarkType.RAY_LINE: {
          if (this._realFindNoneGraphicMarkMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnRayLine(xyPoints[0], xyPoints[1], point)
          })) {
            return
          }
          break
        }
        case GraphicMarkType.HORIZONTAL_SEGMENT_LINE:
        case GraphicMarkType.VERTICAL_SEGMENT_LINE:
        case GraphicMarkType.SEGMENT_LINE: {
          if (this._realFindNoneGraphicMarkMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnSegmentLine(xyPoints[0], xyPoints[1], point)
          })) {
            return
          }
          break
        }
        case GraphicMarkType.PRICE_CHANNEL_LINE:
        case GraphicMarkType.PARALLEL_STRAIGHT_LINE:
        case GraphicMarkType.FIBONACCI_LINE: {
          if (this._realFindNoneGraphicMarkMouseDownActiveData(key, point, (xyPoints) => {
            let linePoints
            const size = {
              width: this._chartContentSize.contentRight,
              height: this._paneContentSize[CANDLE_STICK_PANE_TAG].contentBottom - this._paneContentSize[CANDLE_STICK_PANE_TAG].contentTop
            }
            switch (key) {
              case GraphicMarkType.PRICE_CHANNEL_LINE: {
                linePoints = getParallelLines(xyPoints, size, true)
                break
              }
              case GraphicMarkType.PARALLEL_STRAIGHT_LINE: {
                linePoints = getParallelLines(xyPoints, size)
                break
              }
              case GraphicMarkType.FIBONACCI_LINE: {
                linePoints = getFibonacciLines(xyPoints, size)
                break
              }
            }
            let isOnGraphicMark = false
            if (linePoints) {
              for (let i = 0; i < linePoints.length; i++) {
                const points = linePoints[i]
                isOnGraphicMark = checkPointOnStraightLine(points[0], points[1], point)
                if (isOnGraphicMark) {
                  return isOnGraphicMark
                }
              }
            }
            return isOnGraphicMark
          })) {
            return
          }
          break
        }
      }
    }
  }

  /**
   * 查找没有绘制图时鼠标按下时落点在哪条数据上
   * @param markKey
   * @param point
   * @param checkPointOnLine
   * @returns {boolean}
   */
  _realFindNoneGraphicMarkMouseDownActiveData (markKey, point, checkPointOnLine) {
    const graphicMarkDatas = this._chartData.graphicMarkData()
    const graphicMarkData = graphicMarkDatas[markKey]
    const graphicMark = this._chartData.styleOptions().graphicMark
    graphicMarkData.forEach((data, index) => {
      const points = data.points
      const xyPoints = []
      let isOnCircle = false
      let pointIndex = -1
      points.forEach((p, i) => {
        const x = this._xAxis.convertToPixel(p.xPos)
        const y = this._yAxis.convertToPixel(p.price)
        xyPoints.push({ x, y })
        const isOn = checkPointOnCircle({ x, y }, graphicMark.point.radius, point)
        if (isOn) {
          pointIndex = i
        }
        if (!isOnCircle) {
          isOnCircle = isOn
        }
      })
      const isOnLine = checkPointOnLine(xyPoints, point)
      if (isOnLine || isOnCircle) {
        this._noneGraphicMarkMouseDownActiveData = {
          markKey: markKey,
          dataIndex: index,
          onLine: isOnLine,
          onCircle: isOnCircle,
          pointIndex
        }
        return true
      }
    })
    return false
  }

  /**
   * 鼠标移动事件
   */
  mouseMoveEvent (event) {
    if (!this._checkEventPointX(event.localX) || !this._checkEventPointY(event.localY)) {
      return
    }
    const point = { x: event.localX, y: event.localY }
    this._chartData.setGraphicMarkPoint(point)
    if (!this._waitingForMouseMoveAnimationFrame) {
      this._waitingForMouseMoveAnimationFrame = true
      const graphicMarkType = this._chartData.graphicMarkType()
      switch (graphicMarkType) {
        case GraphicMarkType.HORIZONTAL_STRAIGHT_LINE:
        case GraphicMarkType.VERTICAL_STRAIGHT_LINE:
        case GraphicMarkType.PRICE_LINE: {
          this._onePointGraphicMarkMouseMove(point, graphicMarkType)
          break
        }
        case GraphicMarkType.STRAIGHT_LINE:
        case GraphicMarkType.RAY_LINE:
        case GraphicMarkType.SEGMENT_LINE:
        case GraphicMarkType.FIBONACCI_LINE: {
          this._twoPointGraphicMarkMouseMove(point, graphicMarkType)
          break
        }
        case GraphicMarkType.HORIZONTAL_RAY_LINE:
        case GraphicMarkType.HORIZONTAL_SEGMENT_LINE: {
          this._twoPointGraphicMarkMouseMove(point, graphicMarkType, (lastLineData, { price }) => {
            lastLineData.points[0].price = price
          })
          break
        }
        case GraphicMarkType.VERTICAL_RAY_LINE:
        case GraphicMarkType.VERTICAL_SEGMENT_LINE: {
          this._twoPointGraphicMarkMouseMove(point, graphicMarkType, (lastLineData, { xPos }) => {
            lastLineData.points[0].xPos = xPos
          })
          break
        }
        case GraphicMarkType.PRICE_CHANNEL_LINE:
        case GraphicMarkType.PARALLEL_STRAIGHT_LINE: {
          this._threePointGraphicMarkMouseMove(point, graphicMarkType)
          break
        }
        case GraphicMarkType.NONE: {
          this._chartData.setGraphicMarkData(this._chartData.graphicMarkData())
          break
        }
      }
      this._waitingForMouseMoveAnimationFrame = false
    }
  }

  pressedMouseMoveEvent (event) {
    const markKey = this._noneGraphicMarkMouseDownActiveData.markKey
    const dataIndex = this._noneGraphicMarkMouseDownActiveData.dataIndex
    if (markKey && dataIndex !== -1) {
      const graphicMarkDatas = this._chartData.graphicMarkData()
      const graphicMarkData = graphicMarkDatas[markKey]
      const point = { x: event.localX, y: event.localY }
      switch (markKey) {
        case GraphicMarkType.HORIZONTAL_STRAIGHT_LINE:
        case GraphicMarkType.VERTICAL_STRAIGHT_LINE:
        case GraphicMarkType.PRICE_LINE:
        case GraphicMarkType.STRAIGHT_LINE:
        case GraphicMarkType.RAY_LINE:
        case GraphicMarkType.SEGMENT_LINE:
        case GraphicMarkType.PRICE_CHANNEL_LINE:
        case GraphicMarkType.PARALLEL_STRAIGHT_LINE:
        case GraphicMarkType.FIBONACCI_LINE: {
          const pointIndex = this._noneGraphicMarkMouseDownActiveData.pointIndex
          if (pointIndex !== -1) {
            graphicMarkData[dataIndex].points[pointIndex].xPos = this._xAxis.convertFromPixel(point.x)
            graphicMarkData[dataIndex].points[pointIndex].price = this._yAxis.convertFromPixel(point.y)
          }
          break
        }
        case GraphicMarkType.HORIZONTAL_RAY_LINE:
        case GraphicMarkType.HORIZONTAL_SEGMENT_LINE: {
          const pointIndex = this._noneGraphicMarkMouseDownActiveData.pointIndex
          if (pointIndex !== -1) {
            const price = this._yAxis.convertFromPixel(point.y)
            graphicMarkData[dataIndex].points[pointIndex].xPos = this._xAxis.convertFromPixel(point.x)
            graphicMarkData[dataIndex].points[0].price = price
            graphicMarkData[dataIndex].points[1].price = price
          }
          break
        }
        case GraphicMarkType.VERTICAL_RAY_LINE:
        case GraphicMarkType.VERTICAL_SEGMENT_LINE: {
          const pointIndex = this._noneGraphicMarkMouseDownActiveData.pointIndex
          if (pointIndex !== -1) {
            const xPos = this._xAxis.convertFromPixel(point.x)
            graphicMarkData[dataIndex].points[0].xPos = xPos
            graphicMarkData[dataIndex].points[1].xPos = xPos
            graphicMarkData[dataIndex].points[pointIndex].price = this._yAxis.convertFromPixel(point.y)
          }
          break
        }
      }
      graphicMarkDatas[markKey] = graphicMarkData
      this._chartData.setGraphicMarkPoint({ x: event.localX, y: event.localY })
      this._chartData.setGraphicMarkData(graphicMarkDatas)
    }
  }

  /**
   * 一个点形成的图形鼠标移动事件
   * @param point
   * @param markKey
   */
  _onePointGraphicMarkMouseMove (point, markKey) {
    this._graphicMarkMouseMove(point, markKey, (graphicMarkData, lastLineData) => {
      const xPos = this._xAxis.convertFromPixel(point.x)
      const price = this._yAxis.convertFromPixel(point.y)
      switch (lastLineData.drawStep) {
        case GraphicMarkDrawStep.STEP_DONE: {
          graphicMarkData.push({ points: [{ xPos, price }], drawStep: GraphicMarkDrawStep.STEP_1 })
          break
        }
        case GraphicMarkDrawStep.STEP_1:
        case GraphicMarkDrawStep.STEP_2: {
          lastLineData.points[0].xPos = xPos
          lastLineData.points[0].price = price
          graphicMarkData[graphicMarkData.length - 1] = lastLineData
          break
        }
      }
    })
  }

  /**
   * 两个点形成的线鼠标移动事件
   * @param point
   * @param markKey
   * @param stepTwo
   */
  _twoPointGraphicMarkMouseMove (point, markKey, stepTwo) {
    this._graphicMarkMouseMove(point, markKey, (graphicMarkData, lastLineData) => {
      const xPos = this._xAxis.convertFromPixel(point.x)
      const price = this._yAxis.convertFromPixel(point.y)
      switch (lastLineData.drawStep) {
        case GraphicMarkDrawStep.STEP_DONE: {
          graphicMarkData.push({ points: [{ xPos, price }, { xPos, price }], drawStep: GraphicMarkDrawStep.STEP_1 })
          break
        }
        case GraphicMarkDrawStep.STEP_1: {
          lastLineData.points[0] = { xPos, price }
          lastLineData.points[1] = { xPos, price }
          graphicMarkData[graphicMarkData.length - 1] = lastLineData
          break
        }
        case GraphicMarkDrawStep.STEP_2: {
          lastLineData.points[1] = { xPos, price }
          if (isFunction(stepTwo)) {
            stepTwo(lastLineData, { xPos, price })
          }
          graphicMarkData[graphicMarkData.length - 1] = lastLineData
          break
        }
      }
    })
  }

  /**
   * 三步形成的标记图形鼠标移动事件
   * @param point
   * @param markKey
   * @param stepTwo
   */
  _threePointGraphicMarkMouseMove (point, markKey, stepTwo) {
    this._graphicMarkMouseMove(point, markKey, (graphicMarkData, lastLineData) => {
      const xPos = this._xAxis.convertFromPixel(point.x)
      const price = this._yAxis.convertFromPixel(point.y)
      switch (lastLineData.drawStep) {
        case GraphicMarkDrawStep.STEP_DONE: {
          graphicMarkData.push({ points: [{ xPos, price }, { xPos, price }], drawStep: GraphicMarkDrawStep.STEP_1 })
          break
        }
        case GraphicMarkDrawStep.STEP_1: {
          lastLineData.points[0] = { xPos, price }
          lastLineData.points[1] = { xPos, price }
          graphicMarkData[graphicMarkData.length - 1] = lastLineData
          break
        }
        case GraphicMarkDrawStep.STEP_2: {
          if (isFunction(stepTwo)) {
            stepTwo(lastLineData, { xPos, price })
          }
          lastLineData.points[1] = { xPos, price }
          graphicMarkData[graphicMarkData.length - 1] = lastLineData
          break
        }
        case GraphicMarkDrawStep.STEP_3: {
          lastLineData.points[2] = { xPos, price }
          graphicMarkData[graphicMarkData.length - 1] = lastLineData
          break
        }
      }
    })
  }

  /**
   * 绘制标记图形时鼠标移动事件
   * @param point
   * @param markKey
   * @param performDifPoint
   */
  _graphicMarkMouseMove (point, markKey, performDifPoint) {
    const graphicMarkDatas = this._chartData.graphicMarkData()
    const graphicMarkData = graphicMarkDatas[markKey]
    const lastLineData = graphicMarkData[graphicMarkData.length - 1] || { drawStep: GraphicMarkDrawStep.STEP_DONE }
    performDifPoint(graphicMarkData, lastLineData)
    graphicMarkDatas[markKey] = graphicMarkData
    this._chartData.setGraphicMarkData(graphicMarkDatas)
  }

  _checkEventPointY (y) {
    const size = this._paneContentSize[CANDLE_STICK_PANE_TAG]
    return y > size.contentTop && y < size.contentBottom
  }
}
