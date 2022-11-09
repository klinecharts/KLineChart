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
import Point from '../common/Point'
import Bounding from '../common/Bounding'
import BarSpace from '../common/BarSpace'
import Precision from '../common/Precision'
import { ShapeStyle } from '../common/Styles'
import { ElementEventHandler } from '../common/Element'

import { isArray } from '../common/utils/typeChecks'
import { formatValue } from '../common/utils/format'

import Axis from '../componentl/Axis'
import YAxis from '../componentl/YAxis'
import Shape, { ShapeMode } from '../componentl/Shape'

import { EventShapeInfo, EventShapeInfoElementType } from '../store/ShapeStore'
import TimeScaleStore from '../store/TimeScaleStore'

import { CANDLE_PANE_ID } from '../pane/CandlePane'
import { XAXIS_PANE_ID } from '../pane/XAxisPane'

import Widget from '../widget/Widget'

import View from './View'

export default class ShapeView extends View<YAxis> {
  constructor (widget: Widget<YAxis>) {
    super(widget)
    this._initEvent()
  }

  private _initEvent (): void {
    const pane = this.getWidget().getPane()
    const paneId = pane.getId()
    const shapeStore = pane.getChart().getChartStore().getShapeStore()
    this.registerEvent('mouseMoveEvent', (coordinate: Coordinate) => {
      const progressInstanceInfo = shapeStore.getProgressInstanceInfo()
      if (progressInstanceInfo !== null) {
        if (progressInstanceInfo.instance.isStart()) {
          shapeStore.updateProgressInstanceInfo(paneId)
        }
        if (progressInstanceInfo.instance.isDrawing()) {
          progressInstanceInfo.instance.mouseMoveForDrawing(this._coordinateToPoint(progressInstanceInfo.instance, coordinate))
        }
        return this._elementMouseMoveEvent(progressInstanceInfo.instance, EventShapeInfoElementType.POINT, progressInstanceInfo.instance.points.length - 1)(coordinate)
      }
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
    }).registerEvent('pressedMouseMoveEvent', (coordinate: Coordinate) => {
      const { instance, elementType, elementIndex } = shapeStore.getPressedInstanceInfo()
      if (instance !== null) {
        const point = this._coordinateToPoint(instance, coordinate)
        if (elementType === EventShapeInfoElementType.POINT) {
          instance.mousePressedPointMove(point, elementIndex)
        } else {
          instance.mousePressedOtherMove(point, this.getWidget().getPane().getChart().getChartStore().getTimeScaleStore())
        }
        return true
      }
      return false
    })
  }

  private _elementEvents (shape: Shape, elementType: EventShapeInfoElementType, elementIndex: number): ElementEventHandler | undefined {
    if (!shape.isDrawing()) {
      return {
        mouseMoveEvent: this._elementMouseMoveEvent(shape, elementType, elementIndex),
        mouseDownEvent: this._elementMouseDownEvent(shape, elementType, elementIndex)
      }
    }
  }

