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
import Coordinate from '../common/Coordinate'
import Point from '../common/Point'
import Bounding from '../common/Bounding'
import BarSpace from '../common/BarSpace'
import Precision from '../common/Precision'
import { OverlayStyle, CustomApi } from '../common/Options'
import { ElementEventHandler } from '../common/Element'
import { MouseTouchEvent } from '../common/MouseTouchEventHandler'

import Axis from '../component/Axis'
import XAxis from '../component/XAxis'
import YAxis from '../component/YAxis'
import Overlay, { OverlayFigure, OverlayMode } from '../component/Overlay'

import OverlayStore, { ProgressOverlayInfo, EventOverlayInfo, EventOverlayInfoFigureType } from '../store/OverlayStore'
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
    this.registerEvent('mouseMoveEvent', (event: MouseTouchEvent) => {
      const progressInstanceInfo = overlayStore.getProgressInstanceInfo()
      if (progressInstanceInfo !== null) {
        const overlay = progressInstanceInfo.instance
        if (overlay.isStart()) {
          overlayStore.updateProgressInstanceInfo(paneId)
        }
        if (overlay.isDrawing()) {
          overlay.eventMoveForDrawing(this._coordinateToPoint(progressInstanceInfo.instance, event))
          overlay.onDrawing?.({ overlay, ...event })
        }
        return this._figureMouseMoveEvent(
          progressInstanceInfo.instance,
          EventOverlayInfoFigureType.POINT,
          progressInstanceInfo.instance.points.length - 1,
          0
        )(event)
      }
      overlayStore.setHoverInstanceInfo({
        paneId, instance: null, figureType: EventOverlayInfoFigureType.NONE, figureIndex: -1, attrsIndex: -1
      }, event)
      return false
    }).registerEvent('touchMouseDownEvent', (event: MouseTouchEvent) => {
      const progressInstanceInfo = overlayStore.getProgressInstanceInfo()
      if (progressInstanceInfo !== null) {
        const overlay = progressInstanceInfo.instance
        if (overlay.isStart()) {
          overlayStore.updateProgressInstanceInfo(paneId, true)
        }
        if (overlay.isDrawing()) {
          overlay.eventMoveForDrawing(this._coordinateToPoint(overlay, event))
          overlay.onDrawing?.({ overlay, ...event })
          overlay.nextStep()
          if (!overlay.isDrawing()) {
            overlayStore.progressInstanceComplete()
            overlay.onDrawEnd?.({ overlay, ...event })
          }
        }
        return this._figureTouchMouseDownEvent(
          progressInstanceInfo.instance,
          EventOverlayInfoFigureType.POINT,
          progressInstanceInfo.instance.points.length - 1,
          0
        )(event)
      }
      overlayStore.setClickInstanceInfo({
        paneId, instance: null, figureType: EventOverlayInfoFigureType.NONE, figureIndex: -1, attrsIndex: -1
      }, event)
      return false
    }).registerEvent('touchMouseUpEvent', (event: MouseTouchEvent) => {
      const { instance } = overlayStore.getPressedInstanceInfo()
      if (instance !== null) {
        instance.onPressedMoveEnd?.({ overlay: instance, ...event })
      }
      overlayStore.setPressedInstanceInfo({
        paneId, instance: null, figureType: EventOverlayInfoFigureType.NONE, figureIndex: -1, attrsIndex: -1
      })
      return false
    }).registerEvent('pressedTouchMouseMoveEvent', (event: MouseTouchEvent) => {
      const { instance, figureType, figureIndex } = overlayStore.getPressedInstanceInfo()
      if (instance !== null) {
        if (!instance.lock) {
          if (!(instance.onPressedMoving?.({ overlay: instance, ...event }) ?? false)) {
            const point = this._coordinateToPoint(instance, event)
            if (figureType === EventOverlayInfoFigureType.POINT) {
              instance.eventPressedPointMove(point, figureIndex)
            } else {
              instance.eventPressedOtherMove(point, this.getWidget().getPane().getChart().getChartStore().getTimeScaleStore())
            }
          }
        }
        return true
      }
      return false
    })
  }

  private _figureEvents (overlay: Overlay, figureType: EventOverlayInfoFigureType, figureIndex: number, attrsIndex: number): ElementEventHandler | undefined {
    if (!overlay.isDrawing()) {
      return {
        mouseMoveEvent: this._figureMouseMoveEvent(overlay, figureType, figureIndex, attrsIndex),
        touchMouseDownEvent: this._figureTouchMouseDownEvent(overlay, figureType, figureIndex, attrsIndex),
        mouseRightClickEvent: this._figureMouseRightClickEvent(overlay, figureType, figureIndex, attrsIndex)
      }
    }
  }

  private _figureMouseMoveEvent (overlay: Overlay, figureType: EventOverlayInfoFigureType, figureIndex: number, attrsIndex: number) {
    return (event: MouseTouchEvent) => {
      const pane = this.getWidget().getPane()
      const overlayStore = pane.getChart().getChartStore().getOverlayStore()
      overlayStore.setHoverInstanceInfo(
        { paneId: pane.getId(), instance: overlay, figureType, figureIndex, attrsIndex }, event
      )
      return true
    }
  }

  private _figureTouchMouseDownEvent (overlay: Overlay, figureType: EventOverlayInfoFigureType, figureIndex: number, attrsIndex: number) {
    return (event: MouseTouchEvent) => {
      const pane = this.getWidget().getPane()
      const paneId = pane.getId()
      const overlayStore = pane.getChart().getChartStore().getOverlayStore()
      overlay.startPressedMove(this._coordinateToPoint(overlay, event))
      overlay.onPressedMoveStart?.({ overlay, ...event })
      overlayStore.setPressedInstanceInfo({ paneId, instance: overlay, figureType, figureIndex, attrsIndex })
      overlayStore.setClickInstanceInfo({ paneId, instance: overlay, figureType, figureIndex, attrsIndex }, event)
      return true
    }
  }

  _figureMouseRightClickEvent (overlay: Overlay, figureType: EventOverlayInfoFigureType, figureIndex: number, attrsIndex: number) {
    return (event: MouseTouchEvent) => {
      if (!(overlay.onRightClick?.({ overlay, ...event }) ?? false)) {
        const pane = this.getWidget().getPane()
        const overlayStore = pane.getChart().getChartStore().getOverlayStore()
        overlayStore.removeInstance(overlay.id)
      }
      return true
    }
  }

  private _coordinateToPoint (overlay: Overlay, coordinate: Coordinate): Partial<Point> {
    const point: Partial<Point> = {}
    const pane = this.getWidget().getPane()
    const chart = pane.getChart()
    const paneId = pane.getId()
    const timeScaleStore = chart.getChartStore().getTimeScaleStore()
    if (this.coordinateToPointTimestampDataIndexFlag()) {
      const xAxis = chart.getPaneById(PaneIdConstants.XAXIS)?.getAxisComponent() as Axis
      const dataIndex = xAxis.convertFromPixel(coordinate.x)
      const timestamp = timeScaleStore.dataIndexToTimestamp(dataIndex) ?? undefined
      point.dataIndex = dataIndex
      point.timestamp = timestamp
    }
    if (this.coordinateToPointValueFlag()) {
      const yAxis = pane.getAxisComponent()
      let value = yAxis.convertFromPixel(coordinate.y)
      if (overlay.mode !== OverlayMode.NORMAL && paneId === PaneIdConstants.CANDLE && point.dataIndex !== undefined) {
        const kLineData = timeScaleStore.getDataByDataIndex(point.dataIndex)
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
      point.value = value
    }
    return point
  }

  protected coordinateToPointValueFlag (): boolean {
    return true
  }

  protected coordinateToPointTimestampDataIndexFlag (): boolean {
    return true
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
    const customApi = chartStore.getCustomApi()
    const timeScaleStore = chartStore.getTimeScaleStore()
    const dateTimeFormat = timeScaleStore.getDateTimeFormat()
    const barSpace = timeScaleStore.getBarSpace()
    const precision = chartStore.getPrecision()
    const defaultStyles = chartStore.getStyles().overlay
    const overlayStore = chartStore.getOverlayStore()
    const hoverInstanceInfo = overlayStore.getHoverInstanceInfo()
    const clickInstanceInfo = overlayStore.getClickInstanceInfo()
    const overlays = this.getCompleteOverlays(overlayStore, paneId)
    overlays.forEach(overlay => {
      this._drawOverlay(
        ctx, overlay, bounding, barSpace, precision,
        dateTimeFormat, customApi, defaultStyles, xAxis, yAxis,
        hoverInstanceInfo, clickInstanceInfo, timeScaleStore
      )
    })
    const progressInstanceInfo = overlayStore.getProgressInstanceInfo()
    if (progressInstanceInfo !== null) {
      const overlay = this.getProgressOverlay(progressInstanceInfo, paneId)
      if (overlay !== null) {
        this._drawOverlay(
          ctx, overlay, bounding, barSpace,
          precision, dateTimeFormat, customApi, defaultStyles, xAxis, yAxis,
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
    customApi: CustomApi,
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
      customApi,
      defaultStyles,
      xAxis,
      yAxis,
      hoverInstanceInfo,
      clickInstanceInfo
    )
  }

  protected drawFigures (ctx: CanvasRenderingContext2D, overlay: Overlay, figures: OverlayFigure[], defaultStyles: OverlayStyle): void {
    figures.forEach((figure, figureIndex) => {
      const { type, styles, attrs, ignoreEvent } = figure
      const attrsArray = [].concat(attrs)
      attrsArray.forEach((ats, attrsIndex) => {
        const evnets = (ignoreEvent === undefined || !ignoreEvent) ? this._figureEvents(overlay, EventOverlayInfoFigureType.OTHER, figureIndex, attrsIndex) : undefined
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
    customApi: CustomApi,
    defaultStyles: OverlayStyle,
    xAxis: TypeOrNull<XAxis>,
    yAxis: TypeOrNull<YAxis>,
    hoverInstanceInfo: EventOverlayInfo,
    clickInstanceInfo: EventOverlayInfo
  ): void {
    if (overlay.needDefaultPointFigure) {
      if (
        (hoverInstanceInfo.instance?.id === overlay.id && hoverInstanceInfo.figureType !== EventOverlayInfoFigureType.NONE) ||
        (clickInstanceInfo.instance?.id === overlay.id && clickInstanceInfo.figureType !== EventOverlayInfoFigureType.NONE)
      ) {
        const styles = overlay.styles
        const pointStyles = { ...defaultStyles.point, ...styles?.point }
        coordinates.forEach(({ x, y }, index) => {
          let radius = pointStyles.radius
          let color = pointStyles.color
          let borderColor = pointStyles.borderColor
          let borderSize = pointStyles.borderSize
          if (
            hoverInstanceInfo.instance?.id === overlay.id &&
            hoverInstanceInfo.figureType === EventOverlayInfoFigureType.POINT &&
            hoverInstanceInfo.figureIndex === index
          ) {
            radius = pointStyles.activeRadius
            color = pointStyles.activeColor
            borderColor = pointStyles.activeBorderColor
            borderSize = pointStyles.activeBorderSize
          }
          this.createFigure(
            'circle',
            { x, y, r: radius + borderSize },
            { color: borderColor },
            this._figureEvents(overlay, EventOverlayInfoFigureType.POINT, index, 0)
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
