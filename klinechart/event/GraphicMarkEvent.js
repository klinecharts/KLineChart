import { getCanvasPoint, isValidEvent } from './eventHelper'
import {
  checkPointOnCircle, checkPointOnStraightLine,
  checkPointOnRayLine, checkPointOnSegmentLine,
  getParallelLines, getFibonacciLines
} from '../utils/graphicMark'
import { isFunction } from '../utils/data'
import { GraphicMarkDrawStep, GraphicMarkType } from '../internal/constants'

class GraphicMarkEvent {
  constructor (storage, graphicMarkChart, style) {
    this.storage = storage
    this.graphicMarkChart = graphicMarkChart
    this.handler = graphicMarkChart.handler
    this.yRender = graphicMarkChart.graphicMarkRender.yRender
    this.style = style
    // 标记当没有画线时鼠标是否按下
    this.noneMarkerMouseDownFlag = false

    // 用来记录当没有绘制标记图形时，鼠标操作后落点线上的数据
    this.noneMarkerMouseDownActiveData = {
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
    this.noneMarkerMouseDownFlag = false
    this.noneMarkerMouseDownActiveData = {
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
    this.storage.markerPoint = { ...point }
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
        this.twoStepMarkerMouseDown(e, graphicMarkType)
        break
      }
      case GraphicMarkType.PRICE_CHANNEL_LINE:
      case GraphicMarkType.PARALLEL_STRAIGHT_LINE: {
        this.threeStepMarkerMouseDown(e, graphicMarkType)
        break
      }
      case GraphicMarkType.NONE: {
        this.noneMarkerMouseDown(e)
        break
      }
    }
  }

