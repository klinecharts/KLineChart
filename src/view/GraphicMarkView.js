import View from './View'
import {
  checkPointOnCircle,
  checkPointOnRayLine,
  checkPointOnSegmentLine,
  checkPointOnStraightLine, getFibonacciLines,
  getLinearY,
  getParallelLines
} from '../utils/graphic'

import { GraphicMarkType } from '../data/ChartData'
import { GraphicMarkDrawStep } from '../event/GraphicMarkEventHandler'
import { formatPrecision } from '../utils/format'
import { drawHorizontalLine, drawVerticalLine, getFont, strokeInPixel } from '../utils/canvas'

const LineType = {
  COMMON: 0,
  HORIZONTAL: 1,
  VERTICAL: 2
}

export default class GraphicMarkView extends View {
  constructor (container, chartData, xAxis, yAxis) {
    super(container, chartData)
    this._xAxis = xAxis
    this._yAxis = yAxis
  }

  _draw () {
    const graphicMark = this._chartData.styleOptions().graphicMark
    const pricePrecision = this._chartData.precisionOptions().price
    // 画线
    this._drawHorizontalStraightLine(graphicMark)
    this._drawVerticalStraightLine(graphicMark)
    this._drawStraightLine(graphicMark)
    this._drawHorizontalRayLine(graphicMark)
    this._drawVerticalRayLine(graphicMark)
    this._drawRayLine(graphicMark)
    this._drawSegmentLine(graphicMark)
    this._drawPriceLine(graphicMark, pricePrecision)
    this._drawPriceChannelLine(graphicMark)
    this._drawParallelStraightLine(graphicMark)
    this._drawFibonacciLine(graphicMark, pricePrecision)
  }

  /**
   * 渲染水平直线
   * @param graphicMark
   */
  _drawHorizontalStraightLine (graphicMark) {
    this._drawPointGraphicMark(
      GraphicMarkType.HORIZONTAL_STRAIGHT_LINE, graphicMark, checkPointOnStraightLine,
      (points) => {
        return [[
          {
            x: 0,
            y: points[0].y
          }, {
            x: this._width,
            y: points[0].y
          }
        ]]
      }
    )
  }

  /**
   * 渲染垂直直线
   * @param graphicMark
   */
  _drawVerticalStraightLine (graphicMark) {
    this._drawPointGraphicMark(
      GraphicMarkType.VERTICAL_STRAIGHT_LINE, graphicMark, checkPointOnStraightLine,
      (points) => {
        return [[
          {
            x: points[0].x,
            y: 0
          }, {
            x: points[0].x,
            y: this._height
          }
        ]]
      }
    )
  }

  /**
   * 渲染直线
   * @param graphicMark
   */
  _drawStraightLine (graphicMark) {
    this._drawPointGraphicMark(
      GraphicMarkType.STRAIGHT_LINE, graphicMark, checkPointOnStraightLine,
      (points) => {
        if (points[0].x === points[1].x) {
          return [[
            {
              x: points[0].x,
              y: 0
            }, {
              x: points[0].x,
              y: this._height
            }
          ]]
        }
        const y = getLinearY(
          points[0], points[1],
          [
            {
              x: 0,
              y: points[0].y
            }, {
              x: this._width,
              y: points[0].y
            }
          ]
        )
        return [[
          {
            x: 0,
            y: y[0]
          }, {
            x: this._width,
            y: y[1]
          }
        ]]
      }
    )
  }

  /**
   * 绘制水平射线
   * @param graphicMark
   */
  _drawHorizontalRayLine (graphicMark) {
    this._drawPointGraphicMark(
      GraphicMarkType.HORIZONTAL_RAY_LINE, graphicMark, checkPointOnRayLine,
      (points) => {
        const point = { x: 0, y: points[0].y }
        if (points[0].x < points[1].x) {
          point.x = this._width
        }
        return [[points[0], point]]
      }
    )
  }

  /**
   * 绘制垂直射线
   * @param graphicMark
   */
  _drawVerticalRayLine (graphicMark) {
    this._drawPointGraphicMark(
      GraphicMarkType.VERTICAL_RAY_LINE, graphicMark, checkPointOnRayLine,
      (points) => {
        const point = { x: points[0].x, y: 0 }
        if (points[0].y < points[1].y) {
          point.y = this._height
        }
        return [[points[0], point]]
      }
    )
  }

