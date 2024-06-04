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

import type Nullable from '../common/Nullable'
import type Coordinate from '../common/Coordinate'
import type Point from '../common/Point'
import type Bounding from '../common/Bounding'
import type BarSpace from '../common/BarSpace'
import { type OverlayStyle } from '../common/Styles'
import { type EventHandler, type EventName, type MouseTouchEvent, type MouseTouchEventCallback } from '../common/SyntheticEvent'
import { isBoolean, isNumber, isValid } from '../common/utils/typeChecks'

import { type CustomApi } from '../Options'

import type Axis from '../component/Axis'
import type XAxis from '../component/XAxis'
import type YAxis from '../component/YAxis'
import { type OverlayPrecision, type OverlayFigure, type OverlayFigureIgnoreEventType } from '../component/Overlay'
import type Overlay from '../component/Overlay'
import { OVERLAY_FIGURE_KEY_PREFIX, OverlayMode, getAllOverlayFigureIgnoreEventTypes } from '../component/Overlay'

import { type ProgressOverlayInfo, type EventOverlayInfo } from '../store/OverlayStore'
import type OverlayStore from '../store/OverlayStore'
import { EventOverlayInfoFigureType } from '../store/OverlayStore'
import type TimeScaleStore from '../store/TimeScaleStore'

import { PaneIdConstants } from '../pane/types'

import type DrawWidget from '../widget/DrawWidget'
import type DrawPane from '../pane/DrawPane'

import View from './View'

