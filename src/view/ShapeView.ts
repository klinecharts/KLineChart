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

import Bounding from '../common/Bounding'
import BarSpace from '../common/BarSpace'
import Precision from '../common/Precision'
import { ShapeStyle } from '../common/Styles'
import Element from '../common/Element'
import ElementGroup from '../common/ElementGroup'
import { isArray } from '../common/utils/typeChecks'
import { formatValue } from '../common/utils/format'

import Axis from '../componentl/Axis'
import YAxis from '../componentl/YAxis'
import Shape from '../componentl/Shape'

import { EventShapeInfo, EventShapeInfoElementType } from '../store/ShapeStore'

import Widget from '../widget/Widget'

import View from './View'
import Coordinate from '../common/Coordinate'

export default class ShapeView extends View<YAxis> {
  private readonly _shapeElements = new Map<Element, Shape>()

  constructor (widget: Widget<YAxis>) {
    super(widget)
    this._initEvent()
  }

  private _initEvent (): void {
    this.registerEvent('mouseMoveEvent', (coordinate, element) => {
      const shape = this._shapeElements.get(element)
      if (shape !== undefined) {

      }
    })
  }

  checkEventOn (coordinate: Coordinate): boolean {
    return true
  }

  dispatchEvent (type: string, coordinate: Coordinate, ...others: any[]): boolean {
    
  }

  protected drawImp (ctx: CanvasRenderingContext2D): void {
    this._shapeElements.clear()
    const widget = this.getWidget()
    const pane = this.getWidget().getPane()
    const chart = pane.getChart()
    const bounding = widget.getBounding()
    const shapeStore = chart.getChartStore().getShapeStore()
    const shapes = shapeStore.getInstances(pane.getId())
  }

  private _drawShape (
    ctx: CanvasRenderingContext2D,
    shape: Shape,
    bounding: Bounding,
    barSpace: BarSpace,
    precision: Precision,
    defaultStyles: ShapeStyle,
    xAxis: Axis,
    yAxis: Axis,
    hoverInstanceInfo: EventShapeInfo,
    clickInstanceInfo: EventShapeInfo
  ): void {
    const { points } = shape
    const coordinates = points.map(point => {
      return { x: xAxis.convertToPixel(point.timestamp), y: yAxis.convertToPixel(point.value) }
    })
    const elements = new ElementGroup()
    if (!shape.isStart() && coordinates.length > 0) {
      const dataSource = shape.createDataSource({ shape, coordinates, bounding, barSpace, precision, defaultStyles, xAxis, yAxis })
      dataSource.forEach(({ type, styles, attrs }) => {
        const attrsArray = isArray(attrs) ? [].concat(attrs) : [attrs]
        attrsArray.forEach(ats => {
          const element = this.createFigure(type, ats, styles ?? defaultStyles[type])
          if (element !== null) {
            elements.addElement(element)
            element.draw(ctx)
          }
        })
      })
    }
    if (
      (hoverInstanceInfo.instanceId === shape.id && hoverInstanceInfo.elementType !== EventShapeInfoElementType.NONE) ||
      (clickInstanceInfo.instanceId === shape.id && clickInstanceInfo.elementType !== EventShapeInfoElementType.NONE) ||
      shape.isDrawing()
    ) {
      const styles = shape.styles
      coordinates.forEach(({ x, y }, index) => {
        let radius = formatValue(styles, 'point.radius', defaultStyles.point.radius) as number
        let color = formatValue(styles, 'point.color', defaultStyles.point.color)
        let borderColor = formatValue(styles, 'point.borderColor', defaultStyles.point.borderColor)
        let borderSize = formatValue(styles, 'point.borderSize', defaultStyles.point.borderSize) as number
        if (
          hoverInstanceInfo.elementType === EventShapeInfoElementType.POINT &&
          index === hoverInstanceInfo.elementIndex
        ) {
          radius = formatValue(styles, 'point.activeRadius', defaultStyles.point.activeRadius) as number
          color = formatValue(styles, 'point.activeRadius', defaultStyles.point.activeColor)
          borderColor = formatValue(styles, 'point.activeBorderColor', defaultStyles.point.activeBorderColor)
          borderSize = formatValue(styles, 'point.activeBorderSize', defaultStyles.point.activeBorderSize) as number
        }
        const outerCircle = this.createFigure(
          'circle',
          { x, y, r: radius + borderSize },
          { color: borderColor }
        )
        if (outerCircle !== null) {
          elements.addElement(outerCircle)
          outerCircle.draw(ctx)
        }
        const innerCircle = this.createFigure(
          'circle',
          { x, y, r: radius },
          { color }
        )
        if (innerCircle !== null) {
          elements.addElement(innerCircle)
          innerCircle.draw(ctx)
        }
      })
    }
    this.addElement(elements)
    this._shapeElements.set(elements, shape)
  }
}
