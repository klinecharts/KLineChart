import Render from './Render'
import {
  checkPointOnStraightLine,
  checkPointOnCircle,
  getLinearY,
  checkPointOnRayLine,
  checkPointOnSegmentLine,
  getParallelLines, getFibonacciLines
} from '../utils/graphicMark'
import { formatPrecision } from '../utils/number'
import { getFont } from '../utils/draw'
import { GraphicMarkType, GraphicMarkDrawStep } from '../internal/constants'

class GraphicMarkRender extends Render {
  constructor (viewPortHandler, storage, yRender, graphicMark) {
    super(viewPortHandler, storage)
    this.yRender = yRender
    this.graphicMark = graphicMark
  }

  /**
   * 渲染水平直线
   * @param ctx
   */
  renderHorizontalStraightLine (ctx) {
    this.renderPointMarker(
      ctx, GraphicMarkType.HORIZONTAL_STRAIGHT_LINE, checkPointOnStraightLine,
      (points) => {
        return [[
          {
            x: this.viewPortHandler.contentLeft(),
            y: points[0].y
          }, {
            x: this.viewPortHandler.contentRight(),
            y: points[0].y
          }
        ]]
      }
    )
  }

  /**
   * 渲染垂直直线
   * @param ctx
   */
  renderVerticalStraightLine (ctx) {
    this.renderPointMarker(
      ctx, GraphicMarkType.VERTICAL_STRAIGHT_LINE, checkPointOnStraightLine,
      (points) => {
        return [[
          {
            x: points[0].x,
            y: this.viewPortHandler.contentTop()
          }, {
            x: points[0].x,
            y: this.viewPortHandler.contentBottom()
          }
        ]]
      }
    )
  }

  /**
   * 渲染直线
   * @param ctx
   */
  renderStraightLine (ctx) {
    this.renderPointMarker(
      ctx, GraphicMarkType.STRAIGHT_LINE, checkPointOnStraightLine,
      (points) => {
        if (points[0].x === points[1].x) {
          return [[
            {
              x: points[0].x,
              y: this.viewPortHandler.contentTop()
            }, {
              x: points[0].x,
              y: this.viewPortHandler.bottom
            }
          ]]
        }
        const y = getLinearY(
          points[0], points[1],
          [
            {
              x: this.viewPortHandler.contentLeft(),
              y: points[0].y
            }, {
              x: this.viewPortHandler.contentRight(),
              y: points[0].y
            }
          ]
        )
        return [[
          {
            x: this.viewPortHandler.contentLeft(),
            y: y[0]
          }, {
            x: this.viewPortHandler.contentRight(),
            y: y[1]
          }
        ]]
      }
    )
  }

  /**
   * 绘制水平射线
   * @param ctx
   */
  renderHorizontalRayLine (ctx) {
    this.renderPointMarker(
      ctx, GraphicMarkType.HORIZONTAL_RAY_LINE, checkPointOnRayLine,
      (points) => {
        const point = { x: this.viewPortHandler.contentLeft(), y: points[0].y }
        if (points[0].x < points[1].x) {
          point.x = this.viewPortHandler.contentRight()
        }
        return [[points[0], point]]
      }
    )
  }

  /**
   * 绘制垂直射线
   * @param ctx
   */
  renderVerticalRayLine (ctx) {
    this.renderPointMarker(
      ctx, GraphicMarkType.VERTICAL_RAY_LINE, checkPointOnRayLine,
      (points) => {
        const point = { x: points[0].x, y: this.viewPortHandler.contentTop() }
        if (points[0].y < points[1].y) {
          point.y = this.viewPortHandler.contentBottom()
        }
        return [[points[0], point]]
      }
    )
  }

  /**
   * 渲染射线
   * @param ctx
   */
  renderRayLine (ctx) {
    this.renderPointMarker(
      ctx, GraphicMarkType.RAY_LINE, checkPointOnRayLine,
      (points) => {
        let point
        if (points[0].x === points[1].x && points[0].y !== points[1].y) {
          if (points[0].y < points[1].y) {
            point = {
              x: points[0].x,
              y: this.viewPortHandler.contentBottom()
            }
          } else {
            point = {
              x: points[0].x,
              y: this.viewPortHandler.contentTop()
            }
          }
        } else if (points[0].x > points[1].x) {
          point = {
            x: this.viewPortHandler.contentLeft(),
            y: getLinearY(points[0], points[1], [{ x: this.viewPortHandler.contentLeft(), y: points[0].y }])[0]
          }
        } else {
          point = {
            x: this.viewPortHandler.contentRight(),
            y: getLinearY(points[0], points[1], [{ x: this.viewPortHandler.contentRight(), y: points[0].y }])[0]
          }
        }
        return [[points[0], point]]
      }
    )
  }

  /**
   * 绘制线段，水平线段，垂直线段，普通线段一起绘制
   * @param ctx
   */
  renderSegmentLine (ctx) {
    this.renderPointMarker(
      ctx, GraphicMarkType.HORIZONTAL_SEGMENT_LINE, checkPointOnSegmentLine
    )
    this.renderPointMarker(
      ctx, GraphicMarkType.VERTICAL_SEGMENT_LINE, checkPointOnSegmentLine
    )
    this.renderPointMarker(
      ctx, GraphicMarkType.SEGMENT_LINE, checkPointOnSegmentLine
    )
  }

