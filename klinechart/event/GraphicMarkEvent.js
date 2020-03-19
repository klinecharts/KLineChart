import { getCanvasPoint, isValidEvent } from './eventHelper'
import {
  checkPointOnCircle, checkPointOnStraightLine,
  checkPointOnRayLine, checkPointOnSegmentLine,
  getParallelLines, getFibonacciLines
} from '../utils/graphic'
import { isFunction } from '../utils/typeChecks'
import { GraphicMarkDrawStep, GraphicMarkType } from '../internal/constants'

class GraphicMarkEvent {
  constructor (storage, graphicMarkChart, style) {
    this.storage = storage
    this.graphicMarkChart = graphicMarkChart
    this.handler = graphicMarkChart.handler
    this.yRender = graphicMarkChart.graphicMarkRender.yRender
    this.style = style
    // 标记当没有画线时鼠标是否按下
    this.noneGraphicMarkMouseDownFlag = false

    // 用来记录当没有绘制标记图形时，鼠标操作后落点线上的数据
    this.noneGraphicMarkMouseDownActiveData = {
      markKey: null,
      dataIndex: -1,
      onLine: false,
      onCircle: false,
      pointIndex: -1
    }
  }

  /**
   * 鼠标抬起事件
   */
  mouseUp () {
    this.noneGraphicMarkMouseDownFlag = false
    this.noneGraphicMarkMouseDownActiveData = {
      markKey: null,
      dataIndex: -1,
      onLine: false,
      onCircle: false,
      pointIndex: -1
    }
  }