export default class OverlayView<C extends Axis = YAxis> extends View<C> {
  constructor (widget: DrawWidget<DrawPane<C>>) {
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
        let progressInstancePaneId = progressInstanceInfo.paneId
        if (overlay.isStart()) {
          overlayStore.updateProgressInstanceInfo(paneId)
          progressInstancePaneId = paneId
        }
        const index = overlay.points.length - 1
        const key = `${OVERLAY_FIGURE_KEY_PREFIX}point_${index}`
        if (overlay.isDrawing() && progressInstancePaneId === paneId) {
          overlay.eventMoveForDrawing(this._coordinateToPoint(progressInstanceInfo.instance, event))
          overlay.onDrawing?.({ overlay, figureKey: key, figureIndex: index, ...event })
        }
        return this._figureMouseMoveEvent(
          overlay,
          EventOverlayInfoFigureType.Point,
          key,
          index,
          0
        )(event)
      }
      overlayStore.setHoverInstanceInfo({
        paneId, instance: null, figureType: EventOverlayInfoFigureType.None, figureKey: '', figureIndex: -1, attrsIndex: -1
      }, event)
      return false
    }).registerEvent('mouseClickEvent', (event: MouseTouchEvent) => {
      const progressInstanceInfo = overlayStore.getProgressInstanceInfo()
      if (progressInstanceInfo !== null) {
        const overlay = progressInstanceInfo.instance
        let progressInstancePaneId = progressInstanceInfo.paneId
        if (overlay.isStart()) {
          overlayStore.updateProgressInstanceInfo(paneId, true)
          progressInstancePaneId = paneId
        }
        const index = overlay.points.length - 1
        const key = `${OVERLAY_FIGURE_KEY_PREFIX}point_${index}`
        if (overlay.isDrawing() && progressInstancePaneId === paneId) {
          overlay.eventMoveForDrawing(this._coordinateToPoint(overlay, event))
          overlay.onDrawing?.({ overlay, figureKey: key, figureIndex: index, ...event })
          overlay.nextStep()
          if (!overlay.isDrawing()) {
            overlayStore.progressInstanceComplete()
            overlay.onDrawEnd?.({ overlay, figureKey: key, figureIndex: index, ...event })
          }
        }
        return this._figureMouseClickEvent(
          overlay,
          EventOverlayInfoFigureType.Point,
          key,
          index,
          0
        )(event)
      }
      overlayStore.setClickInstanceInfo({
        paneId, instance: null, figureType: EventOverlayInfoFigureType.None, figureKey: '', figureIndex: -1, attrsIndex: -1
      }, event)
      return false
    }).registerEvent('mouseDoubleClickEvent', (event: MouseTouchEvent) => {
      const progressInstanceInfo = overlayStore.getProgressInstanceInfo()
      if (progressInstanceInfo !== null) {
        const overlay = progressInstanceInfo.instance
        const progressInstancePaneId = progressInstanceInfo.paneId
        if (overlay.isDrawing() && progressInstancePaneId === paneId) {
          overlay.forceComplete()
          if (!overlay.isDrawing()) {
            overlayStore.progressInstanceComplete()
            const index = overlay.points.length - 1
            const key = `${OVERLAY_FIGURE_KEY_PREFIX}point_${index}`
            overlay.onDrawEnd?.({ overlay, figureKey: key, figureIndex: index, ...event })
          }
        }
        const index = overlay.points.length - 1
        return this._figureMouseClickEvent(
          overlay,
          EventOverlayInfoFigureType.Point,
          `${OVERLAY_FIGURE_KEY_PREFIX}point_${index}`,
          index,
          0
        )(event)
      }
      return false
    }).registerEvent('mouseRightClickEvent', (event: MouseTouchEvent) => {
      const progressInstanceInfo = overlayStore.getProgressInstanceInfo()
      if (progressInstanceInfo !== null) {
        const overlay = progressInstanceInfo.instance
        if (overlay.isDrawing()) {
          const index = overlay.points.length - 1
          return this._figureMouseRightClickEvent(
            overlay,
            EventOverlayInfoFigureType.Point,
            `${OVERLAY_FIGURE_KEY_PREFIX}point_${index}`,
            index,
            0
          )(event)
        }
      }
      return false
    }).registerEvent('mouseUpEvent', (event: MouseTouchEvent) => {
      const { instance, figureIndex, figureKey } = overlayStore.getPressedInstanceInfo()
      if (instance !== null) {
        instance.onPressedMoveEnd?.({ overlay: instance, figureKey, figureIndex, ...event })
      }
      overlayStore.setPressedInstanceInfo({
        paneId, instance: null, figureType: EventOverlayInfoFigureType.None, figureKey: '', figureIndex: -1, attrsIndex: -1
      })
      return false
    }).registerEvent('pressedMouseMoveEvent', (event: MouseTouchEvent) => {
      const { instance, figureType, figureIndex, figureKey } = overlayStore.getPressedInstanceInfo()
      if (instance !== null) {
        if (!instance.lock) {
          if (!(instance.onPressedMoving?.({ overlay: instance, figureIndex, figureKey, ...event }) ?? false)) {
            const point = this._coordinateToPoint(instance, event)
            if (figureType === EventOverlayInfoFigureType.Point) {
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

  private _createFigureEvents (
    overlay: Overlay,
    figureType: EventOverlayInfoFigureType,
    figureKey: string,
    figureIndex: number,
    attrsIndex: number,
    ignoreEvent?: boolean | OverlayFigureIgnoreEventType[]
  ): EventHandler | undefined {
    let eventHandler
    if (!overlay.isDrawing()) {
      let eventTypes: OverlayFigureIgnoreEventType[] = []
      if (isValid(ignoreEvent)) {
        if (isBoolean(ignoreEvent)) {
          if (ignoreEvent) {
            eventTypes = getAllOverlayFigureIgnoreEventTypes()
          }
        } else {
          eventTypes = ignoreEvent
        }
      }
      if (eventTypes.length === 0) {
        return {
          mouseMoveEvent: this._figureMouseMoveEvent(overlay, figureType, figureKey, figureIndex, attrsIndex),
          mouseDownEvent: this._figureMouseDownEvent(overlay, figureType, figureKey, figureIndex, attrsIndex),
          mouseClickEvent: this._figureMouseClickEvent(overlay, figureType, figureKey, figureIndex, attrsIndex),
          mouseRightClickEvent: this._figureMouseRightClickEvent(overlay, figureType, figureKey, figureIndex, attrsIndex),
          mouseDoubleClickEvent: this._figureMouseDoubleClickEvent(overlay, figureType, figureKey, figureIndex, attrsIndex)
        }
      }
      eventHandler = {}
      // [
      //   'mouseClickEvent', mouseDoubleClickEvent, 'mouseRightClickEvent',
      //   'tapEvent', 'doubleTapEvent', 'mouseDownEvent',
      //   'touchStartEvent', 'mouseMoveEvent', 'touchMoveEvent'
      // ]
      if (!eventTypes.includes('mouseMoveEvent') && !eventTypes.includes('touchMoveEvent')) {
        eventHandler.mouseMoveEvent = this._figureMouseMoveEvent(overlay, figureType, figureKey, figureIndex, attrsIndex)
      }
      if (!eventTypes.includes('mouseDownEvent') && !eventTypes.includes('touchStartEvent')) {
        eventHandler.mouseDownEvent = this._figureMouseDownEvent(overlay, figureType, figureKey, figureIndex, attrsIndex)
      }
      if (!eventTypes.includes('mouseClickEvent') && !eventTypes.includes('tapEvent')) {
        eventHandler.mouseClickEvent = this._figureMouseClickEvent(overlay, figureType, figureKey, figureIndex, attrsIndex)
      }
      if (!eventTypes.includes('mouseDoubleClickEvent') && !eventTypes.includes('doubleTapEvent')) {
        eventHandler.mouseDoubleClickEvent = this._figureMouseDoubleClickEvent(overlay, figureType, figureKey, figureIndex, attrsIndex)
      }
      if (!eventTypes.includes('mouseRightClickEvent')) {
        eventHandler.mouseRightClickEvent = this._figureMouseRightClickEvent(overlay, figureType, figureKey, figureIndex, attrsIndex)
      }
    }
    return eventHandler
  }

  private _figureMouseMoveEvent (overlay: Overlay, figureType: EventOverlayInfoFigureType, figureKey: string, figureIndex: number, attrsIndex: number): MouseTouchEventCallback {
    return (event: MouseTouchEvent) => {
      const pane = this.getWidget().getPane()
      const overlayStore = pane.getChart().getChartStore().getOverlayStore()
      overlayStore.setHoverInstanceInfo(
        { paneId: pane.getId(), instance: overlay, figureType, figureKey, figureIndex, attrsIndex }, event
      )
      return true
    }
  }

  private _figureMouseDownEvent (overlay: Overlay, figureType: EventOverlayInfoFigureType, figureKey: string, figureIndex: number, attrsIndex: number): MouseTouchEventCallback {
    return (event: MouseTouchEvent) => {
      const pane = this.getWidget().getPane()
      const paneId = pane.getId()
      const overlayStore = pane.getChart().getChartStore().getOverlayStore()
      overlay.startPressedMove(this._coordinateToPoint(overlay, event))
      overlay.onPressedMoveStart?.({ overlay, figureIndex, figureKey, ...event })
      overlayStore.setPressedInstanceInfo({ paneId, instance: overlay, figureType, figureKey, figureIndex, attrsIndex })
      return true
    }
  }

  private _figureMouseClickEvent (overlay: Overlay, figureType: EventOverlayInfoFigureType, figureKey: string, figureIndex: number, attrsIndex: number): MouseTouchEventCallback {
    return (event: MouseTouchEvent) => {
      const pane = this.getWidget().getPane()
      const paneId = pane.getId()
      const overlayStore = pane.getChart().getChartStore().getOverlayStore()
      overlayStore.setClickInstanceInfo({ paneId, instance: overlay, figureType, figureKey, figureIndex, attrsIndex }, event)
      return true
    }
  }

  private _figureMouseDoubleClickEvent (overlay: Overlay, _figureType: EventOverlayInfoFigureType, figureKey: string, figureIndex: number, _attrsIndex: number): MouseTouchEventCallback {
    return (event: MouseTouchEvent) => {
      overlay.onDoubleClick?.({ ...event, figureIndex, figureKey, overlay })
      return true
    }
  }

  private _figureMouseRightClickEvent (overlay: Overlay, _figureType: EventOverlayInfoFigureType, figureKey: string, figureIndex: number, _attrsIndex: number): MouseTouchEventCallback {
    return (event: MouseTouchEvent) => {
      if (!(overlay.onRightClick?.({ overlay, figureIndex, figureKey, ...event }) ?? false)) {
        const pane = this.getWidget().getPane()
        const overlayStore = pane.getChart().getChartStore().getOverlayStore()
        overlayStore.removeInstance(overlay)
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
      const xAxis = chart.getXAxisPane().getAxisComponent()
      const dataIndex = xAxis.convertFromPixel(coordinate.x)
      const timestamp = timeScaleStore.dataIndexToTimestamp(dataIndex) ?? undefined
      point.dataIndex = dataIndex
      point.timestamp = timestamp
    }
    if (this.coordinateToPointValueFlag()) {
      const yAxis = pane.getAxisComponent()
      let value = yAxis.convertFromPixel(coordinate.y)
      if (overlay.mode !== OverlayMode.Normal && paneId === PaneIdConstants.CANDLE && isNumber(point.dataIndex)) {
        const kLineData = timeScaleStore.getDataByDataIndex(point.dataIndex)
        if (kLineData !== null) {
          const modeSensitivity = overlay.modeSensitivity
          if (value > kLineData.high) {
            if (overlay.mode === OverlayMode.WeakMagnet) {
              const highY = yAxis.convertToPixel(kLineData.high)
              const buffValue = yAxis.convertFromPixel(highY - modeSensitivity)
              if (value < buffValue) {
                value = kLineData.high
              }
            } else {
              value = kLineData.high
            }
          } else if (value < kLineData.low) {
            if (overlay.mode === OverlayMode.WeakMagnet) {
              const lowY = yAxis.convertToPixel(kLineData.low)
              const buffValue = yAxis.convertFromPixel(lowY - modeSensitivity)
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

  override dispatchEvent (name: EventName, event: MouseTouchEvent, other?: number): boolean {
    if (this.getWidget().getPane().getChart().getChartStore().getOverlayStore().isDrawing()) {
      return this.onEvent(name, event, other)
    }
    return super.dispatchEvent(name, event, other)
  }

  override checkEventOn (): boolean {
    return true
  }

  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const paneId = pane.getId()
    const chart = pane.getChart()
    const yAxis = pane.getAxisComponent() as unknown as Nullable<YAxis>
    const xAxis = chart.getXAxisPane().getAxisComponent()
    const bounding = widget.getBounding()
    const chartStore = chart.getChartStore()
    const customApi = chartStore.getCustomApi()
    const thousandsSeparator = chartStore.getThousandsSeparator()
    const decimalFoldThreshold = chartStore.getDecimalFoldThreshold()
    const timeScaleStore = chartStore.getTimeScaleStore()
    const dateTimeFormat = timeScaleStore.getDateTimeFormat()
    const barSpace = timeScaleStore.getBarSpace()
    const precision = chartStore.getPrecision()
    const defaultStyles = chartStore.getStyles().overlay
    const overlayStore = chartStore.getOverlayStore()
    const hoverInstanceInfo = overlayStore.getHoverInstanceInfo()
    const clickInstanceInfo = overlayStore.getClickInstanceInfo()
    const overlays = this.getCompleteOverlays(overlayStore, paneId)
    const paneIndicators = chartStore.getIndicatorStore().getInstances(paneId)
    const overlayPrecision = paneIndicators.reduce((prev, indicator) => {
      const precision = indicator.precision
      prev[indicator.name] = precision
      prev.max = Math.max(prev.max, precision)
      prev.min = Math.min(prev.min, precision)
      prev.excludePriceVolumeMax = Math.max(prev.excludePriceVolumeMax, precision)
      prev.excludePriceVolumeMin = Math.min(prev.excludePriceVolumeMin, precision)
      return prev
    }, {
      ...precision,
      max: Math.max(precision.price, precision.volume),
      min: Math.min(precision.price, precision.volume),
      excludePriceVolumeMax: Number.MIN_SAFE_INTEGER,
      excludePriceVolumeMin: Number.MAX_SAFE_INTEGER
    })
    overlays.forEach(overlay => {
      if (overlay.visible) {
        this._drawOverlay(
          ctx, overlay, bounding, barSpace, overlayPrecision,
          dateTimeFormat, customApi, thousandsSeparator, decimalFoldThreshold,
          defaultStyles, xAxis, yAxis,
          hoverInstanceInfo, clickInstanceInfo, timeScaleStore
        )
      }
    })
    const progressInstanceInfo = overlayStore.getProgressInstanceInfo()
    if (progressInstanceInfo !== null) {
      const overlay = this.getProgressOverlay(progressInstanceInfo, paneId)
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      if (overlay !== null && overlay.visible) {
        this._drawOverlay(
          ctx, overlay, bounding, barSpace,
          overlayPrecision, dateTimeFormat, customApi, thousandsSeparator, decimalFoldThreshold,
          defaultStyles, xAxis, yAxis,
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
    precision: OverlayPrecision,
    dateTimeFormat: Intl.DateTimeFormat,
    customApi: CustomApi,
    thousandsSeparator: string,
    decimalFoldThreshold: number,
    defaultStyles: OverlayStyle,
    xAxis: Nullable<XAxis>,
    yAxis: Nullable<YAxis>,
    hoverInstanceInfo: EventOverlayInfo,
    clickInstanceInfo: EventOverlayInfo,
    timeScaleStore: TimeScaleStore
  ): void {
    const { points } = overlay
    const coordinates = points.map(point => {
      let dataIndex = point.dataIndex
      if (isNumber(point.timestamp)) {
        dataIndex = timeScaleStore.timestampToDataIndex(point.timestamp)
      }
      const coordinate = { x: 0, y: 0 }
      if (isNumber(dataIndex)) {
        coordinate.x = xAxis?.convertToPixel(dataIndex) ?? 0
      }
      if (isNumber(point.value)) {
        coordinate.y = yAxis?.convertToPixel(point.value) ?? 0
      }
      return coordinate
    })
    if (coordinates.length > 0) {
      const figures = new Array<OverlayFigure>().concat(
        this.getFigures(
          overlay, coordinates, bounding, barSpace, precision, thousandsSeparator, decimalFoldThreshold, dateTimeFormat, defaultStyles, xAxis, yAxis
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
      thousandsSeparator,
      decimalFoldThreshold,
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const attrsArray = [].concat(attrs)
      attrsArray.forEach((ats, attrsIndex) => {
        const events = this._createFigureEvents(overlay, EventOverlayInfoFigureType.Other, figure.key ?? '', figureIndex, attrsIndex, ignoreEvent)
        const ss = { ...defaultStyles[type], ...overlay.styles?.[type], ...styles }
        this.createFigure({
          name: type, attrs: ats, styles: ss
        }, events)?.draw(ctx)
      })
    })
  }

  protected getCompleteOverlays (overlayStore: OverlayStore, paneId: string): Overlay[] {
    return overlayStore.getInstances(paneId)
  }

  protected getProgressOverlay (info: ProgressOverlayInfo, paneId: string): Nullable<Overlay> {
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
    precision: OverlayPrecision,
    thousandsSeparator: string,
    decimalFoldThreshold: number,
    dateTimeFormat: Intl.DateTimeFormat,
    defaultStyles: OverlayStyle,
    xAxis: Nullable<XAxis>,
    yAxis: Nullable<YAxis>
  ): OverlayFigure | OverlayFigure[] {
    return overlay.createPointFigures?.({ overlay, coordinates, bounding, barSpace, precision, thousandsSeparator, decimalFoldThreshold, dateTimeFormat, defaultStyles, xAxis, yAxis }) ?? []
  }

  protected drawDefaultFigures (
    ctx: CanvasRenderingContext2D,
    overlay: Overlay,
    coordinates: Coordinate[],
    _bounding: Bounding,
    _precision: OverlayPrecision,
    _dateTimeFormat: Intl.DateTimeFormat,
    _customApi: CustomApi,
    _thousandsSeparator: string,
    _drawDefaultFigures: number,
    defaultStyles: OverlayStyle,
    _xAxis: Nullable<XAxis>,
    _yAxis: Nullable<YAxis>,
    hoverInstanceInfo: EventOverlayInfo,
    clickInstanceInfo: EventOverlayInfo
  ): void {
    if (overlay.needDefaultPointFigure) {
      if (
        (hoverInstanceInfo.instance?.id === overlay.id && hoverInstanceInfo.figureType !== EventOverlayInfoFigureType.None) ||
        (clickInstanceInfo.instance?.id === overlay.id && clickInstanceInfo.figureType !== EventOverlayInfoFigureType.None)
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
            hoverInstanceInfo.figureType === EventOverlayInfoFigureType.Point &&
            hoverInstanceInfo.figureIndex === index
          ) {
            radius = pointStyles.activeRadius
            color = pointStyles.activeColor
            borderColor = pointStyles.activeBorderColor
            borderSize = pointStyles.activeBorderSize
          }
          this.createFigure({
            name: 'circle',
            attrs: { x, y, r: radius + borderSize },
            styles: { color: borderColor }
          }, this._createFigureEvents(overlay, EventOverlayInfoFigureType.Point, `${OVERLAY_FIGURE_KEY_PREFIX}point_${index}`, index, 0))?.draw(ctx)
          this.createFigure({
            name: 'circle',
            attrs: { x, y, r: radius },
            styles: { color }
          })?.draw(ctx)
        })
      }
    }
  }
}
