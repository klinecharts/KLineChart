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

import TypeOrNull from '../common/TypeOrNull'
import PickPartial from '../common/PickPartial'
import Coordinate from '../common/Coordinate'
import Point from '../common/Point'
import Bounding from '../common/Bounding'
import BarSpace from '../common/BarSpace'
import Precision from '../common/Precision'
import { OverlayStyle } from '../common/Styles'
import { ElementEventHandler } from '../common/Element'

import { formatValue } from '../common/utils/format'

import Axis from '../component/Axis'
import XAxis from '../component/XAxis'
import YAxis from '../component/YAxis'
import Overlay, { OverlayFigure, OverlayMode } from '../component/Overlay'

import OverlayStore, { ProgressOverlayInfo, EventOverlayInfo, EventOverlayInfoElementType } from '../store/OverlayStore'
import TimeScaleStore from '../store/TimeScaleStore'

import { PaneIdConstants } from '../pane/Pane'

import Widget from '../widget/Widget'

import View from './View'

export default class OverlayView<C extends Axis = YAxis> extends View<C> {
  constructor (widget: Widget<C>) {
    super(widget)
    this._initEvent()
  }

  private _initEvent (): void {
    const pane = this.getWidget().getPane()
    const paneId = pane.getId()
    const overlayStore = pane.getChart().getChartStore().getOverlayStore()
    this.registerEvent('mouseMoveEvent', (coordinate: Coordinate) => {
      const progressInstanceInfo = overlayStore.getProgressInstanceInfo()
      if (progressInstanceInfo !== null) {
        if (progressInstanceInfo.instance.isStart()) {
          overlayStore.updateProgressInstanceInfo(paneId)
        }
        if (progressInstanceInfo.instance.isDrawing()) {
          progressInstanceInfo.instance.mouseMoveForDrawing(this._coordinateToPoint(progressInstanceInfo.instance, coordinate))
        }
        return this._elementMouseMoveEvent(progressInstanceInfo.instance, EventOverlayInfoElementType.POINT, progressInstanceInfo.instance.points.length - 1)(coordinate)
      }
      overlayStore.setHoverInstanceInfo({ paneId, instance: null, elementType: EventOverlayInfoElementType.NONE, elementIndex: -1 })
      return false
    }).registerEvent('mouseDownEvent', (coordinate: Coordinate) => {
      const progressInstanceInfo = overlayStore.getProgressInstanceInfo()
      if (progressInstanceInfo !== null) {
        if (progressInstanceInfo.instance.isStart()) {
          overlayStore.updateProgressInstanceInfo(paneId, true)
        }
        if (progressInstanceInfo.instance.isDrawing()) {
          progressInstanceInfo.instance.nextStep()
          if (!progressInstanceInfo.instance.isDrawing()) {
            overlayStore.progressInstanceComplete()
          }
        }
        return this._elementMouseDownEvent(progressInstanceInfo.instance, EventOverlayInfoElementType.POINT, progressInstanceInfo.instance.points.length - 1)(coordinate)
      }
      overlayStore.setClickInstanceInfo({ paneId, instance: null, elementType: EventOverlayInfoElementType.NONE, elementIndex: -1 })
      return false
    }).registerEvent('mouseUpEvent', (coordinate: Coordinate) => {
      overlayStore.setPressedInstanceInfo({ paneId, instance: null, elementType: EventOverlayInfoElementType.NONE, elementIndex: -1 })
      return false
    }).registerEvent('pressedMouseMoveEvent', (coordinate: Coordinate) => {
      const { instance, elementType, elementIndex } = overlayStore.getPressedInstanceInfo()
      if (instance !== null) {
        const point = this._coordinateToPoint(instance, coordinate)
        if (elementType === EventOverlayInfoElementType.POINT) {
          instance.mousePressedPointMove(point, elementIndex)
        } else {
          instance.mousePressedOtherMove(point, this.getWidget().getPane().getChart().getChartStore().getTimeScaleStore())
        }
        return true
      }
      return false
    })
  }

  private _elementEvents (overlay: Overlay, elementType: EventOverlayInfoElementType, elementIndex: number): ElementEventHandler | undefined {
    if (!overlay.isDrawing()) {
      return {
        mouseMoveEvent: this._elementMouseMoveEvent(overlay, elementType, elementIndex),
        mouseDownEvent: this._elementMouseDownEvent(overlay, elementType, elementIndex)
      }
    }
  }