  /**
   * 绘制价格线
   * @param ctx
   * @param pricePrecision
   */
  renderPriceLine (ctx, pricePrecision) {
    this.renderPointMarker(
      ctx, GraphicMarkType.PRICE_LINE, checkPointOnRayLine,
      (points) => {
        return [[points[0], { x: this.viewPortHandler.contentRight(), y: points[0].y }]]
      },
      true, pricePrecision
    )
  }

  /**
   * 渲染价格通道线
   * @param ctx
   */
  renderPriceChannelLine (ctx) {
    this.renderPointMarker(
      ctx, GraphicMarkType.PRICE_CHANNEL_LINE, checkPointOnStraightLine,
      (points) => {
        return getParallelLines(points, this.viewPortHandler, true)
      }
    )
  }

  /**
   * 渲染平行直线
   * @param ctx
   */
  renderParallelStraightLine (ctx) {
    this.renderPointMarker(
      ctx, GraphicMarkType.PARALLEL_STRAIGHT_LINE, checkPointOnStraightLine,
      (points) => {
        return getParallelLines(points, this.viewPortHandler)
      }
    )
  }

  /**
   * 渲染斐波那契线
   * @param ctx
   * @param pricePrecision
   */
  renderFibonacciLine (ctx, pricePrecision) {
    this.renderPointMarker(
      ctx, GraphicMarkType.FIBONACCI_LINE, checkPointOnStraightLine,
      (points) => {
        return getFibonacciLines(points, this.viewPortHandler)
      }, true, pricePrecision, ['(100.0%)', '(78.6%)', '(61.8%)', '(50.0%)', '(38.2%)', '(23.6%)', '(0.0%)']
    )
  }

  /**
   * 渲染点形成的图形
   * @param ctx
   * @param markerKey
   * @param checkPointOnLine
   * @param generatedLinePoints
   * @param isRenderPrice
   * @param pricePrecision
   * @param priceExtendsText
   */
  renderPointMarker (ctx, markerKey, checkPointOnLine, generatedLinePoints, isRenderPrice, pricePrecision, priceExtendsText) {
    const markerData = this.storage.markerDatas[markerKey]
    markerData.forEach(({ points, drawStep }) => {
      const circlePoints = []
      points.forEach(({ xPos, price }) => {
        const x = (xPos - this.storage.minPos) * this.storage.dataSpace
        const y = this.yRender.getY(price)
        circlePoints.push({ x, y })
      })
      const linePoints = generatedLinePoints ? generatedLinePoints(circlePoints) : [circlePoints]
      this.renderMarker(
        ctx, linePoints, circlePoints, drawStep, checkPointOnLine,
        isRenderPrice, pricePrecision, priceExtendsText
      )
    })
  }

  /**
   * 绘制标记图形
   * @param ctx
   * @param linePoints
   * @param circlePoints
   * @param drawStep
   * @param checkPointOnLine
   * @param isRenderPrice
   * @param pricePrecision
   * @param priceExtendsText
   */
  renderMarker (
    ctx, linePoints, circlePoints, drawStep, checkPointOnLine,
    isRenderPrice, pricePrecision, priceExtendsText = []
  ) {
    const markerPoint = this.storage.markerPoint
    let isOnLine = false
    linePoints.forEach((points, i) => {
      if (points.length > 1) {
        const isOn = checkPointOnLine(points[0], points[1], markerPoint)
        if (!isOnLine) {
          isOnLine = isOn
        }
        if (drawStep !== GraphicMarkDrawStep.STEP_1) {
          ctx.strokeStyle = this.graphicMark.line.color
          ctx.lineWidth = this.graphicMark.line.size
          ctx.beginPath()
          ctx.moveTo(points[0].x, points[0].y)
          ctx.lineTo(points[1].x, points[1].y)
          ctx.stroke()
          ctx.closePath()
          // 渲染价格
          if (isRenderPrice) {
            const price = this.yRender.getValue(points[0].y)
            const priceText = formatPrecision(price, pricePrecision)
            const textSize = this.graphicMark.text.size
            ctx.font = getFont(textSize)
            ctx.fillStyle = this.graphicMark.text.color
            ctx.fillText(`${priceText} ${priceExtendsText[i] || ''}`, points[0].x + this.graphicMark.text.marginLeft, points[0].y - this.graphicMark.text.marginBottom)
          }
        }
      }
    })
    const radius = this.graphicMark.point.radius
    let isCircleActive = false
    for (let i = 0; i < circlePoints.length; i++) {
      isCircleActive = checkPointOnCircle(circlePoints[i], radius, markerPoint)
      if (isCircleActive) {
        break
      }
    }
    circlePoints.forEach(circlePoint => {
      const isOnCircle = checkPointOnCircle(circlePoint, radius, markerPoint)
      if (isCircleActive || isOnLine) {
        const circleRadius = isOnCircle ? this.graphicMark.point.activeRadius : radius
        const circleColor = isOnCircle ? this.graphicMark.point.activeBackgroundColor : this.graphicMark.point.backgroundColor
        const circleBorderColor = isOnCircle ? this.graphicMark.point.activeBorderColor : this.graphicMark.point.borderColor
        const circleBorderSize = isOnCircle ? this.graphicMark.point.activeBorderSize : this.graphicMark.point.borderSize
        ctx.fillStyle = circleColor
        ctx.beginPath()
        ctx.arc(circlePoint.x, circlePoint.y, circleRadius, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
        ctx.lineWidth = circleBorderSize
        ctx.strokeStyle = circleBorderColor
        ctx.beginPath()
        ctx.arc(circlePoint.x, circlePoint.y, circleRadius, 0, Math.PI * 2)
        ctx.closePath()
        ctx.stroke()
      }
    })
  }
}

export default GraphicMarkRender
