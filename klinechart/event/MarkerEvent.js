import { getCanvasPoint, isValidEvent } from './eventHelper'
import {
  checkPointOnCircle, checkPointOnStraightLine,
  checkPointOnRayLine, checkPointOnSegmentLine,
  getParallelLines, getFibonacciLines
} from '../utils/markerMapUtils'
import { isFunction } from '../utils/dataUtils'
import { MarkerDrawStep, MarkerType } from '../internal/constants'

class MarkerEvent {
  constructor (dataProvider, markerChart, style) {
    this.dataProvider = dataProvider
    this.markerChart = markerChart
    this.viewPortHandler = markerChart.viewPortHandler
    this.yRender = markerChart.markerRender.yRender
    this.style = style
    // 标记当没有画线时鼠标是否按下
    this.noneMarkerMouseDownFlag = false

    // 用来记录当没有绘制标记图形时，鼠标操作后落点线上的数据
    this.noneMarkerMouseDownActiveData = {
      markerKey: null,
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
      markerKey: null,
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
    const point = getCanvasPoint(e, this.markerChart.canvasDom)
    this.dataProvider.markerPoint = { ...point }
    if (!isValidEvent(point, this.viewPortHandler)) {
      return
    }
    const markerType = this.dataProvider.currentMarkerType
    switch (markerType) {
      case MarkerType.HORIZONTAL_STRAIGHT_LINE:
      case MarkerType.VERTICAL_STRAIGHT_LINE:
      case MarkerType.STRAIGHT_LINE:
      case MarkerType.HORIZONTAL_RAY_LINE:
      case MarkerType.VERTICAL_RAY_LINE:
      case MarkerType.RAY_LINE:
      case MarkerType.HORIZONTAL_SEGMENT_LINE:
      case MarkerType.VERTICAL_SEGMENT_LINE:
      case MarkerType.SEGMENT_LINE:
      case MarkerType.PRICE_LINE:
      case MarkerType.FIBONACCI_LINE: {
        this.twoStepMarkerMouseDown(e, markerType)
        break
      }
      case MarkerType.PRICE_CHANNEL_LINE:
      case MarkerType.PARALLEL_STRAIGHT_LINE: {
        this.threeStepMarkerMouseDown(e, markerType)
        break
      }
      case MarkerType.NONE: {
        this.noneMarkerMouseDown(e)
        break
      }
    }
  }

  /**
   * 两步形成的标记图形鼠标按下处理
   * @param e
   * @param markerKey
   */
  twoStepMarkerMouseDown (e, markerKey) {
    this.markerMouseDown(e, markerKey, (lastLineData) => {
      switch (lastLineData.drawStep) {
        case MarkerDrawStep.STEP_1: {
          lastLineData.drawStep = MarkerDrawStep.STEP_2
          break
        }
        case MarkerDrawStep.STEP_2: {
          lastLineData.drawStep = MarkerDrawStep.STEP_DONE
          this.dataProvider.currentMarkerType = MarkerType.NONE
          break
        }
      }
    })
  }

  /**
   * 两个点形成的标记图形鼠标按下事件
   * @param e
   * @param markerKey
   */
  threeStepMarkerMouseDown (e, markerKey) {
    this.markerMouseDown(e, markerKey, (lastLineData) => {
      switch (lastLineData.drawStep) {
        case MarkerDrawStep.STEP_1: {
          lastLineData.drawStep = MarkerDrawStep.STEP_2
          break
        }
        case MarkerDrawStep.STEP_2: {
          lastLineData.drawStep = MarkerDrawStep.STEP_3
          break
        }
        case MarkerDrawStep.STEP_3: {
          lastLineData.drawStep = MarkerDrawStep.STEP_DONE
          this.dataProvider.currentMarkerType = MarkerType.NONE
          break
        }
      }
    })
  }

  /**
   * 绘制标记图形时鼠标按下事件
   * @param e
   * @param markerKey
   * @param performDifPoint
   */
  markerMouseDown (e, markerKey, performDifPoint) {
    const markerData = this.dataProvider.markerDatas[markerKey]
    if (e.button === 2) {
      markerData.splice(markerData.length - 1, 1)
      this.dataProvider.currentMarkerType = MarkerType.NONE
    } else {
      const lastLineData = markerData[markerData.length - 1]
      performDifPoint(lastLineData)
      markerData[markerData.length - 1] = lastLineData
    }
    this.dataProvider.markerDatas[markerKey] = markerData
    this.markerChart.flush()
  }

  /**
   * 没有绘制时鼠标按下事件
   */
  noneMarkerMouseDown (e) {
    this.findNoneMarkerMouseDownActiveData(e)
    const markerKey = this.noneMarkerMouseDownActiveData.markerKey
    const dataIndex = this.noneMarkerMouseDownActiveData.dataIndex
    if (markerKey && dataIndex !== -1) {
      if (e.button === 2) {
        // 鼠标右键
        const markerData = this.dataProvider.markerDatas[markerKey]
        markerData.splice(dataIndex, 1)
        this.dataProvider.markerDatas[markerKey] = markerData
        this.markerChart.flush()
      } else {
        if (this.noneMarkerMouseDownActiveData.onCircle) {
          this.noneMarkerMouseDownFlag = true
          this.dataProvider.isDragMarker = true
        }
      }
    }
  }

  /**
   * 查找没有绘制时鼠标按下时在哪条数据上
   * @param e
   */
  findNoneMarkerMouseDownActiveData (e) {
    const point = getCanvasPoint(e, this.markerChart.canvasDom)
    const keys = Object.keys(this.dataProvider.markerDatas)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      switch (key) {
        case MarkerType.HORIZONTAL_STRAIGHT_LINE:
        case MarkerType.PRICE_LINE: {
          if (this.realFindNoneMarkerMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnStraightLine(
              xyPoints[0], { x: this.viewPortHandler.contentRight(), y: xyPoints[0].y }, point
            )
          })) {
            return
          }
          break
        }
        case MarkerType.VERTICAL_STRAIGHT_LINE: {
          if (this.realFindNoneMarkerMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnStraightLine(
              xyPoints[0], { x: xyPoints[0].x, y: this.viewPortHandler.contentBottom() }, point
            )
          })) {
            return
          }
          break
        }
        case MarkerType.STRAIGHT_LINE: {
          if (this.realFindNoneMarkerMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnStraightLine(xyPoints[0], xyPoints[1], point)
          })) {
            return
          }
          break
        }
        case MarkerType.HORIZONTAL_RAY_LINE:
        case MarkerType.VERTICAL_RAY_LINE:
        case MarkerType.RAY_LINE: {
          if (this.realFindNoneMarkerMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnRayLine(xyPoints[0], xyPoints[1], point)
          })) {
            return
          }
          break
        }
        case MarkerType.HORIZONTAL_SEGMENT_LINE:
        case MarkerType.VERTICAL_SEGMENT_LINE:
        case MarkerType.SEGMENT_LINE: {
          if (this.realFindNoneMarkerMouseDownActiveData(key, point, (xyPoints) => {
            return checkPointOnSegmentLine(xyPoints[0], xyPoints[1], point)
          })) {
            return
          }
          break
        }
        case MarkerType.PRICE_CHANNEL_LINE:
        case MarkerType.PARALLEL_STRAIGHT_LINE:
        case MarkerType.FIBONACCI_LINE: {
          if (this.realFindNoneMarkerMouseDownActiveData(key, point, (xyPoints) => {
            let linePoints = []
            switch (key) {
              case MarkerType.PRICE_CHANNEL_LINE: {
                linePoints = getParallelLines(xyPoints, this.viewPortHandler, true)
                break
              }
              case MarkerType.PARALLEL_STRAIGHT_LINE: {
                linePoints = getParallelLines(xyPoints, this.viewPortHandler)
                break
              }
              case MarkerType.FIBONACCI_LINE: {
                linePoints = getFibonacciLines(xyPoints, this.viewPortHandler)
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
   * @param markerKey
   * @param point
   * @param checkPointOnLine
   * @returns {boolean}
   */
  realFindNoneMarkerMouseDownActiveData (markerKey, point, checkPointOnLine) {
    const markerData = this.dataProvider.markerDatas[markerKey]
    markerData.forEach((data, index) => {
      const points = data.points
      const xyPoints = []
      let isOnCircle = false
      let pointIndex = -1
      points.forEach((p, i) => {
        const x = (p.xPos - this.dataProvider.minPos) * this.dataProvider.dataSpace
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
          markerKey: markerKey,
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
    const point = getCanvasPoint(e, this.markerChart.canvasDom)
    this.dataProvider.markerPoint = { ...point }
    if (!isValidEvent(point, this.viewPortHandler)) {
      return
    }
    if (!this.waitingForMouseMoveAnimationFrame) {
      this.waitingForMouseMoveAnimationFrame = true
      const markerType = this.dataProvider.currentMarkerType
      switch (markerType) {
        case MarkerType.HORIZONTAL_STRAIGHT_LINE:
        case MarkerType.VERTICAL_STRAIGHT_LINE:
        case MarkerType.PRICE_LINE: {
          this.onePointMarkerMouseMove(point, markerType)
          break
        }
        case MarkerType.STRAIGHT_LINE:
        case MarkerType.RAY_LINE:
        case MarkerType.SEGMENT_LINE:
        case MarkerType.FIBONACCI_LINE: {
          this.twoPointMarkerMouseMove(point, markerType)
          break
        }
        case MarkerType.HORIZONTAL_RAY_LINE:
        case MarkerType.HORIZONTAL_SEGMENT_LINE: {
          this.twoPointMarkerMouseMove(point, markerType, (lastLineData, { price }) => {
            lastLineData.points[0].price = price
          })
          break
        }
        case MarkerType.VERTICAL_RAY_LINE:
        case MarkerType.VERTICAL_SEGMENT_LINE: {
          this.twoPointMarkerMouseMove(point, markerType, (lastLineData, { xPos }) => {
            lastLineData.points[0].xPos = xPos
          })
          break
        }
        case MarkerType.PRICE_CHANNEL_LINE:
        case MarkerType.PARALLEL_STRAIGHT_LINE: {
          this.threePointMarkerMouseMove(point, markerType)
          break
        }
        case MarkerType.NONE: {
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
   * @param markerKey
   */
  onePointMarkerMouseMove (point, markerKey) {
    this.markerMouseMove(point, markerKey, (markerData, lastLineData) => {
      const xPos = this.dataProvider.minPos + (point.x - this.viewPortHandler.contentLeft()) / this.dataProvider.dataSpace
      const price = this.yRender.getValue(point.y)
      switch (lastLineData.drawStep) {
        case MarkerDrawStep.STEP_DONE: {
          markerData.push({ points: [{ xPos, price }], drawStep: MarkerDrawStep.STEP_1 })
          break
        }
        case MarkerDrawStep.STEP_1:
        case MarkerDrawStep.STEP_2: {
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
   * @param markerKey
   * @param stepTwo
   */
  twoPointMarkerMouseMove (point, markerKey, stepTwo) {
    this.markerMouseMove(point, markerKey, (markerData, lastLineData) => {
      const xPos = this.dataProvider.minPos + (point.x - this.viewPortHandler.contentLeft()) / this.dataProvider.dataSpace
      const price = this.yRender.getValue(point.y)
      switch (lastLineData.drawStep) {
        case MarkerDrawStep.STEP_DONE: {
          markerData.push({ points: [{ xPos, price }, { xPos, price }], drawStep: MarkerDrawStep.STEP_1 })
          break
        }
        case MarkerDrawStep.STEP_1: {
          lastLineData.points[0] = { xPos, price }
          lastLineData.points[1] = { xPos, price }
          markerData[markerData.length - 1] = lastLineData
          break
        }
        case MarkerDrawStep.STEP_2: {
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
   * @param markerKey
   * @param stepTwo
   */
  threePointMarkerMouseMove (point, markerKey, stepTwo) {
    this.markerMouseMove(point, markerKey, (markerData, lastLineData) => {
      const xPos = this.dataProvider.minPos + (point.x - this.viewPortHandler.contentLeft()) / this.dataProvider.dataSpace
      const price = this.yRender.getValue(point.y)
      switch (lastLineData.drawStep) {
        case MarkerDrawStep.STEP_DONE: {
          markerData.push({ points: [{ xPos, price }, { xPos, price }], drawStep: MarkerDrawStep.STEP_1 })
          break
        }
        case MarkerDrawStep.STEP_1: {
          lastLineData.points[0] = { xPos, price }
          lastLineData.points[1] = { xPos, price }
          markerData[markerData.length - 1] = lastLineData
          break
        }
        case MarkerDrawStep.STEP_2: {
          if (isFunction(stepTwo)) {
            stepTwo(lastLineData, { xPos, price })
          }
          lastLineData.points[1] = { xPos, price }
          markerData[markerData.length - 1] = lastLineData
          break
        }
        case MarkerDrawStep.STEP_3: {
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
   * @param markerKey
   * @param performDifPoint
   */
  markerMouseMove (point, markerKey, performDifPoint) {
    const markerData = this.dataProvider.markerDatas[markerKey]
    const lastLineData = markerData[markerData.length - 1] || { drawStep: MarkerDrawStep.STEP_DONE }
    performDifPoint(markerData, lastLineData)
    this.dataProvider.markerDatas[markerKey] = markerData
    this.markerChart.flush()
  }

  /**
   * 没有绘制标记时鼠标移动事件
   * @param point
   */
  noneMarkerMouseMove (point) {
    if (this.noneMarkerMouseDownFlag) {
      const markerKey = this.noneMarkerMouseDownActiveData.markerKey
      const dataIndex = this.noneMarkerMouseDownActiveData.dataIndex
      if (markerKey && dataIndex !== -1) {
        const markerData = this.dataProvider.markerDatas[markerKey]
        switch (markerKey) {
          case MarkerType.HORIZONTAL_STRAIGHT_LINE:
          case MarkerType.VERTICAL_STRAIGHT_LINE:
          case MarkerType.PRICE_LINE:
          case MarkerType.STRAIGHT_LINE:
          case MarkerType.RAY_LINE:
          case MarkerType.SEGMENT_LINE:
          case MarkerType.PRICE_CHANNEL_LINE:
          case MarkerType.PARALLEL_STRAIGHT_LINE:
          case MarkerType.FIBONACCI_LINE: {
            const pointIndex = this.noneMarkerMouseDownActiveData.pointIndex
            if (pointIndex !== -1) {
              markerData[dataIndex].points[pointIndex].xPos = (point.x - this.viewPortHandler.contentLeft()) / this.dataProvider.dataSpace + this.dataProvider.minPos
              markerData[dataIndex].points[pointIndex].price = this.yRender.getValue(point.y)
            }
            break
          }
          case MarkerType.HORIZONTAL_RAY_LINE:
          case MarkerType.HORIZONTAL_SEGMENT_LINE: {
            const pointIndex = this.noneMarkerMouseDownActiveData.pointIndex
            if (pointIndex !== -1) {
              const price = this.yRender.getValue(point.y)
              markerData[dataIndex].points[pointIndex].xPos = (point.x - this.viewPortHandler.contentLeft()) / this.dataProvider.dataSpace + this.dataProvider.minPos
              markerData[dataIndex].points[0].price = price
              markerData[dataIndex].points[1].price = price
            }
            break
          }
          case MarkerType.VERTICAL_RAY_LINE:
          case MarkerType.VERTICAL_SEGMENT_LINE: {
            const pointIndex = this.noneMarkerMouseDownActiveData.pointIndex
            if (pointIndex !== -1) {
              const xPos = (point.x - this.viewPortHandler.contentLeft()) / this.dataProvider.dataSpace + this.dataProvider.minPos
              markerData[dataIndex].points[0].xPos = xPos
              markerData[dataIndex].points[1].xPos = xPos
              markerData[dataIndex].points[pointIndex].price = this.yRender.getValue(point.y)
            }
            break
          }
        }
        this.dataProvider.markerDatas[markerKey] = markerData
      }
    }
    this.markerChart.flush()
  }
}

export default MarkerEvent
