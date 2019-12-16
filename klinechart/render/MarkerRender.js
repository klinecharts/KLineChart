import Render from './Render'
import {
  checkPointOnStraightLine,
  checkPointOnCircle,
  getLinearY,
  checkPointOnRayLine,
  checkPointOnSegmentLine,
  getParallelLines, getFibonacciLines
} from '../internal/utils/drawUtils'
import { formatDecimal, isFunction } from '../internal/utils/dataUtils'
import { MarkerType, MarkerDrawStep } from '../internal/constants'

class MarkerRender extends Render {
  constructor (viewPortHandler, dataProvider, yRender) {
    super(viewPortHandler, dataProvider)
    this.yRender = yRender
  }

  /**
   * 渲染水平直线
   * @param ctx
   * @param marker
   */
  renderHorizontalStraightLine (ctx, marker) {
    this.renderPointMarker(
      ctx, MarkerType.HORIZONTAL_STRAIGHT_LINE, marker, checkPointOnStraightLine,
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
   * @param marker
   */
  renderVerticalStraightLine (ctx, marker) {
    this.renderPointMarker(
      ctx, MarkerType.VERTICAL_STRAIGHT_LINE, marker, checkPointOnStraightLine,
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
   * @param marker
   */
  renderStraightLine (ctx, marker) {
    this.renderPointMarker(
      ctx, MarkerType.STRAIGHT_LINE, marker, checkPointOnStraightLine,
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
   * @param marker
   */
  renderHorizontalRayLine (ctx, marker) {
    this.renderPointMarker(
      ctx, MarkerType.HORIZONTAL_RAY_LINE, marker, checkPointOnRayLine,
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
   * @param marker
   */
  renderVerticalRayLine (ctx, marker) {
    this.renderPointMarker(
      ctx, MarkerType.VERTICAL_RAY_LINE, marker, checkPointOnRayLine,
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
   * @param marker
   */
  renderRayLine (ctx, marker) {
    this.renderPointMarker(
      ctx, MarkerType.RAY_LINE, marker, checkPointOnRayLine,
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
   * @param marker
   */
  renderSegmentLine (ctx, marker) {
    this.renderPointMarker(
      ctx, MarkerType.HORIZONTAL_SEGMENT_LINE, marker, checkPointOnSegmentLine
    )
    this.renderPointMarker(
      ctx, MarkerType.VERTICAL_SEGMENT_LINE, marker, checkPointOnSegmentLine
    )
    this.renderPointMarker(
      ctx, MarkerType.SEGMENT_LINE, marker, checkPointOnSegmentLine
    )
  }

  /**
   * 绘制价格线
   * @param ctx
   * @param marker
   */
  renderPriceLine (ctx, marker) {
    this.renderPointMarker(
      ctx, MarkerType.PRICE_LINE, marker, checkPointOnRayLine,
      (points) => {
        return [[points[0], { x: this.viewPortHandler.contentRight(), y: points[0].y }]]
      },
      true
    )
  }

  /**
   * 渲染价格通道线
   * @param ctx
   * @param marker
   */
  renderPriceChannelLine (ctx, marker) {
    this.renderPointMarker(
      ctx, MarkerType.PRICE_CHANNEL_LINE, marker, checkPointOnStraightLine,
      (points) => {
        return getParallelLines(points, this.viewPortHandler, true)
      }
    )
  }

  /**
   * 渲染平行直线
   * @param ctx
   * @param marker
   */
  renderParallelStraightLine (ctx, marker) {
    this.renderPointMarker(
      ctx, MarkerType.PARALLEL_STRAIGHT_LINE, marker, checkPointOnStraightLine,
      (points) => {
        return getParallelLines(points, this.viewPortHandler)
      }
    )
  }

  /**
   * 渲染斐波那契线
   * @param ctx
   * @param marker
   */
  renderFibonacciLine (ctx, marker) {
    this.renderPointMarker(
      ctx, MarkerType.FIBONACCI_LINE, marker, checkPointOnStraightLine,
      (points) => {
        return getFibonacciLines(points, this.viewPortHandler)
      }, true, ['(100.0%)', '(78.6%)', '(61.8%)', '(50.0%)', '(38.2%)', '(23.6%)', '(0.0%)']
    )
  }

  /**
   * 渲染点形成的图形
   * @param ctx
   * @param markerKey
   * @param marker
   * @param checkPointOnLine
   * @param generatedLinePoints
   * @param isRenderPrice
   * @param priceExtendsText
   */
  renderPointMarker (ctx, markerKey, marker, checkPointOnLine, generatedLinePoints, isRenderPrice, priceExtendsText) {
    const markerData = this.dataProvider.markerDatas[markerKey]
    markerData.forEach(({ points, drawStep }) => {
      const circlePoints = []
      points.forEach(({ xPos, price }) => {
        const x = (xPos - this.dataProvider.minPos) * this.dataProvider.dataSpace
        const y = this.yRender.getY(price)
        circlePoints.push({ x, y })
      })
      const linePoints = generatedLinePoints ? generatedLinePoints(circlePoints) : [circlePoints]
      this.renderMarker(ctx, linePoints, circlePoints, marker, drawStep, checkPointOnLine, isRenderPrice, priceExtendsText)
    })
  }

  /**
   * 绘制标记图形
   * @param ctx
   * @param linePoints
   * @param circlePoints
   * @param marker
   * @param drawStep
   * @param checkPointOnLine
   * @param isRenderPrice
   * @param priceExtendsText
   */
  renderMarker (ctx, linePoints, circlePoints, marker, drawStep, checkPointOnLine, isRenderPrice, priceExtendsText = []) {
    const markerPoint = this.dataProvider.markerPoint
    let isOnLine = false
    const valueFormatter = marker.text.valueFormatter
    linePoints.forEach((points, i) => {
      if (points.length > 1) {
        const isOn = checkPointOnLine(points[0], points[1], markerPoint)
        if (!isOnLine) {
          isOnLine = isOn
        }
        if (drawStep !== MarkerDrawStep.STEP_1) {
          ctx.strokeStyle = marker.line.color
          ctx.lineWidth = marker.line.size
          ctx.beginPath()
          ctx.moveTo(points[0].x, points[0].y)
          ctx.lineTo(points[1].x, points[1].y)
          ctx.stroke()
          ctx.closePath()
          // 渲染价格
          if (isRenderPrice) {
            const price = this.yRender.getValue(points[0].y)
            let priceText = formatDecimal(price)
            if (isFunction(valueFormatter)) {
              priceText = valueFormatter(price) || '--'
            }
            const textSize = marker.text.size
            ctx.font = `${textSize}px Arial`
            ctx.fillStyle = marker.text.color
            ctx.fillText(`${priceText} ${priceExtendsText[i] || ''}`, points[0].x + marker.text.marginLeft, points[0].y - marker.text.marginBottom)
          }
        }
      }
    })
    const radius = marker.point.radius
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
        const circleRadius = isOnCircle ? marker.point.activeRadius : radius
        const circleColor = isOnCircle ? marker.point.activeBackgroundColor : marker.point.backgroundColor
        const circleBorderColor = isOnCircle ? marker.point.activeBorderColor : marker.point.borderColor
        const circleBorderSize = isOnCircle ? marker.point.activeBorderSize : marker.point.borderSize
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

export default MarkerRender
