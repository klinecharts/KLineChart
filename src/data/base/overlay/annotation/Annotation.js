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

import Overlay from '../Overlay'

import { renderFillCircle } from '../../../../renderer/circle'
import { renderFillRect } from '../../../../renderer/rect'
import { renderFillDiamond } from '../../../../renderer/diamond'
import { renderFillTriangle } from '../../../../renderer/triangle'
import {
  checkPointInCircle, checkPointInDiamond,
  checkPointInRect, checkPointInTriangle
} from '../../../../extension/mark/graphicHelper'

import { isNumber } from '../../../../utils/typeChecks'

/**
 * 注解标识样式
 * @type {{RECT: string, TRIANGLE: string, DIAMOND: string, NONE: string, CIRCLE: string}}
 */
export const AnnotationSymbol = {
  CIRCLE: 'circle',
  RECT: 'rect',
  TRIANGLE: 'triangle',
  DIAMOND: 'diamond',
  CUSTOM: 'custom',
  NONE: 'none'
}

/**
 * 注释位置
 * @type {{HIGH: string, TOP: string, LOW: string, CLOSE: string, BOTTOM: string, POINT: string, OPEN: string}}
 */
export const AnnotationPosition = {
  OPEN: 'open',
  LOW: 'low',
  HIGH: 'high',
  CLOSE: 'close',
  POINT: 'point',
  TOP: 'top',
  BOTTOM: 'bottom'
}

/**
 * 注解
 */
export default class Annotation extends Overlay {
  constructor ({
    id, chartData, symbol, point, position, xAxis, yAxis, styles
  }) {
    super({ id, chartData, xAxis, yAxis })
    this._symbol = symbol || AnnotationSymbol.CIRCLE
    this._position = position || AnnotationPosition.TOP
    this._tpPoint = point
    this._symbolCoordinate = {}
    this.setStyles(styles, chartData.styleOptions().annotation)
  }

  /**
   * 绘制标识
   * @param ctx
   * @param isActive
   * @param styles
   * @private
   */
  _drawSymbol (ctx, isActive, styles) {
    const barSpace = this._chartData.barSpace()
    const symbolOptions = styles.symbol
    const styleSize = symbolOptions.size
    const styleActiveSize = symbolOptions.activeSize
    const size = isActive
      ? (isNumber(styleActiveSize) ? styleActiveSize : barSpace)
      : (isNumber(styleSize) ? styleSize : barSpace)
    const color = isActive ? symbolOptions.activeColor : symbolOptions.color
    switch (this._symbol) {
      case AnnotationSymbol.CIRCLE: {
        renderFillCircle(ctx, color, this._symbolCoordinate, size / 2)
        break
      }
      case AnnotationSymbol.RECT: {
        renderFillRect(
          ctx, color,
          this._symbolCoordinate.x - size / 2,
          this._symbolCoordinate.y - size / 2,
          size, size
        )
        break
      }
      case AnnotationSymbol.DIAMOND: {
        renderFillDiamond(ctx, color, this._symbolCoordinate, size, size)
        break
      }
      case AnnotationSymbol.TRIANGLE: {
        renderFillTriangle(ctx, color, this._symbolCoordinate, size, size)
        break
      }
      case AnnotationSymbol.CUSTOM: {
        this.drawCustomSymbol({
          ctx,
          point: this._tpPoint,
          coordinatePoint: this._symbolCoordinate,
          styles: symbolOptions,
          barSpace,
          isActive
        })
        break
      }
      default: {
        break
      }
    }
  }

  draw (ctx) {
    const styles = this._styles || this._chartData.styleOptions().annotation
    const isActive = this._id === this._chartData.annotationMouseOperate().id
    this._drawSymbol(ctx, isActive, styles)
    if (this.drawExtend) {
      ctx.save()
      this.drawExtend({
        ctx,
        point: this._tpPoint,
        coordinatePoint: this._symbolCoordinate,
        styles,
        isActive
      })
      ctx.restore()
    }
  }

  checkMousePointOnGraphic (point) {
    const barSpace = this._chartData.barSpace()
    const styles = this._styles || this._chartData.styleOptions().annotation
    const styleSize = styles.symbol.size
    const size = isNumber(styleSize) ? styleSize : barSpace
    let isOn
    switch (this._symbol) {
      case AnnotationSymbol.CIRCLE: {
        isOn = checkPointInCircle(this._symbolCoordinate, size / 2, point)
        break
      }
      case AnnotationSymbol.RECT: {
        const point1 = { x: this._symbolCoordinate.x - size / 2, y: this._symbolCoordinate.y - size / 2 }
        const point2 = { x: this._symbolCoordinate.x + size / 2, y: this._symbolCoordinate.y + size / 2 }
        isOn = checkPointInRect(point1, point2, point)
        break
      }
      case AnnotationSymbol.DIAMOND: {
        isOn = checkPointInDiamond(size, size, point)
        break
      }
      case AnnotationSymbol.TRIANGLE: {
        isOn = checkPointInTriangle(
          [
            { x: this._symbolCoordinate.x - size / 2, y: this._symbolCoordinate.y + size / 2 },
            { x: this._symbolCoordinate.x, y: this._symbolCoordinate.y - size / 2 },
            { x: this._symbolCoordinate.x + size / 2, y: this._symbolCoordinate.y + size / 2 }
          ],
          point
        )
        break
      }
      case AnnotationSymbol.CUSTOM: {
        isOn = this.checkPointInCustomSymbol({
          point: this._tpPoint,
          coordinatePoint: this._symbolCoordinate,
          size
        })
        break
      }
      default: {
        break
      }
    }
    if (isOn) {
      return {
        id: this._id,
        instance: this
      }
    }
  }

  /**
   * 生成标识坐标
   * @param x
   * @param kLineData
   */
  createSymbolCoordinate (x, kLineData) {
    let y
    switch (this._position) {
      case AnnotationPosition.OPEN:
      case AnnotationPosition.LOW:
      case AnnotationPosition.HIGH:
      case AnnotationPosition.CLOSE: {
        y = this._yAxis.convertToPixel(kLineData[this._position])
        break
      }
      case AnnotationPosition.TOP: {
        y = 0
        break
      }
      case AnnotationPosition.BOTTOM: {
        y = this._yAxis.height()
        break
      }
      default: {
        y = this._yAxis.convertToPixel(this._tpPoint.price)
        break
      }
    }
    this._symbolCoordinate = { x, y }
  }

  /**
   * 检查鼠标点是否在自定义标识内
   * @param point
   * @param coordinatePoint
   * @param size
   */
  checkPointInCustomSymbol ({ point, coordinatePoint, size }) {}

  /**
   * 绘制自定义标识
   * @param ctx
   * @param point
   * @param coordinatePoint
   * @param styles
   * @param barSpace
   * @param isActive
   */
  drawCustomSymbol ({ ctx, point, coordinatePoint, styles, barSpace, isActive }) {}
}