  private _elementMouseMoveEvent (shape: Shape, elementType: EventShapeInfoElementType, elementIndex: number) {
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

  private _coordinateToPoint (shape: Shape, coordinate: Coordinate): Point {
    const pane = this.getWidget().getPane()
    const chart = pane.getChart()
    const paneId = pane.getId()
    const yAxis = pane.getAxisComponent()
    const xAxis = chart.getPaneById(XAXIS_PANE_ID)?.getAxisComponent() as Axis
    const dataIndex = xAxis.convertFromPixel(coordinate.x)
    const timeScaleStore = chart.getChartStore().getTimeScaleStore()
    const timestamp = timeScaleStore.dataIndexToTimestamp(dataIndex)

    let value = yAxis.convertFromPixel(coordinate.y)
    if (shape.mode !== ShapeMode.NORMAL && paneId === CANDLE_PANE_ID) {
      const kLineData = timeScaleStore.getDataByDataIndex(dataIndex)
      if (kLineData !== null) {
        if (value > kLineData.high) {
          if (shape.mode === ShapeMode.WEAK_MAGNET) {
            const highY = yAxis.convertToPixel(kLineData.high)
            const buffValue = yAxis.convertFromPixel(highY - 8)
            if (value < buffValue) {
              value = kLineData.high
            }
          } else {
            value = kLineData.high
          }
        } else if (value < kLineData.low) {
          if (shape.mode === ShapeMode.WEAK_MAGNET) {
            const lowY = yAxis.convertToPixel(kLineData.low)
            const buffValue = yAxis.convertFromPixel(lowY - 8)
            if (value > buffValue) {
              value = kLineData.low
            }
          } else {
            value = kLineData.low
          }
        } else {
          const max = Math.max(kLineData.open, kLineData.close)
          const min = Math.min(kLineData.open, kLineData.close)
          if (value > max) {
            if (value - max < kLineData.high - value) {
              value = max
            } else {
              value = kLineData.high
            }
          } else if (value < min) {
            if (value - kLineData.low < min - value) {
              value = kLineData.low
            } else {
              value = min
            }
          } else if (max - value < value - min) {
            value = max
          } else {
            value = min
          }
        }
      }
    }
    return { dataIndex, timestamp, value }
  }

  dispatchEvent (type: string, coordinate: Coordinate): boolean {
    if (this.getWidget().getPane().getChart().getChartStore().getShapeStore().isDrawing()) {
      return this.onEvent(type, coordinate)
    }
    return super.dispatchEvent(type, coordinate)
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
    const defaultStyles = chartStore.getStyleOptions().shape
    const shapeStore = chartStore.getShapeStore()
    const hoverInstanceInfo = shapeStore.getHoverInstanceInfo()
    const clickInstanceInfo = shapeStore.getClickInstanceInfo()
    const shapes = shapeStore.getInstances(pane.getId())
    shapes.forEach(shape => {
      this._drawShape(ctx, shape, bounding, barSpace, precision, defaultStyles, xAxis, yAxis, hoverInstanceInfo, clickInstanceInfo, timeScaleStore)
    })
    const progressInstanceInfo = shapeStore.getProgressInstanceInfo()
    if (progressInstanceInfo !== null && progressInstanceInfo.paneId === pane.getId()) {
      this._drawShape(ctx, progressInstanceInfo.instance, bounding, barSpace, precision, defaultStyles, xAxis, yAxis, hoverInstanceInfo, clickInstanceInfo, timeScaleStore)
    }
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
    clickInstanceInfo: EventShapeInfo,
    timeScaleStore: TimeScaleStore
  ): void {
    const { points } = shape
    const coordinates = points.map(point => {
      let dataIndex = point.dataIndex
      if (point.timestamp !== null) {
        dataIndex = timeScaleStore.timestampToDataIndex(point.timestamp)
      }
      return {
        x: xAxis.convertToPixel(dataIndex),
        y: yAxis.convertToPixel(point.value)
      }
    })
    if (!shape.isStart() && coordinates.length > 0) {
      const figures = shape.createFigures({ shape, coordinates, bounding, barSpace, precision, defaultStyles, xAxis, yAxis })
      figures.forEach(({ type, styles, attrs }) => {
        const attrsArray = isArray(attrs) ? [].concat(attrs) : [attrs]
        attrsArray.forEach((ats, index) => {
          this.createFigure(
            type, ats, styles ?? defaultStyles[type],
            this._elementEvents(shape, EventShapeInfoElementType.OTHER, index)
          )?.draw(ctx)
        })
      })
    }
    if (
      (hoverInstanceInfo.instance?.id === shape.id && hoverInstanceInfo.elementType !== EventShapeInfoElementType.NONE) ||
      (clickInstanceInfo.instance?.id === shape.id && clickInstanceInfo.elementType !== EventShapeInfoElementType.NONE)
    ) {
      const styles = shape.styles
      coordinates.forEach(({ x, y }, index) => {
        let radius = formatValue(styles, 'point.radius', defaultStyles.point.radius) as number
        let color = formatValue(styles, 'point.color', defaultStyles.point.color)
        let borderColor = formatValue(styles, 'point.borderColor', defaultStyles.point.borderColor)
        let borderSize = formatValue(styles, 'point.borderSize', defaultStyles.point.borderSize) as number
        if (
          hoverInstanceInfo.instance?.id === shape.id &&
          hoverInstanceInfo.elementType === EventShapeInfoElementType.POINT &&
          hoverInstanceInfo.elementIndex === index
        ) {
          radius = formatValue(styles, 'point.activeRadius', defaultStyles.point.activeRadius) as number
          color = formatValue(styles, 'point.activeRadius', defaultStyles.point.activeColor)
          borderColor = formatValue(styles, 'point.activeBorderColor', defaultStyles.point.activeBorderColor)
          borderSize = formatValue(styles, 'point.activeBorderSize', defaultStyles.point.activeBorderSize) as number
        }
        this.createFigure(
          'circle',
          { x, y, r: radius + borderSize },
          { color: borderColor },
          this._elementEvents(shape, EventShapeInfoElementType.POINT, index)
        )?.draw(ctx)
        this.createFigure(
          'circle',
          { x, y, r: radius },
          { color }
        )?.draw(ctx)
      })
    }
  }
}