  private _elementMouseMoveEvent (overlay: Overlay, elementType: EventOverlayInfoElementType, elementIndex: number) {
    return (coordinate: Coordinate) => {
      const pane = this.getWidget().getPane()
      const overlayStore = pane.getChart().getChartStore().getOverlayStore()
      overlayStore.setHoverInstanceInfo({ paneId: pane.getId(), instance: overlay, elementType, elementIndex })
      return true
    }
  }

  private _elementMouseDownEvent (overlay: Overlay, elementType: EventOverlayInfoElementType, elementIndex: number) {
    return (coordinate: Coordinate) => {
      const pane = this.getWidget().getPane()
      const paneId = pane.getId()
      const overlayStore = pane.getChart().getChartStore().getOverlayStore()
      overlay.startPressedOtherMove(this._coordinateToPoint(overlay, coordinate))
      overlayStore.setPressedInstanceInfo({ paneId, instance: overlay, elementType, elementIndex })
      overlayStore.setClickInstanceInfo({ paneId, instance: overlay, elementType, elementIndex })
      return true
    }
  }

  private _coordinateToPoint (overlay: Overlay, coordinate: Coordinate): PickPartial<Point, 'timestamp'> {
    const pane = this.getWidget().getPane()
    const chart = pane.getChart()
    const paneId = pane.getId()
    const yAxis = pane.getAxisComponent()
    const xAxis = chart.getPaneById(PaneIdConstants.XAXIS)?.getAxisComponent() as Axis
    const dataIndex = xAxis.convertFromPixel(coordinate.x)
    const timeScaleStore = chart.getChartStore().getTimeScaleStore()
    const timestamp = timeScaleStore.dataIndexToTimestamp(dataIndex) ?? undefined

    let value = yAxis.convertFromPixel(coordinate.y)
    if (overlay.mode !== OverlayMode.NORMAL && paneId === PaneIdConstants.CANDLE) {
      const kLineData = timeScaleStore.getDataByDataIndex(dataIndex)
      if (kLineData !== null) {
        if (value > kLineData.high) {
          if (overlay.mode === OverlayMode.WEAK_MAGNET) {
            const highY = yAxis.convertToPixel(kLineData.high)
            const buffValue = yAxis.convertFromPixel(highY - 8)
            if (value < buffValue) {
              value = kLineData.high
            }
          } else {
            value = kLineData.high
          }
        } else if (value < kLineData.low) {
          if (overlay.mode === OverlayMode.WEAK_MAGNET) {
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
    if (this.getWidget().getPane().getChart().getChartStore().getOverlayStore().isDrawing()) {
      return this.onEvent(type, coordinate)
    }
    return super.dispatchEvent(type, coordinate)
  }

  checkEventOn (coordinate: Coordinate): boolean {
    return true
  }

  protected drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const paneId = pane.getId()
    const chart = pane.getChart()
    const yAxis = pane.getAxisComponent() as unknown as TypeOrNull<YAxis>
    const xAxis = chart.getPaneById(PaneIdConstants.XAXIS)?.getAxisComponent() as TypeOrNull<XAxis>
    const bounding = widget.getBounding()
    const chartStore = chart.getChartStore()
    const timeScaleStore = chartStore.getTimeScaleStore()
    const dateTimeFormat = timeScaleStore.getDateTimeFormat()
    const barSpace = timeScaleStore.getBarSpace()
    const precision = chartStore.getPrecision()
    const defaultStyles = chartStore.getStyleOptions().overlay
    const overlayStore = chartStore.getOverlayStore()
    const hoverInstanceInfo = overlayStore.getHoverInstanceInfo()
    const clickInstanceInfo = overlayStore.getClickInstanceInfo()
    const overlays = this.getCompleteOverlays(overlayStore, paneId)
    overlays.forEach(overlay => {
      this._drawOverlay(
        ctx, overlay, bounding, barSpace, precision,
        dateTimeFormat, defaultStyles, xAxis, yAxis,
        hoverInstanceInfo, clickInstanceInfo, timeScaleStore
      )
    })
    const progressInstanceInfo = overlayStore.getProgressInstanceInfo()
    if (progressInstanceInfo !== null) {
      const overlay = this.getProgressOverlay(progressInstanceInfo, paneId)
      if (overlay !== null) {
        this._drawOverlay(
          ctx, overlay, bounding, barSpace,
          precision, dateTimeFormat, defaultStyles, xAxis, yAxis,
          hoverInstanceInfo, clickInstanceInfo, timeScaleStore
        )
      }
    }
  }

  private _drawOverlay (
    ctx: CanvasRenderingContext2D,
    overlay: Overlay,
    bounding: Bounding,
    barSpace: BarSpace,
    precision: Precision,
    dateTimeFormat: Intl.DateTimeFormat,
    defaultStyles: OverlayStyle,
    xAxis: TypeOrNull<XAxis>,
    yAxis: TypeOrNull<YAxis>,
    hoverInstanceInfo: EventOverlayInfo,
    clickInstanceInfo: EventOverlayInfo,
    timeScaleStore: TimeScaleStore
  ): void {
    const { points } = overlay
    const coordinates = points.map(point => {
      let dataIndex = point.dataIndex
      if (point.timestamp !== undefined) {
        dataIndex = timeScaleStore.timestampToDataIndex(point.timestamp)
      }
      return {
        x: xAxis?.convertToPixel(dataIndex) ?? 0,
        y: yAxis?.convertToPixel(point.value) ?? 0
      }
    })
    if (coordinates.length > 0) {
      const figures = new Array<OverlayFigure>().concat(
        this.getFigures(
          overlay, coordinates, bounding, barSpace, precision, dateTimeFormat, defaultStyles, xAxis, yAxis
        )
      )
      this.drawFigures(
        ctx,
        overlay,
        figures,
        defaultStyles
      )
    }
    this.drawDefaultFigures(
      ctx,
      overlay,
      coordinates,
      bounding,
      precision,
      dateTimeFormat,
      defaultStyles,
      xAxis,
      yAxis,
      hoverInstanceInfo,
      clickInstanceInfo
    )
  }

  protected drawFigures (ctx: CanvasRenderingContext2D, overlay: Overlay, figures: OverlayFigure[], defaultStyles: OverlayStyle): void {
    figures.forEach(({ type, styles, attrs, ignoreEvent }, index) => {
      const attrsArray = [].concat(attrs)
      attrsArray.forEach(ats => {
        const evnets = (ignoreEvent === undefined || !ignoreEvent) ? this._elementEvents(overlay, EventOverlayInfoElementType.OTHER, index) : undefined
        const ss = { ...defaultStyles[type], ...overlay.styles?.[type], ...styles }
        this.createFigure(
          type, ats, ss, evnets
        )?.draw(ctx)
      })
    })
  }

  protected getCompleteOverlays (overlayStore: OverlayStore, paneId: string): Overlay[] {
    return overlayStore.getInstances(paneId)
  }

  protected getProgressOverlay (info: ProgressOverlayInfo, paneId: string): TypeOrNull<Overlay> {
    if (info.paneId === paneId) {
      return info.instance
    }
    return null
  }

  protected getFigures (
    overlay: Overlay,
    coordinates: Coordinate[],
    bounding: Bounding,
    barSpace: BarSpace,
    precision: Precision,
    dateTimeFormat: Intl.DateTimeFormat,
    defaultStyles: OverlayStyle,
    xAxis: TypeOrNull<XAxis>,
    yAxis: TypeOrNull<YAxis>
  ): OverlayFigure | OverlayFigure[] {
    return overlay.createPointFigures?.({ overlay, coordinates, bounding, barSpace, precision, dateTimeFormat, defaultStyles, xAxis, yAxis }) ?? []
  }

  protected drawDefaultFigures (
    ctx: CanvasRenderingContext2D,
    overlay: Overlay,
    coordinates: Coordinate[],
    bounding: Bounding,
    precision: Precision,
    dateTimeFormat: Intl.DateTimeFormat,
    defaultStyles: OverlayStyle,
    xAxis: TypeOrNull<XAxis>,
    yAxis: TypeOrNull<YAxis>,
    hoverInstanceInfo: EventOverlayInfo,
    clickInstanceInfo: EventOverlayInfo
  ): void {
    if (overlay.needDefaultPointFigure) {
      if (
        (hoverInstanceInfo.instance?.id === overlay.id && hoverInstanceInfo.elementType !== EventOverlayInfoElementType.NONE) ||
        (clickInstanceInfo.instance?.id === overlay.id && clickInstanceInfo.elementType !== EventOverlayInfoElementType.NONE)
      ) {
        const styles = overlay.styles
        coordinates.forEach(({ x, y }, index) => {
          let radius = formatValue(styles, 'point.radius', defaultStyles.point.radius) as number
          let color = formatValue(styles, 'point.color', defaultStyles.point.color)
          let borderColor = formatValue(styles, 'point.borderColor', defaultStyles.point.borderColor)
          let borderSize = formatValue(styles, 'point.borderSize', defaultStyles.point.borderSize) as number
          if (
            hoverInstanceInfo.instance?.id === overlay.id &&
            hoverInstanceInfo.elementType === EventOverlayInfoElementType.POINT &&
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
            this._elementEvents(overlay, EventOverlayInfoElementType.POINT, index)
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
}
