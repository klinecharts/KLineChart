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

import Coordinate from '../common/Coordinate'
import Bounding from '../common/Bounding'
import BarSpace from '../common/BarSpace'
import Precision from '../common/Precision'
import { AnnotationStyle } from '../common/Styles'
import { ElementEventHandler } from '../common/Element'

import Axis from '../componentl/Axis'
import YAxis from '../componentl/YAxis'
import Annotation from '../componentl/Annotation'
import { OverlayFigure } from '../componentl/Overlay'

import TimeScaleStore from '../store/TimeScaleStore'
import { EventAnnotationInfo } from '../store/AnnotationStore'

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
      annotationStore.setHoverInstanceInfo({ paneId, instance: null })
      return false
    }).registerEvent('mouseDownEvent', (coordinate: Coordinate) => {
      annotationStore.setClickInstanceInfo({ paneId, instance: null })
      return false
    })
  }

  private _elementEvents (annotation: Annotation): ElementEventHandler | undefined {
    return {
      mouseMoveEvent: this._elementMouseMoveEvent(annotation),
      mouseDownEvent: this._elementMouseDownEvent(annotation)
    }
  }

  private _elementMouseMoveEvent (annotation: Annotation) {
    return (coordinate: Coordinate) => {
      const pane = this.getWidget().getPane()
      const annotationStore = pane.getChart().getChartStore().getAnnotationStore()
      annotationStore.setHoverInstanceInfo({ paneId: pane.getId(), instance: annotation })
      return true
    }
  }

  private _elementMouseDownEvent (annotation: Annotation) {
    return (coordinate: Coordinate) => {
      const pane = this.getWidget().getPane()
      const paneId = pane.getId()
      const annotationStore = pane.getChart().getChartStore().getAnnotationStore()
      annotationStore.setClickInstanceInfo({ paneId, instance: annotation })
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
    const hoverAnnotation = annotationStore.getHoverInstanceInfo()
    const clickAnnotation = annotationStore.getClickInstanceInfo()
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
    hoverInstanceInfo: EventAnnotationInfo,
    clickInstanceInfo: EventAnnotationInfo,
    timeScaleStore: TimeScaleStore
  ): void {
    const dataIndex = timeScaleStore.timestampToDataIndex(annotation.points.timestamp)
    const coordinate = {
      x: xAxis.convertToPixel(dataIndex),
      y: yAxis.convertToPixel(annotation.points.value)
    }
    // const isActive = annotation.id === hoverInstanceInfo.instance?.id || annotation.id === clickInstanceInfo.instance?.id
    const pointFigures = annotation.createFigures?.({
      overlay: annotation, coordinates: coordinate, bounding, barSpace, precision, defaultStyles, xAxis, yAxis
    }) ?? []
    const pfs = new Array<OverlayFigure>().concat(pointFigures)
    pfs.forEach(({ type, styles, attrs }) => {
      const attrsArray = [].concat(attrs)
      attrsArray.forEach(ats => {
        this.createFigure(
          type, ats, styles ?? annotation.styles?.[type] ?? defaultStyles[type],
          this._elementEvents(annotation)
        )?.draw(ctx)
      })
    })
    const extendFigures = annotation.createExtendFigures?.({
      overlay: annotation, coordinates: coordinate, bounding, barSpace, precision, defaultStyles, xAxis, yAxis
    }) ?? []
    const efs = new Array<OverlayFigure>().concat(extendFigures)
    efs.forEach(({ type, styles, attrs }) => {
      const attrsArray = [].concat(attrs)
      attrsArray.forEach(ats => {
        this.createFigure(
          type, ats, styles ?? annotation.styles?.[type] ?? defaultStyles[type]
        )?.draw(ctx)
      })
    })
  }
}