  /**
   * 渲染射线
   * @param graphicMark
   */
  _drawRayLine (graphicMark) {
    this._drawPointGraphicMark(
      GraphicMarkType.RAY_LINE, graphicMark, checkPointOnRayLine,
      (points) => {
        let point
        if (points[0].x === points[1].x && points[0].y !== points[1].y) {
          if (points[0].y < points[1].y) {
            point = {
              x: points[0].x,
              y: this._height
            }
          } else {
            point = {
              x: points[0].x,
              y: 0
            }
          }
        } else if (points[0].x > points[1].x) {
          point = {
            x: 0,
            y: getLinearY(points[0], points[1], [{ x: 0, y: points[0].y }])[0]
          }
        } else {
          point = {
            x: this._width,
            y: getLinearY(points[0], points[1], [{ x: this._width, y: points[0].y }])[0]
          }
        }
        return [[points[0], point]]
      }
    )
  }

  /**
   * 绘制线段，水平线段，垂直线段，普通线段一起绘制
   * @param graphicMark
   */
  _drawSegmentLine (graphicMark) {
    this._drawPointGraphicMark(
      GraphicMarkType.HORIZONTAL_SEGMENT_LINE, graphicMark, checkPointOnSegmentLine
    )
    this._drawPointGraphicMark(
      GraphicMarkType.VERTICAL_SEGMENT_LINE, graphicMark, checkPointOnSegmentLine
    )
    this._drawPointGraphicMark(
      GraphicMarkType.SEGMENT_LINE, graphicMark, checkPointOnSegmentLine
    )
  }

  /**
   * 绘制价格线
   * @param graphicMark
   * @param pricePrecision
   */
  _drawPriceLine (graphicMark, pricePrecision) {
    this._drawPointGraphicMark(
      GraphicMarkType.PRICE_LINE, graphicMark, checkPointOnRayLine,
      (points) => {
        return [[points[0], { x: this._width, y: points[0].y }]]
      },
      true, pricePrecision
    )
  }

  /**
   * 渲染价格通道线
   * @param graphicMark
   */
  _drawPriceChannelLine (graphicMark) {
    this._drawPointGraphicMark(
      GraphicMarkType.PRICE_CHANNEL_LINE, graphicMark, checkPointOnStraightLine,
      (points) => {
        return getParallelLines(points, { width: this._width, height: this._height }, true)
      }
    )
  }

  /**
   * 渲染平行直线
   * @param graphicMark
   */
  _drawParallelStraightLine (graphicMark) {
    this._drawPointGraphicMark(
      GraphicMarkType.PARALLEL_STRAIGHT_LINE, graphicMark, checkPointOnStraightLine,
      (points) => {
        return getParallelLines(points, { width: this._width, height: this._height })
      }
    )
  }

  /**
   * 渲染斐波那契线
   * @param graphicMark
   * @param pricePrecision
   */
  _drawFibonacciLine (graphicMark, pricePrecision) {
    this._drawPointGraphicMark(
      GraphicMarkType.FIBONACCI_LINE, graphicMark, checkPointOnStraightLine,
      (points) => {
        return getFibonacciLines(points, { width: this._width, height: this._height })
      }, true, pricePrecision, ['(100.0%)', '(78.6%)', '(61.8%)', '(50.0%)', '(38.2%)', '(23.6%)', '(0.0%)']
    )
  }

  /**
   * 渲染点形成的图形
   * @param markKey
   * @param graphicMark
   * @param checkPointOnLine
   * @param generatedLinePoints
   * @param isDrawPrice
   * @param pricePrecision
   * @param priceExtendsText
   */
  _drawPointGraphicMark (markKey, graphicMark, checkPointOnLine, generatedLinePoints, isDrawPrice, pricePrecision, priceExtendsText) {
    const graphicMarkDatas = this._chartData.graphicMarkData()
    const graphicMarkData = graphicMarkDatas[markKey]
    graphicMarkData.forEach(({ points, drawStep }) => {
      const circlePoints = []
      points.forEach(({ xPos, price }) => {
        const x = this._xAxis.convertToPixel(xPos)
        const y = this._yAxis.convertToPixel(price)
        circlePoints.push({ x, y })
      })
      const linePoints = generatedLinePoints ? generatedLinePoints(circlePoints) : [circlePoints]
      this._drawGraphicMark(
        graphicMark, linePoints, circlePoints, drawStep,
        checkPointOnLine,
        isDrawPrice, pricePrecision, priceExtendsText
      )
    })
  }