  /**
   * 两步形成的标记图形鼠标按下处理
   * @param e
   * @param markKey
   */
  twoStepMarkerMouseDown (e, markKey) {
    this.markerMouseDown(e, markKey, (lastLineData) => {
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
  threeStepMarkerMouseDown (e, markKey) {
    this.markerMouseDown(e, markKey, (lastLineData) => {
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
  markerMouseDown (e, markKey, performDifPoint) {
    const markerData = this.storage.markerDatas[markKey]
    if (e.button === 2) {
      markerData.splice(markerData.length - 1, 1)
      this.storage.graphicMarkType = GraphicMarkType.NONE
    } else {
      const lastLineData = markerData[markerData.length - 1]
      performDifPoint(lastLineData)
      markerData[markerData.length - 1] = lastLineData
    }
    this.storage.markerDatas[markKey] = markerData
    this.graphicMarkChart.flush()
  }

  /**
   * 没有绘制时鼠标按下事件
   */
  noneMarkerMouseDown (e) {
    this.findNoneMarkerMouseDownActiveData(e)
    const markKey = this.noneMarkerMouseDownActiveData.markKey
    const dataIndex = this.noneMarkerMouseDownActiveData.dataIndex
    if (markKey && dataIndex !== -1) {
      if (e.button === 2) {
        // 鼠标右键
        const markerData = this.storage.markerDatas[markKey]
        markerData.splice(dataIndex, 1)
        this.storage.markerDatas[markKey] = markerData
        this.graphicMarkChart.flush()
      } else {
        if (this.noneMarkerMouseDownActiveData.onCircle) {
          this.noneMarkerMouseDownFlag = true
          this.storage.isDragMarker = true
        }
      }
    }
  }

  /**
   * 查找没有绘制时鼠标按下时在哪条数据上
   * @param e
   */
  findNoneMarkerMouseDownActiveData (e) {
    const point = getCanvasPoint(e, this.graphicMarkChart.canvasDom)
    const keys = Object.keys(this.storage.markerDatas)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      switch (key) {
        case GraphicMarkType.HORIZONTAL_STRAIGHT_LINE:
        case GraphicMarkType.PRICE_LINE: {
          if (this.realFindNoneMarkerMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnStraightLine(
              xyPoints[0], { x: this.handler.contentRight(), y: xyPoints[0].y }, point
            )
          })) {
            return
          }
          break
        }
        case GraphicMarkType.VERTICAL_STRAIGHT_LINE: {
          if (this.realFindNoneMarkerMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnStraightLine(
              xyPoints[0], { x: xyPoints[0].x, y: this.handler.contentBottom() }, point
            )
          })) {
            return
          }
          break
        }
        case GraphicMarkType.STRAIGHT_LINE: {
          if (this.realFindNoneMarkerMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnStraightLine(xyPoints[0], xyPoints[1], point)
          })) {
            return
          }
          break
        }
        case GraphicMarkType.HORIZONTAL_RAY_LINE:
        case GraphicMarkType.VERTICAL_RAY_LINE:
        case GraphicMarkType.RAY_LINE: {
          if (this.realFindNoneMarkerMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnRayLine(xyPoints[0], xyPoints[1], point)
          })) {
            return
          }
          break
        }
        case GraphicMarkType.HORIZONTAL_SEGMENT_LINE:
        case GraphicMarkType.VERTICAL_SEGMENT_LINE:
        case GraphicMarkType.SEGMENT_LINE: {
          if (this.realFindNoneMarkerMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnSegmentLine(xyPoints[0], xyPoints[1], point)
          })) {
            return
          }
          break
        }
        case GraphicMarkType.PRICE_CHANNEL_LINE:
        case GraphicMarkType.PARALLEL_STRAIGHT_LINE:
        case GraphicMarkType.FIBONACCI_LINE: {
          if (this.realFindNoneMarkerMouseDownActiveData(key, point, (xyPoints) => {
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
            let isOnMarker = false
            for (let i = 0; i < linePoints.length; i++) {
              const points = linePoints[i]
              isOnMarker = checkPointOnStraightLine(points[0], points[1], point)
              if (isOnMarker) {
                return isOnMarker
              }
            }
            return isOnMarker
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
  realFindNoneMarkerMouseDownActiveData (markKey, point, checkPointOnLine) {
    const markerData = this.storage.markerDatas[markKey]
    markerData.forEach((data, index) => {
      const points = data.points
      const xyPoints = []
      let isOnCircle = false
      let pointIndex = -1
      points.forEach((p, i) => {
        const x = (p.xPos - this.storage.minPos) * this.storage.dataSpace
        const y = this.yRender.getY(p.price)
        xyPoints.push({ x, y })
        const isOn = checkPointOnCircle({ x, y }, this.style.marker.point.radius, point)
        if (isOn) {
          pointIndex = i
        }
        if (!isOnCircle) {
          isOnCircle = isOn
        }
      })
      const isOnLine = checkPointOnLine(xyPoints, point)
      if (isOnLine || isOnCircle) {
        this.noneMarkerMouseDownActiveData = {
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
    this.storage.markerPoint = { ...point }
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
          this.onePointMarkerMouseMove(point, graphicMarkType)
          break
        }
        case GraphicMarkType.STRAIGHT_LINE:
        case GraphicMarkType.RAY_LINE:
        case GraphicMarkType.SEGMENT_LINE:
        case GraphicMarkType.FIBONACCI_LINE: {
          this.twoPointMarkerMouseMove(point, graphicMarkType)
          break
        }
        case GraphicMarkType.HORIZONTAL_RAY_LINE:
        case GraphicMarkType.HORIZONTAL_SEGMENT_LINE: {
          this.twoPointMarkerMouseMove(point, graphicMarkType, (lastLineData, { price }) => {
            lastLineData.points[0].price = price
          })
          break
        }
        case GraphicMarkType.VERTICAL_RAY_LINE:
        case GraphicMarkType.VERTICAL_SEGMENT_LINE: {
          this.twoPointMarkerMouseMove(point, graphicMarkType, (lastLineData, { xPos }) => {
            lastLineData.points[0].xPos = xPos
          })
          break
        }
        case GraphicMarkType.PRICE_CHANNEL_LINE:
        case GraphicMarkType.PARALLEL_STRAIGHT_LINE: {
          this.threePointMarkerMouseMove(point, graphicMarkType)
          break
        }
        case GraphicMarkType.NONE: {
          this.noneMarkerMouseMove(point)
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
  onePointMarkerMouseMove (point, markKey) {
    this.markerMouseMove(point, markKey, (markerData, lastLineData) => {
      const xPos = this.storage.minPos + (point.x - this.handler.contentLeft()) / this.storage.dataSpace
      const price = this.yRender.getValue(point.y)
      switch (lastLineData.drawStep) {
        case GraphicMarkDrawStep.STEP_DONE: {
          markerData.push({ points: [{ xPos, price }], drawStep: GraphicMarkDrawStep.STEP_1 })
          break
        }
        case GraphicMarkDrawStep.STEP_1:
        case GraphicMarkDrawStep.STEP_2: {
          lastLineData.points[0].xPos = xPos
          lastLineData.points[0].price = price
          markerData[markerData.length - 1] = lastLineData
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
  twoPointMarkerMouseMove (point, markKey, stepTwo) {
    this.markerMouseMove(point, markKey, (markerData, lastLineData) => {
      const xPos = this.storage.minPos + (point.x - this.handler.contentLeft()) / this.storage.dataSpace
      const price = this.yRender.getValue(point.y)
      switch (lastLineData.drawStep) {
        case GraphicMarkDrawStep.STEP_DONE: {
          markerData.push({ points: [{ xPos, price }, { xPos, price }], drawStep: GraphicMarkDrawStep.STEP_1 })
          break
        }
        case GraphicMarkDrawStep.STEP_1: {
          lastLineData.points[0] = { xPos, price }
          lastLineData.points[1] = { xPos, price }
          markerData[markerData.length - 1] = lastLineData
          break
        }
        case GraphicMarkDrawStep.STEP_2: {
          lastLineData.points[1] = { xPos, price }
          if (isFunction(stepTwo)) {
            stepTwo(lastLineData, { xPos, price })
          }
          markerData[markerData.length - 1] = lastLineData
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
  threePointMarkerMouseMove (point, markKey, stepTwo) {
    this.markerMouseMove(point, markKey, (markerData, lastLineData) => {
      const xPos = this.storage.minPos + (point.x - this.handler.contentLeft()) / this.storage.dataSpace
      const price = this.yRender.getValue(point.y)
      switch (lastLineData.drawStep) {
        case GraphicMarkDrawStep.STEP_DONE: {
          markerData.push({ points: [{ xPos, price }, { xPos, price }], drawStep: GraphicMarkDrawStep.STEP_1 })
          break
        }
        case GraphicMarkDrawStep.STEP_1: {
          lastLineData.points[0] = { xPos, price }
          lastLineData.points[1] = { xPos, price }
          markerData[markerData.length - 1] = lastLineData
          break
        }
        case GraphicMarkDrawStep.STEP_2: {
          if (isFunction(stepTwo)) {
            stepTwo(lastLineData, { xPos, price })
          }
          lastLineData.points[1] = { xPos, price }
          markerData[markerData.length - 1] = lastLineData
          break
        }
        case GraphicMarkDrawStep.STEP_3: {
          lastLineData.points[2] = { xPos, price }
          markerData[markerData.length - 1] = lastLineData
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
  markerMouseMove (point, markKey, performDifPoint) {
    const markerData = this.storage.markerDatas[markKey]
    const lastLineData = markerData[markerData.length - 1] || { drawStep: GraphicMarkDrawStep.STEP_DONE }
    performDifPoint(markerData, lastLineData)
    this.storage.markerDatas[markKey] = markerData
    this.graphicMarkChart.flush()
  }

  /**
   * 没有绘制标记时鼠标移动事件
   * @param point
   */
  noneMarkerMouseMove (point) {
    if (this.noneMarkerMouseDownFlag) {
      const markKey = this.noneMarkerMouseDownActiveData.markKey
      const dataIndex = this.noneMarkerMouseDownActiveData.dataIndex
      if (markKey && dataIndex !== -1) {
        const markerData = this.storage.markerDatas[markKey]
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
            const pointIndex = this.noneMarkerMouseDownActiveData.pointIndex
            if (pointIndex !== -1) {
              markerData[dataIndex].points[pointIndex].xPos = (point.x - this.handler.contentLeft()) / this.storage.dataSpace + this.storage.minPos
              markerData[dataIndex].points[pointIndex].price = this.yRender.getValue(point.y)
            }
            break
          }
          case GraphicMarkType.HORIZONTAL_RAY_LINE:
          case GraphicMarkType.HORIZONTAL_SEGMENT_LINE: {
            const pointIndex = this.noneMarkerMouseDownActiveData.pointIndex
            if (pointIndex !== -1) {
              const price = this.yRender.getValue(point.y)
              markerData[dataIndex].points[pointIndex].xPos = (point.x - this.handler.contentLeft()) / this.storage.dataSpace + this.storage.minPos
              markerData[dataIndex].points[0].price = price
              markerData[dataIndex].points[1].price = price
            }
            break
          }
          case GraphicMarkType.VERTICAL_RAY_LINE:
          case GraphicMarkType.VERTICAL_SEGMENT_LINE: {
            const pointIndex = this.noneMarkerMouseDownActiveData.pointIndex
            if (pointIndex !== -1) {
              const xPos = (point.x - this.handler.contentLeft()) / this.storage.dataSpace + this.storage.minPos
              markerData[dataIndex].points[0].xPos = xPos
              markerData[dataIndex].points[1].xPos = xPos
              markerData[dataIndex].points[pointIndex].price = this.yRender.getValue(point.y)
            }
            break
          }
        }
        this.storage.markerDatas[markKey] = markerData
      }
    }
    this.graphicMarkChart.flush()
  }
}

export default GraphicMarkEvent
