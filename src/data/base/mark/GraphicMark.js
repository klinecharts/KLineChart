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

import { renderStrokeFillCircle } from '../../../renderer/circle'

/**
 * 图形标记系列
 * @type {{TWO_POINT_LINE: string, THREE_ONE_POINT_LINE: string, ONE_POINT_LINE: string}}
 */
export const GraphicMarkSeries = {
  ONE_POINT_LINE: 'onePointLine',
  TWO_POINT_LINE: 'twoPointLine',
  THREE_ONE_POINT_LINE: 'threePointLine'
}

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
  constructor (id, name, series, chartData, xAxis, yAxis) {
    this.id = id
    this.name = name
    this.series = series
    this._chartData = chartData
    this._xAxis = xAxis
    this._yAxis = yAxis
    this._drawStep = GraphicMarkDrawStep.STEP_1
    this._tpPoints = []
    this._hoverType = HoverType.NONE
    this._hoverIndex = -1
  }

  /**
   * 时间戳转换成x轴上点的位置
   * @param tpPoint
   * @return {*|number}
   * @private
   */
  _timestampOrDataIndexToPointX ({ timestamp, dataIndex }) {
    return timestamp
      ? this._xAxis.convertToPixel(this._chartData.timestampToDataIndex(timestamp))
      : this._xAxis.convertToPixel(dataIndex)
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
   * 绘制图形
   * @param ctx
   * @param xyPoints
   * @param markOptions
   * @private
   */
  _drawGraphic (ctx, xyPoints, markOptions) {}

  /**
   * 绘制
   * @param ctx
   */
  draw (ctx) {
    const xyPoints = this._tpPoints.map(({ timestamp, price, dataIndex }) => {
      return {
        x: this._timestampOrDataIndexToPointX({ timestamp, dataIndex }),
        y: this._yAxis.convertToPixel(price)
      }
    })
    const markOptions = this._chartData.styleOptions().graphicMark
    if (this._drawStep !== GraphicMarkDrawStep.STEP_1) {
      this._drawGraphic(ctx, xyPoints, markOptions)
    }
    if (this._hoverType !== HoverType.NONE) {
      xyPoints.forEach(({ x, y }, index) => {
        let radius = markOptions.point.radius
        let color = markOptions.point.backgroundColor
        let borderColor = markOptions.point.borderColor
        let borderSize = markOptions.point.borderSize
        if (this._hoverType === HoverType.POINT && index === this._hoverIndex) {
          radius = markOptions.point.activeRadius
          color = markOptions.point.activeBackgroundColor
          borderColor = markOptions.point.activeBorderColor
          borderSize = markOptions.point.activeBorderSize
        }
        renderStrokeFillCircle(ctx, color, borderColor, borderSize, { x, y }, radius)
      })
    }
  }
}
