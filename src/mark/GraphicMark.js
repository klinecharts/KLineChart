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

/**
 * 标记图形绘制步骤
 * @type {{STEP_3: *, STEP_DONE: *, STEP_1: *, STEP_2: *}}
 */
export const GraphicMarkDrawStep = {
  STEP_1: 'step_1',
  STEP_2: 'step_2',
  STEP_3: 'step_3',
  STEP_4: 'step_4',
  FINISHED: 'finished'
}

export const HoverType = {
  LINE: 'line',
  POINT: 'point',
  NONE: 'none'
}

/**
 * 标记图形
 */
export default class GraphicMark {
  constructor (chartData, xAxis, yAxis) {
    this._chartData = chartData
    this._xAxis = xAxis
    this._yAxis = yAxis
    this._drawStep = GraphicMarkDrawStep.STEP_1
    this._points = []
    this._hoverType = HoverType.NONE
    this._hoverIndex = -1
  }

  /**
   * 针对不同图形去检查鼠标点在哪个上面
   * @param point
   * @private
   */
  _checkMousePointOnDifGraphic (point) {}

  /**
   * 获取鼠标点在图形上的类型
   * @return {string}
   */
  hoverType () {
    return this._hoverType
  }

  /**
   * 是否在绘制中
   * @return {boolean}
   */
  isDrawing () {
    return this._drawStep !== GraphicMarkDrawStep.FINISHED
  }

  /**
   * 重置鼠标点在图形上的参数
   */
  resetHoverParams () {
    this._hoverType = HoverType.NONE
    this._hoverIndex = -1
  }

  /**
   * 检查鼠标点是否在图形上
   * @param point
   * @return {boolean}
   */
  checkMousePointOnGraphic (point) {
    const hoverParams = this._checkMousePointOnDifGraphic(point)
    if (hoverParams) {
      this._hoverType = hoverParams.hoverType
      this._hoverIndex = hoverParams.hoverIndex
      return true
    }
    this.resetHoverParams()
  }

  /**
   * 获取图形
   * @param ctx
   * @param xyPoints
   * @param graphicMark
   * @private
   */
  _drawGraphic (ctx, xyPoints, graphicMark) {}

  /**
   * 绘制
   * @param ctx
   */
  draw (ctx) {
    const xyPoints = this._points.map(({ xPos, price }) => {
      return {
        x: this._xAxis.convertToPixel(xPos),
        y: this._yAxis.convertToPixel(price)
      }
    })
    const graphicMark = this._chartData.styleOptions().graphicMark
    if (this._drawStep !== GraphicMarkDrawStep.STEP_1) {
      this._drawGraphic(ctx, xyPoints, graphicMark)
    }
    if (this._hoverType !== HoverType.NONE) {
      xyPoints.forEach(({ x, y }, index) => {
        let radius = graphicMark.point.radius
        let color = graphicMark.point.backgroundColor
        let borderColor = graphicMark.point.borderColor
        let borderSize = graphicMark.point.borderSize
        if (this._hoverType === HoverType.POINT && index === this._hoverIndex) {
          radius = graphicMark.point.activeRadius
          color = graphicMark.point.activeBackgroundColor
          borderColor = graphicMark.point.activeBorderColor
          borderSize = graphicMark.point.activeBorderSize
        }
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
        ctx.lineWidth = borderSize
        ctx.strokeStyle = borderColor
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.closePath()
        ctx.stroke()
      })
    }
  }
}