  /**
   * 绘制标记图形
   * @param graphicMark
   * @param linePoints
   * @param circlePoints
   * @param drawStep
   * @param checkPointOnLine
   * @param isDrawPrice
   * @param pricePrecision
   * @param priceExtendsText
   */
  _drawGraphicMark (
    graphicMark, linePoints, circlePoints, drawStep, checkPointOnLine,
    isDrawPrice, pricePrecision, priceExtendsText = []
  ) {
    const graphicMarkPoint = this._chartData.graphicMarkPoint()
    let isOnLine = false
    linePoints.forEach((points, i) => {
      if (points.length > 1) {
        const isOn = checkPointOnLine(points[0], points[1], graphicMarkPoint)
        if (!isOnLine) {
          isOnLine = isOn
        }
        if (drawStep !== GraphicMarkDrawStep.STEP_1) {
          this._ctx.strokeStyle = graphicMark.line.color
          this._ctx.lineWidth = graphicMark.line.size
          const lineType = this._getLineType(points[0], points[1])
          switch (lineType) {
            case LineType.COMMON: {
              strokeInPixel(this._ctx, () => {
                this._ctx.beginPath()
                this._ctx.moveTo(points[0].x, points[0].y)
                this._ctx.lineTo(points[1].x, points[1].y)
                this._ctx.stroke()
                this._ctx.closePath()
              })
              break
            }
            case LineType.HORIZONTAL: {
              drawHorizontalLine(this._ctx, points[0].y, points[0].x, points[1].x)
              break
            }
            case LineType.VERTICAL: {
              drawVerticalLine(this._ctx, points[0].x, points[0].y, points[1].y)
              break
            }
            default: { break }
          }
          // 渲染价格
          if (isDrawPrice) {
            const price = this._yAxis.convertFromPixel(points[0].y)
            const priceText = formatPrecision(price, pricePrecision)
            const textSize = graphicMark.text.size
            this._ctx.font = getFont(textSize)
            this._ctx.fillStyle = graphicMark.text.color
            this._ctx.fillText(`${priceText} ${priceExtendsText[i] || ''}`, points[0].x + graphicMark.text.marginLeft, points[0].y - graphicMark.text.marginBottom)
          }
        }
      }
    })
    const radius = graphicMark.point.radius
    let isCircleActive = false
    for (let i = 0; i < circlePoints.length; i++) {
      isCircleActive = checkPointOnCircle(circlePoints[i], radius, graphicMarkPoint)
      if (isCircleActive) {
        break
      }
    }
    circlePoints.forEach(circlePoint => {
      const isOnCircle = checkPointOnCircle(circlePoint, radius, graphicMarkPoint)
      if (isCircleActive || isOnLine) {
        let circleRadius = radius
        let circleColor = graphicMark.point.backgroundColor
        let circleBorderColor = graphicMark.point.borderColor
        let circleBorderSize = graphicMark.point.borderSize
        if (isOnCircle) {
          circleRadius = graphicMark.point.activeRadius
          circleColor = graphicMark.point.activeBackgroundColor
          circleBorderColor = graphicMark.point.activeBorderColor
          circleBorderSize = graphicMark.point.activeBorderSize
        }
        this._ctx.fillStyle = circleColor
        this._ctx.beginPath()
        this._ctx.arc(circlePoint.x, circlePoint.y, circleRadius, 0, Math.PI * 2)
        this._ctx.closePath()
        this._ctx.fill()
        this._ctx.lineWidth = circleBorderSize
        this._ctx.strokeStyle = circleBorderColor
        this._ctx.beginPath()
        this._ctx.arc(circlePoint.x, circlePoint.y, circleRadius, 0, Math.PI * 2)
        this._ctx.closePath()
        this._ctx.stroke()
      }
    })
  }

  /**
   * 获取绘制线类型
   * @param point1
   * @param point2
   * @private
   */
  _getLineType (point1, point2) {
    if (point1.x === point2.x) {
      return LineType.VERTICAL
    }
    if (point1.y === point2.y) {
      return LineType.HORIZONTAL
    }
    return LineType.COMMON
  }
}