  /**
   * 鼠标按下事件
   * @param e
   */
  mouseDown (e) {
    const point = getCanvasPoint(e, this.graphicMarkChart.canvasDom)
    this.storage.graphicMarkPoint = { ...point }
    if (!isValidEvent(point, this.handler)) {
      return
    }
    const graphicMarkType = this.storage.graphicMarkType
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
        this.twoStepGraphicMarkMouseDown(e, graphicMarkType)
        break
      }
      case GraphicMarkType.PRICE_CHANNEL_LINE:
      case GraphicMarkType.PARALLEL_STRAIGHT_LINE: {
        this.threeStepGraphicMarkMouseDown(e, graphicMarkType)
        break
      }
      case GraphicMarkType.NONE: {
        this.noneGraphicMarkMouseDown(e)
        break
      }
    }
  }

  /**
   * 两步形成的标记图形鼠标按下处理
   * @param e
   * @param markKey
   */
  twoStepGraphicMarkMouseDown (e, markKey) {
    this.graphicMarkMouseDown(e, markKey, (lastLineData) => {
      switch (lastLineData.drawStep) {
        case GraphicMarkDrawStep.STEP_1: {
          lastLineData.drawStep = GraphicMarkDrawStep.STEP_2
          break
        }
        case GraphicMarkDrawStep.STEP_2: {
          lastLineData.drawStep = GraphicMarkDrawStep.STEP_DONE
          this.storage.graphicMarkType = GraphicMarkType.NONE
          break
        }
      }
    })
  }

  /**
   * 两个点形成的标记图形鼠标按下事件
   * @param e
   * @param markKey
   */
  threeStepGraphicMarkMouseDown (e, markKey) {
    this.graphicMarkMouseDown(e, markKey, (lastLineData) => {
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
          this.storage.graphicMarkType = GraphicMarkType.NONE
          break
        }
      }
    })
  }

  /**
   * 绘制标记图形时鼠标按下事件
   * @param e
   * @param markKey
   * @param performDifPoint
   */
  graphicMarkMouseDown (e, markKey, performDifPoint) {
    const graphicMarkData = this.storage.graphicMarkDatas[markKey]
    if (e.button === 2) {
      graphicMarkData.splice(graphicMarkData.length - 1, 1)
      this.storage.graphicMarkType = GraphicMarkType.NONE
    } else {
      const lastLineData = graphicMarkData[graphicMarkData.length - 1]
      performDifPoint(lastLineData)
      graphicMarkData[graphicMarkData.length - 1] = lastLineData
    }
    this.storage.graphicMarkDatas[markKey] = graphicMarkData
    this.graphicMarkChart.flush()
  }

  /**
   * 没有绘制时鼠标按下事件
   */
  noneGraphicMarkMouseDown (e) {
    this.findNoneGraphicMarkMouseDownActiveData(e)
    const markKey = this.noneGraphicMarkMouseDownActiveData.markKey
    const dataIndex = this.noneGraphicMarkMouseDownActiveData.dataIndex
    if (markKey && dataIndex !== -1) {
      if (e.button === 2) {
        // 鼠标右键
        const graphicMarkData = this.storage.graphicMarkDatas[markKey]
        graphicMarkData.splice(dataIndex, 1)
        this.storage.graphicMarkDatas[markKey] = graphicMarkData
        this.graphicMarkChart.flush()
      } else {
        if (this.noneGraphicMarkMouseDownActiveData.onCircle) {
          this.noneGraphicMarkMouseDownFlag = true
          this.storage.isDragGraphicMark = true
        }
      }
    }
  }

  /**
   * 查找没有绘制时鼠标按下时在哪条数据上
   * @param e
   */
  findNoneGraphicMarkMouseDownActiveData (e) {
    const point = getCanvasPoint(e, this.graphicMarkChart.canvasDom)
    const keys = Object.keys(this.storage.graphicMarkDatas)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      switch (key) {
        case GraphicMarkType.HORIZONTAL_STRAIGHT_LINE:
        case GraphicMarkType.PRICE_LINE: {
          if (this.realFindNoneGraphicMarkMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnStraightLine(
              xyPoints[0], { x: this.handler.contentRight(), y: xyPoints[0].y }, point
            )
          })) {
            return
          }
          break
        }
        case GraphicMarkType.VERTICAL_STRAIGHT_LINE: {
          if (this.realFindNoneGraphicMarkMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnStraightLine(
              xyPoints[0], { x: xyPoints[0].x, y: this.handler.contentBottom() }, point
            )
          })) {
            return
          }
          break
        }
        case GraphicMarkType.STRAIGHT_LINE: {
          if (this.realFindNoneGraphicMarkMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnStraightLine(xyPoints[0], xyPoints[1], point)
          })) {
            return
          }
          break
        }
        case GraphicMarkType.HORIZONTAL_RAY_LINE:
        case GraphicMarkType.VERTICAL_RAY_LINE:
        case GraphicMarkType.RAY_LINE: {
          if (this.realFindNoneGraphicMarkMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnRayLine(xyPoints[0], xyPoints[1], point)
          })) {
            return
          }
          break
        }
        case GraphicMarkType.HORIZONTAL_SEGMENT_LINE:
        case GraphicMarkType.VERTICAL_SEGMENT_LINE:
        case GraphicMarkType.SEGMENT_LINE: {
          if (this.realFindNoneGraphicMarkMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnSegmentLine(xyPoints[0], xyPoints[1], point)
          })) {
            return
          }
          break
        }
        case GraphicMarkType.PRICE_CHANNEL_LINE:
        case GraphicMarkType.PARALLEL_STRAIGHT_LINE:
        case GraphicMarkType.FIBONACCI_LINE: {
          if (this.realFindNoneGraphicMarkMouseDownActiveData(key, point, (xyPoints) => {
            let linePoints = []
            switch (key) {
              case GraphicMarkType.PRICE_CHANNEL_LINE: {
                linePoints = getParallelLines(xyPoints, this.handler, true)
                break
              }
              case GraphicMarkType.PARALLEL_STRAIGHT_LINE: {
                linePoints = getParallelLines(xyPoints, this.handler)
                break
              }
              case GraphicMarkType.FIBONACCI_LINE: {
                linePoints = getFibonacciLines(xyPoints, this.handler)
                break
              }
            }
            let isOnGraphicMark = false
            for (let i = 0; i < linePoints.length; i++) {
              const points = linePoints[i]
              isOnGraphicMark = checkPointOnStraightLine(points[0], points[1], point)
              if (isOnGraphicMark) {
                return isOnGraphicMark
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
  realFindNoneGraphicMarkMouseDownActiveData (markKey, point, checkPointOnLine) {
    const graphicMarkData = this.storage.graphicMarkDatas[markKey]
    graphicMarkData.forEach((data, index) => {
      const points = data.points
      const xyPoints = []
      let isOnCircle = false
      let pointIndex = -1
      points.forEach((p, i) => {
        const x = (p.xPos - this.storage.minPos) * this.storage.dataSpace
        const y = this.yRender.getY(p.price)
        xyPoints.push({ x, y })
        const isOn = checkPointOnCircle({ x, y }, this.style.graphicMark.point.radius, point)
        if (isOn) {
          pointIndex = i
        }
        if (!isOnCircle) {
          isOnCircle = isOn
        }
      })
      const isOnLine = checkPointOnLine(xyPoints, point)
      if (isOnLine || isOnCircle) {
        this.noneGraphicMarkMouseDownActiveData = {
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
  mouseMove (e) {
    const point = getCanvasPoint(e, this.graphicMarkChart.canvasDom)
    this.storage.graphicMarkPoint = { ...point }
    if (!isValidEvent(point, this.handler)) {
      return
    }
    if (!this.waitingForMouseMoveAnimationFrame) {
      this.waitingForMouseMoveAnimationFrame = true
      const graphicMarkType = this.storage.graphicMarkType
      switch (graphicMarkType) {
        case GraphicMarkType.HORIZONTAL_STRAIGHT_LINE:
        case GraphicMarkType.VERTICAL_STRAIGHT_LINE:
        case GraphicMarkType.PRICE_LINE: {
          this.onePointGraphicMarkMouseMove(point, graphicMarkType)
          break
        }
        case GraphicMarkType.STRAIGHT_LINE:
        case GraphicMarkType.RAY_LINE:
        case GraphicMarkType.SEGMENT_LINE:
        case GraphicMarkType.FIBONACCI_LINE: {
          this.twoPointGraphicMarkMouseMove(point, graphicMarkType)
          break
        }
        case GraphicMarkType.HORIZONTAL_RAY_LINE:
        case GraphicMarkType.HORIZONTAL_SEGMENT_LINE: {
          this.twoPointGraphicMarkMouseMove(point, graphicMarkType, (lastLineData, { price }) => {
            lastLineData.points[0].price = price
          })
          break
        }
        case GraphicMarkType.VERTICAL_RAY_LINE:
        case GraphicMarkType.VERTICAL_SEGMENT_LINE: {
          this.twoPointGraphicMarkMouseMove(point, graphicMarkType, (lastLineData, { xPos }) => {
            lastLineData.points[0].xPos = xPos
          })
          break
        }
        case GraphicMarkType.PRICE_CHANNEL_LINE:
        case GraphicMarkType.PARALLEL_STRAIGHT_LINE: {
          this.threePointGraphicMarkMouseMove(point, graphicMarkType)
          break
        }
        case GraphicMarkType.NONE: {
          this.noneGraphicMarkMouseMove(point)
          break
        }
      }
      this.waitingForMouseMoveAnimationFrame = false
    }
  }

  /**
   * 一个点形成的图形鼠标移动事件
   * @param point
   * @param markKey
   */
  onePointGraphicMarkMouseMove (point, markKey) {
    this.graphicMarkMouseMove(point, markKey, (graphicMarkData, lastLineData) => {
      const xPos = this.storage.minPos + (point.x - this.handler.contentLeft()) / this.storage.dataSpace
      const price = this.yRender.getValue(point.y)
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
  twoPointGraphicMarkMouseMove (point, markKey, stepTwo) {
    this.graphicMarkMouseMove(point, markKey, (graphicMarkData, lastLineData) => {
      const xPos = this.storage.minPos + (point.x - this.handler.contentLeft()) / this.storage.dataSpace
      const price = this.yRender.getValue(point.y)
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
  threePointGraphicMarkMouseMove (point, markKey, stepTwo) {
    this.graphicMarkMouseMove(point, markKey, (graphicMarkData, lastLineData) => {
      const xPos = this.storage.minPos + (point.x - this.handler.contentLeft()) / this.storage.dataSpace
      const price = this.yRender.getValue(point.y)
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
  graphicMarkMouseMove (point, markKey, performDifPoint) {
    const graphicMarkData = this.storage.graphicMarkDatas[markKey]
    const lastLineData = graphicMarkData[graphicMarkData.length - 1] || { drawStep: GraphicMarkDrawStep.STEP_DONE }
    performDifPoint(graphicMarkData, lastLineData)
    this.storage.graphicMarkDatas[markKey] = graphicMarkData
    this.graphicMarkChart.flush()
  }

  /**
   * 没有绘制标记时鼠标移动事件
   * @param point
   */
  noneGraphicMarkMouseMove (point) {
    if (this.noneGraphicMarkMouseDownFlag) {
      const markKey = this.noneGraphicMarkMouseDownActiveData.markKey
      const dataIndex = this.noneGraphicMarkMouseDownActiveData.dataIndex
      if (markKey && dataIndex !== -1) {
        const graphicMarkData = this.storage.graphicMarkDatas[markKey]
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
            const pointIndex = this.noneGraphicMarkMouseDownActiveData.pointIndex
            if (pointIndex !== -1) {
              graphicMarkData[dataIndex].points[pointIndex].xPos = (point.x - this.handler.contentLeft()) / this.storage.dataSpace + this.storage.minPos
              graphicMarkData[dataIndex].points[pointIndex].price = this.yRender.getValue(point.y)
            }
            break
          }
          case GraphicMarkType.HORIZONTAL_RAY_LINE:
          case GraphicMarkType.HORIZONTAL_SEGMENT_LINE: {
            const pointIndex = this.noneGraphicMarkMouseDownActiveData.pointIndex
            if (pointIndex !== -1) {
              const price = this.yRender.getValue(point.y)
              graphicMarkData[dataIndex].points[pointIndex].xPos = (point.x - this.handler.contentLeft()) / this.storage.dataSpace + this.storage.minPos
              graphicMarkData[dataIndex].points[0].price = price
              graphicMarkData[dataIndex].points[1].price = price
            }
            break
          }
          case GraphicMarkType.VERTICAL_RAY_LINE:
          case GraphicMarkType.VERTICAL_SEGMENT_LINE: {
            const pointIndex = this.noneGraphicMarkMouseDownActiveData.pointIndex
            if (pointIndex !== -1) {
              const xPos = (point.x - this.handler.contentLeft()) / this.storage.dataSpace + this.storage.minPos
              graphicMarkData[dataIndex].points[0].xPos = xPos
              graphicMarkData[dataIndex].points[1].xPos = xPos
              graphicMarkData[dataIndex].points[pointIndex].price = this.yRender.getValue(point.y)
            }
            break
          }
        }
        this.storage.graphicMarkDatas[markKey] = graphicMarkData
      }
    }
    this.graphicMarkChart.flush()
  }
}

export default GraphicMarkEvent
