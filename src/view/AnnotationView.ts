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

import PickPartial from '../common/PickPartial'
import Coordinate from '../common/Coordinate'
import Point from '../common/Point'
import Bounding from '../common/Bounding'
import BarSpace from '../common/BarSpace'
import Precision from '../common/Precision'
import { AnnotationStyle } from '../common/Styles'
import { ElementEventHandler } from '../common/Element'

import { isArray } from '../common/utils/typeChecks'
import { formatValue } from '../common/utils/format'

import Axis from '../componentl/Axis'
import YAxis from '../componentl/YAxis'
import Annotation, { AnnotationFigure } from '../componentl/Annotation'

import TimeScaleStore from '../store/TimeScaleStore'

import { XAXIS_PANE_ID } from '../pane/XAxisPane'

import Widget from '../widget/Widget'

import View from './View'

export default class AnnotationView extends View<YAxis> {
  constructor (widget: Widget<YAxis>) {
    super(widget)
    this._initEvent()
  }

  private _initEvent (): void {
    const pane = this.getWidget().getPane()
    const paneId = pane.getId()
    const annotationStore = pane.getChart().getChartStore().getAnnotationStore()
    this.registerEvent('mouseMoveEvent', (coordinate: Coordinate) => {
      shapeStore.setHoverInstanceInfo({ paneId, instance: null, elementType: EventShapeInfoElementType.NONE, elementIndex: -1 })
      return false
    }).registerEvent('mouseDownEvent', (coordinate: Coordinate) => {
      const progressInstanceInfo = shapeStore.getProgressInstanceInfo()
      if (progressInstanceInfo !== null) {
        if (progressInstanceInfo.instance.isStart()) {
          shapeStore.updateProgressInstanceInfo(paneId, true)
        }
        if (progressInstanceInfo.instance.isDrawing()) {
          progressInstanceInfo.instance.nextStep()
          if (!progressInstanceInfo.instance.isDrawing()) {
            shapeStore.progressInstanceComplete()
          }
        }
        return this._elementMouseDownEvent(progressInstanceInfo.instance, EventShapeInfoElementType.POINT, progressInstanceInfo.instance.points.length - 1)(coordinate)
      }
      shapeStore.setClickInstanceInfo({ paneId, instance: null, elementType: EventShapeInfoElementType.NONE, elementIndex: -1 })
      return false
    }).registerEvent('mouseUpEvent', (coordinate: Coordinate) => {
      shapeStore.setPressedInstanceInfo({ paneId, instance: null, elementType: EventShapeInfoElementType.NONE, elementIndex: -1 })
      return false
    })
  }

  private _elementEvents (annotation: Annotation): ElementEventHandler | undefined {
    return {
      mouseMoveEvent: this._elementMouseMoveEvent(annotation),
      mouseDownEvent: this._elementMouseDownEvent(shape, elementType, elementIndex)
    }
  }

  private _elementMouseMoveEvent (annotation: Annotation) {
    return (coordinate: Coordinate) => {
      const pane = this.getWidget().getPane()
      const shapeStore = pane.getChart().getChartStore().getShapeStore()
      shapeStore.setHoverInstanceInfo({ paneId: pane.getId(), instance: shape, elementType, elementIndex })
      return true
    }
  }

  private _elementMouseDownEvent (shape: Shape, elementType: EventShapeInfoElementType, elementIndex: number) {
    return (coordinate: Coordinate) => {
      const pane = this.getWidget().getPane()
      const paneId = pane.getId()
      const shapeStore = pane.getChart().getChartStore().getShapeStore()
      shape.startPressedOtherMove(this._coordinateToPoint(shape, coordinate))
      shapeStore.setPressedInstanceInfo({ paneId, instance: shape, elementType, elementIndex })
      shapeStore.setClickInstanceInfo({ paneId, instance: shape, elementType, elementIndex })
      return true
    }
  }

  checkEventOn (coordinate: Coordinate): boolean {
    return true
  }

  protected drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = this.getWidget().getPane()
    const chart = pane.getChart()
    const yAxis = pane.getAxisComponent()
    const xAxis = chart.getPaneById(XAXIS_PANE_ID)?.getAxisComponent() as Axis
    const bounding = widget.getBounding()
    const chartStore = chart.getChartStore()
    const timeScaleStore = chartStore.getTimeScaleStore()
    const barSpace = timeScaleStore.getBarSpace()
    const precision = chartStore.getPrecision()
    const defaultStyles = chartStore.getStyleOptions().annotation
    const annotationStore = chartStore.getAnnotationStore()
    const hoverAnnotation = annotationStore.getHoverInstance()
    const clickAnnotation = annotationStore.getClickInstance()
    const annotations = annotationStore.getInstances(pane.getId())
    annotations.forEach(annotation => {
      this._drawAnnotation(ctx, annotation, bounding, barSpace, precision, defaultStyles, xAxis, yAxis, hoverAnnotation, clickAnnotation, timeScaleStore)
    })
  }

  private _drawAnnotation (
    ctx: CanvasRenderingContext2D,
    annotation: Annotation,
    bounding: Bounding,
    barSpace: BarSpace,
    precision: Precision,
    defaultStyles: AnnotationStyle,
    xAxis: Axis,
    yAxis: Axis,
    hoverAnnotation: Annotation,
    clickAnnotation: Annotation,
    timeScaleStore: TimeScaleStore
  ): void {
    const dataIndex = timeScaleStore.timestampToDataIndex(annotation.point.timestamp)
    const coordinate = {
      x: xAxis.convertToPixel(dataIndex),
      y: yAxis.convertToPixel(annotation.point.value)
    }
    const pointFigures = annotation.createPointFigures?.({
      annotation, coordinate, bounding, barSpace, precision, defaultStyles, xAxis, yAxis
    }) ?? []
    const pfs = new Array<AnnotationFigure>().concat(pointFigures)
    pfs.forEach(({ type, styles, attrs }) => {
      const attrsArray = isArray(attrs) ? [].concat(attrs) : [attrs]
      attrsArray.forEach(ats => {
        this.createFigure(
          type, ats, styles ?? defaultStyles[type],
          this._elementEvents(annotation)
        )?.draw(ctx)
      })
    })
    const extendFigures = annotation.createExtendFigures?.({
      annotation, coordinate, bounding, barSpace, precision, defaultStyles, xAxis, yAxis
    }) ?? []
    const efs = new Array<AnnotationFigure>().concat(extendFigures)
    efs.forEach(({ type, styles, attrs }) => {
      const attrsArray = isArray(attrs) ? [].concat(attrs) : [attrs]
      attrsArray.forEach(ats => {
        this.createFigure(
          type, ats, styles ?? defaultStyles[type]
        )?.draw(ctx)
      })
    })
  }
}
