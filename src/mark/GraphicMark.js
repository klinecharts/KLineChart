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
  STEP_DONE: 'step_done'
}

export const MousePointOnGraphicType = {
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
    this._drawStep = GraphicMarkDrawStep.STEP_DONE
    this._points = []
    this._mousePointOnGraphicType = MousePointOnGraphicType.NONE
    this._mousePointOnGraphicIndex = -1
  }

  _checkMousePointOnDifGraphic (point) {}

  mousePointOnGraphicType () {
    return this._mousePointOnGraphicType
  }

  resetMousePointOnGraphicParams () {
    this._mousePointOnGraphicType = MousePointOnGraphicType.NONE
    this._mousePointOnGraphicIndex = -1
  }

  checkMousePointOnGraphic (point) {
    const mousePointOnGraphicParams = this._checkMousePointOnDifGraphic(point)
    if (mousePointOnGraphicParams) {
      this._mousePointOnGraphicType = mousePointOnGraphicParams.mousePointOnGraphicType
      this._mousePointOnGraphicIndex = mousePointOnGraphicParams.mousePointOnGraphicIndex
      return true
    }
    this.resetMousePointOnGraphicParams()
  }

  _drawGraphic (ctx, xyPoints, graphicMark) {}

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
    if (this._mousePointOnGraphicType !== MousePointOnGraphicType.NONE) {
      xyPoints.forEach(({ x, y }, index) => {
        let radius = graphicMark.point.radius
        let color = graphicMark.point.backgroundColor
        let borderColor = graphicMark.point.borderColor
        let borderSize = graphicMark.point.borderSize
        if (this._mousePointOnGraphicType === MousePointOnGraphicType.POINT && index === this._mousePointOnGraphicIndex) {
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
