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
  constructor (handler, storage, yRender) {
    super(handler, storage)
    this.yRender = yRender
  }

  /**
   * 渲染水平直线
   * @param ctx
   * @param graphicMark
   */
  renderHorizontalStraightLine (ctx, graphicMark) {
    this.renderPointGraphicMark(
      ctx, GraphicMarkType.HORIZONTAL_STRAIGHT_LINE, graphicMark, checkPointOnStraightLine,
      (points) => {
        return [[
          {
            x: this.handler.contentLeft(),
            y: points[0].y
          }, {
            x: this.handler.contentRight(),
            y: points[0].y
          }
        ]]
      }
    )
  }

  /**
   * 渲染垂直直线
   * @param ctx
   * @param graphicMark
   */
  renderVerticalStraightLine (ctx, graphicMark) {
    this.renderPointGraphicMark(
      ctx, GraphicMarkType.VERTICAL_STRAIGHT_LINE, graphicMark, checkPointOnStraightLine,
      (points) => {
        return [[
          {
            x: points[0].x,
            y: this.handler.contentTop()
          }, {
            x: points[0].x,
            y: this.handler.contentBottom()
          }
        ]]
      }
    )
  }

  /**
   * 渲染直线
   * @param ctx
   * @param graphicMark
   */
  renderStraightLine (ctx, graphicMark) {
    this.renderPointGraphicMark(
      ctx, GraphicMarkType.STRAIGHT_LINE, graphicMark, checkPointOnStraightLine,
      (points) => {
        if (points[0].x === points[1].x) {
          return [[
            {
              x: points[0].x,
              y: this.handler.contentTop()
            }, {
              x: points[0].x,
              y: this.handler.bottom
            }
          ]]
        }
        const y = getLinearY(
          points[0], points[1],
          [
            {
              x: this.handler.contentLeft(),
              y: points[0].y
            }, {
              x: this.handler.contentRight(),
              y: points[0].y
            }
          ]
        )
        return [[
          {
            x: this.handler.contentLeft(),
            y: y[0]
          }, {
            x: this.handler.contentRight(),
            y: y[1]
          }
        ]]
      }
    )
  }

  /**
   * 绘制水平射线
   * @param ctx
   * @param graphicMark
   */
  renderHorizontalRayLine (ctx, graphicMark) {
    this.renderPointGraphicMark(
      ctx, GraphicMarkType.HORIZONTAL_RAY_LINE, graphicMark, checkPointOnRayLine,
      (points) => {
        const point = { x: this.handler.contentLeft(), y: points[0].y }
        if (points[0].x < points[1].x) {
          point.x = this.handler.contentRight()
        }
        return [[points[0], point]]
      }
    )
  }

  /**
   * 绘制垂直射线
   * @param ctx
   * @param graphicMark
   */
  renderVerticalRayLine (ctx, graphicMark) {
    this.renderPointGraphicMark(
      ctx, GraphicMarkType.VERTICAL_RAY_LINE, graphicMark, checkPointOnRayLine,
      (points) => {
        const point = { x: points[0].x, y: this.handler.contentTop() }
        if (points[0].y < points[1].y) {
          point.y = this.handler.contentBottom()
        }
        return [[points[0], point]]
      }
    )
  }

  /**
   * 渲染射线
   * @param ctx
   * @param graphicMark
   */
  renderRayLine (ctx, graphicMark) {
    this.renderPointGraphicMark(
      ctx, GraphicMarkType.RAY_LINE, graphicMark, checkPointOnRayLine,
      (points) => {
        let point
        if (points[0].x === points[1].x && points[0].y !== points[1].y) {
          if (points[0].y < points[1].y) {
            point = {
              x: points[0].x,
              y: this.handler.contentBottom()
            }
          } else {
            point = {
              x: points[0].x,
              y: this.handler.contentTop()
            }
          }
        } else if (points[0].x > points[1].x) {
          point = {
            x: this.handler.contentLeft(),
            y: getLinearY(points[0], points[1], [{ x: this.handler.contentLeft(), y: points[0].y }])[0]
          }
        } else {
          point = {
            x: this.handler.contentRight(),
            y: getLinearY(points[0], points[1], [{ x: this.handler.contentRight(), y: points[0].y }])[0]
          }
        }
        return [[points[0], point]]
      }
    )
  }

  /**
   * 绘制线段，水平线段，垂直线段，普通线段一起绘制
   * @param ctx
   * @param graphicMark
   */
  renderSegmentLine (ctx, graphicMark) {
    this.renderPointGraphicMark(
      ctx, GraphicMarkType.HORIZONTAL_SEGMENT_LINE, graphicMark, checkPointOnSegmentLine
    )
    this.renderPointGraphicMark(
      ctx, GraphicMarkType.VERTICAL_SEGMENT_LINE, graphicMark, checkPointOnSegmentLine
    )
    this.renderPointGraphicMark(
      ctx, GraphicMarkType.SEGMENT_LINE, graphicMark, checkPointOnSegmentLine
    )
  }

  /**
   * 绘制价格线
   * @param ctx
   * @param graphicMark
   * @param pricePrecision
   */
  renderPriceLine (ctx, graphicMark, pricePrecision) {
    this.renderPointGraphicMark(
      ctx, GraphicMarkType.PRICE_LINE, graphicMark, checkPointOnRayLine,
      (points) => {
        return [[points[0], { x: this.handler.contentRight(), y: points[0].y }]]
      },
      true, pricePrecision
    )
  }

  /**
   * 渲染价格通道线
   * @param ctx
   * @param graphicMark
   */
  renderPriceChannelLine (ctx, graphicMark) {
    this.renderPointGraphicMark(
      ctx, GraphicMarkType.PRICE_CHANNEL_LINE, graphicMark, checkPointOnStraightLine,
      (points) => {
        return getParallelLines(points, this.handler, true)
      }
    )
  }

  /**
   * 渲染平行直线
   * @param ctx
   * @param graphicMark
   */
  renderParallelStraightLine (ctx, graphicMark) {
    this.renderPointGraphicMark(
      ctx, GraphicMarkType.PARALLEL_STRAIGHT_LINE, graphicMark, checkPointOnStraightLine,
      (points) => {
        return getParallelLines(points, this.handler)
      }
    )
  }

  /**
   * 渲染斐波那契线
   * @param ctx
   * @param graphicMark
   * @param pricePrecision
   */
  renderFibonacciLine (ctx, graphicMark, pricePrecision) {
    this.renderPointGraphicMark(
      ctx, GraphicMarkType.FIBONACCI_LINE, graphicMark, checkPointOnStraightLine,
      (points) => {
        return getFibonacciLines(points, this.handler)
      }, true, pricePrecision, ['(100.0%)', '(78.6%)', '(61.8%)', '(50.0%)', '(38.2%)', '(23.6%)', '(0.0%)']
    )
  }

  /**
   * 渲染点形成的图形
   * @param ctx
   * @param markerKey
   * @param graphicMark
   * @param checkPointOnLine
   * @param generatedLinePoints
   * @param isRenderPrice
   * @param pricePrecision
   * @param priceExtendsText
   */
  renderPointGraphicMark (ctx, markerKey, graphicMark, checkPointOnLine, generatedLinePoints, isRenderPrice, pricePrecision, priceExtendsText) {
    const graphicMarkData = this.storage.graphicMarkDatas[markerKey]
    graphicMarkData.forEach(({ points, drawStep }) => {
      const circlePoints = []
      points.forEach(({ xPos, price }) => {
        const x = (xPos - this.storage.minPos) * this.storage.dataSpace
        const y = this.yRender.getY(price)
        circlePoints.push({ x, y })
      })
      const linePoints = generatedLinePoints ? generatedLinePoints(circlePoints) : [circlePoints]
      this.renderGraphicMark(
        ctx, graphicMark, linePoints, circlePoints, drawStep, checkPointOnLine,
        isRenderPrice, pricePrecision, priceExtendsText
      )
    })
  }

  /**
   * 绘制标记图形
   * @param ctx
   * @param graphicMark
   * @param linePoints
   * @param circlePoints
   * @param drawStep
   * @param checkPointOnLine
   * @param isRenderPrice
   * @param pricePrecision
   * @param priceExtendsText
   */
  renderGraphicMark (
    ctx, graphicMark, linePoints, circlePoints, drawStep, checkPointOnLine,
    isRenderPrice, pricePrecision, priceExtendsText = []
  ) {
    const graphicMarkPoint = this.storage.graphicMarkPoint
    let isOnLine = false
    linePoints.forEach((points, i) => {
      if (points.length > 1) {
        const isOn = checkPointOnLine(points[0], points[1], graphicMarkPoint)
        if (!isOnLine) {
          isOnLine = isOn
        }
        if (drawStep !== GraphicMarkDrawStep.STEP_1) {
          ctx.strokeStyle = graphicMark.line.color
          ctx.lineWidth = graphicMark.line.size
          ctx.beginPath()
          ctx.moveTo(points[0].x, points[0].y)
          ctx.lineTo(points[1].x, points[1].y)
          ctx.stroke()
          ctx.closePath()
          // 渲染价格
          if (isRenderPrice) {
            const price = this.yRender.getValue(points[0].y)
            const priceText = formatPrecision(price, pricePrecision)
            const textSize = graphicMark.text.size
            ctx.font = getFont(textSize)
            ctx.fillStyle = graphicMark.text.color
            ctx.fillText(`${priceText} ${priceExtendsText[i] || ''}`, points[0].x + graphicMark.text.marginLeft, points[0].y - graphicMark.text.marginBottom)
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
