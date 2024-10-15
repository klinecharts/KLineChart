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
import type DeepPartial from '../common/DeepPartial'
import type ExcludePickPartial from '../common/ExcludePickPartial'
import type Point from '../common/Point'
import type Coordinate from '../common/Coordinate'
import type Bounding from '../common/Bounding'
import type BarSpace from '../common/BarSpace'
import type Precision from '../common/Precision'
import type { OverlayStyle } from '../common/Styles'
import type { MouseTouchEvent } from '../common/SyntheticEvent'
import { clone, isArray, isFunction, isNumber, isString, isValid, merge } from '../common/utils/typeChecks'

import type { XAxis } from './XAxis'
import type { YAxis } from './YAxis'
import type ChartStore from '../Store'

export enum OverlayMode {
  Normal = 'normal',
  WeakMagnet = 'weak_magnet',
  StrongMagnet = 'strong_magnet'
}

export interface OverlayPerformEventParams {
  currentStep: number
  mode: OverlayMode
  points: Array<Partial<Point>>
  performPointIndex: number
  performPoint: Partial<Point>
}

export type OverlayFigureIgnoreEventType = 'mouseClickEvent' | 'mouseRightClickEvent' | 'tapEvent' | 'doubleTapEvent' | 'mouseDownEvent' | 'touchStartEvent' | 'mouseMoveEvent' | 'touchMoveEvent' | 'mouseDoubleClickEvent'

export function getAllOverlayFigureIgnoreEventTypes (): OverlayFigureIgnoreEventType[] {
  return [
    'mouseClickEvent',
    'mouseDoubleClickEvent',
    'mouseRightClickEvent',
    'tapEvent',
    'doubleTapEvent',
    'mouseDownEvent',
    'touchStartEvent',
    'mouseMoveEvent',
    'touchMoveEvent'
  ]
}

export interface OverlayFigure {
  key?: string
  type: string
  attrs: unknown
  styles?: unknown
  ignoreEvent?: boolean | OverlayFigureIgnoreEventType[]
}

export interface OverlayPrecision extends Precision {
  max: number
  min: number
  excludePriceVolumeMax: number
  excludePriceVolumeMin: number
  [key: string]: number
}

export interface OverlayCreateFiguresCallbackParams {
  overlay: Overlay
  coordinates: Coordinate[]
  bounding: Bounding
  barSpace: BarSpace
  precision: OverlayPrecision
  thousandsSeparator: string
  decimalFoldThreshold: number
  dateTimeFormat: Intl.DateTimeFormat
  defaultStyles: OverlayStyle
  xAxis: Nullable<XAxis>
  yAxis: Nullable<YAxis>
}

export interface OverlayEvent extends Partial<MouseTouchEvent> {
  figureKey?: string
  figureIndex?: number
  overlay: Overlay
}

export type OverlayEventCallback = (event: OverlayEvent) => boolean

export type OverlayCreateFiguresCallback = (params: OverlayCreateFiguresCallbackParams) => OverlayFigure | OverlayFigure[]

export interface Overlay {
  /**
   * Unique identification
   */
  id: string

  /**
   * Group id
   */
  groupId: string

  /**
   * Pane id
   */
  paneId: string

  /**
   * Name
   */
  name: string

  /**
   * Total number of steps required to complete mouse operation
   */
  totalStep: number

  /**
   * Current step
   */
  currentStep: number

  /**
   * Whether it is locked. When it is true, it will not respond to events
   */
  lock: boolean

  /**
   * Whether the overlay is visible
   */
  visible: boolean

  /**
   * Draw level
   */
  zLevel: number

  /**
   * Whether the default figure corresponding to the point is required
   */
  needDefaultPointFigure: boolean

  /**
   * Whether the default figure on the Y axis is required
   */
  needDefaultXAxisFigure: boolean

  /**
   * Whether the default figure on the X axis is required
   */
  needDefaultYAxisFigure: boolean

  /**
   * Mode
   */
  mode: OverlayMode

  /**
   * When mode is weak_magnet is the response distance
   */
  modeSensitivity: number

  /**
   * Time and value information
   */
  points: Array<Partial<Point>>

  /**
   * Extended Data
   */
  extendData: unknown

  /**
   * The style information and format are consistent with the overlay in the unified configuration
   */
  styles: Nullable<DeepPartial<OverlayStyle>>

  /**
   * Create figures corresponding to points
   */
  createPointFigures: Nullable<OverlayCreateFiguresCallback>

  /**
   * Create figures on the Y axis
   */
  createXAxisFigures: Nullable<OverlayCreateFiguresCallback>

  /**
   * Create figures on the X axis
   */
  createYAxisFigures: Nullable<OverlayCreateFiguresCallback>

  /**
   * Special handling callbacks when pressing events
   */
  performEventPressedMove: Nullable<(params: OverlayPerformEventParams) => void>

  /**
   * In drawing, special handling callback when moving events
   */
  performEventMoveForDrawing: Nullable<(params: OverlayPerformEventParams) => void>

  /**
   * Start drawing event
   */
  onDrawStart: Nullable<OverlayEventCallback>

  /**
   * In drawing event
   */
  onDrawing: Nullable<OverlayEventCallback>

  /**
   * Draw End Event
   */
  onDrawEnd: Nullable<OverlayEventCallback>

  /**
   * Click event
   */
  onClick: Nullable<OverlayEventCallback>

  /**
   * Double Click event
   */
  onDoubleClick: Nullable<OverlayEventCallback>

  /**
   * Right click event
   */
  onRightClick: Nullable<OverlayEventCallback>

  /**
   * Pressed move start event
   */
  onPressedMoveStart: Nullable<OverlayEventCallback>

  /**
   * Pressed moving event
   */
  onPressedMoving: Nullable<OverlayEventCallback>

  /**
   * Pressed move end event
   */
  onPressedMoveEnd: Nullable<OverlayEventCallback>

  /**
   * Mouse enter event
   */
  onMouseEnter: Nullable<OverlayEventCallback>

  /**
   * Mouse leave event
   */
  onMouseLeave: Nullable<OverlayEventCallback>

  /**
   * Removed event
   */
  onRemoved: Nullable<OverlayEventCallback>

  /**
   * Selected event
   */
  onSelected: Nullable<OverlayEventCallback>

  /**
   * Deselected event
   */
  onDeselected: Nullable<OverlayEventCallback>
}

export type OverlayTemplate = ExcludePickPartial<Omit<Overlay, 'id' | 'groupId' | 'paneId' | 'points' | 'currentStep'>, 'name'>

export type OverlayCreate = ExcludePickPartial<Omit<Overlay, 'currentStep' | 'totalStep' | 'createPointFigures' | 'createXAxisFigures' | 'createYAxisFigures' | 'performEventPressedMove' | 'performEventMoveForDrawing'>, 'name'>
export type OverlayFilter = Partial<Pick<Overlay, 'id' | 'groupId' | 'name' | 'paneId'>>
export type OverlayInnerConstructor = new () => OverlayImp
export type OverlayConstructor = new () => Overlay

const OVERLAY_DRAW_STEP_START = 1
const OVERLAY_DRAW_STEP_FINISHED = -1

export const OVERLAY_ID_PREFIX = 'overlay_'

export const OVERLAY_FIGURE_KEY_PREFIX = 'overlay_figure_'

export default class OverlayImp implements Overlay {
  id: string
  groupId = ''
  paneId: string
  name: string
  totalStep = 1
  currentStep = OVERLAY_DRAW_STEP_START
  lock = false
  visible = true
  zLevel = 0
  needDefaultPointFigure = false
  needDefaultXAxisFigure = false
  needDefaultYAxisFigure = false
  mode = OverlayMode.Normal
  modeSensitivity = 8
  points: Array<Partial<Point>> = []
  extendData: unknown = null
  styles: Nullable<DeepPartial<OverlayStyle>> = null
  createPointFigures: Nullable<OverlayCreateFiguresCallback> = null
  createXAxisFigures: Nullable<OverlayCreateFiguresCallback> = null
  createYAxisFigures: Nullable<OverlayCreateFiguresCallback> = null
  performEventPressedMove: Nullable<(params: OverlayPerformEventParams) => void> = null
  performEventMoveForDrawing: Nullable<(params: OverlayPerformEventParams) => void> = null
  onDrawStart: Nullable<OverlayEventCallback> = null
  onDrawing: Nullable<OverlayEventCallback> = null
  onDrawEnd: Nullable<OverlayEventCallback> = null
  onClick: Nullable<OverlayEventCallback> = null
  onDoubleClick: Nullable<OverlayEventCallback> = null
  onRightClick: Nullable<OverlayEventCallback> = null
  onPressedMoveStart: Nullable<OverlayEventCallback> = null
  onPressedMoving: Nullable<OverlayEventCallback> = null
  onPressedMoveEnd: Nullable<OverlayEventCallback> = null
  onMouseEnter: Nullable<OverlayEventCallback> = null
  onMouseLeave: Nullable<OverlayEventCallback> = null
  onRemoved: Nullable<OverlayEventCallback> = null
  onSelected: Nullable<OverlayEventCallback> = null
  onDeselected: Nullable<OverlayEventCallback> = null

  private _prevOverlay: Overlay

  private _prevPressedPoint: Nullable<Partial<Point>> = null
  private _prevPressedPoints: Array<Partial<Point>> = []

  constructor (overlay: OverlayTemplate) {
    this.override(overlay)
  }

  override (overlay: Partial<Overlay>): void {
    this._prevOverlay = clone(this)

    const {
      id,
      name,
      currentStep: _,
      points,
      styles,
      ...others
    } = overlay

    merge(this, others)

    if (!isString(this.name)) {
      this.name = name ?? ''
    }

    if (!isString(this.id) && isString(id)) {
      this.id = id
    }

    if (isValid(styles)) {
      this.styles ??= {}
      merge(this.styles, styles)
    }

    if (isArray(points) && points.length > 0) {
      let repeatTotalStep = 0
      this.points = [...points]
      if (points.length >= this.totalStep - 1) {
        this.currentStep = OVERLAY_DRAW_STEP_FINISHED
        repeatTotalStep = this.totalStep - 1
      } else {
        this.currentStep = points.length + 1
        repeatTotalStep = points.length
      }
      // Prevent wrong drawing due to wrong points
      if (isFunction(this.performEventMoveForDrawing)) {
        for (let i = 0; i < repeatTotalStep; i++) {
          this.performEventMoveForDrawing({
            currentStep: i + 2,
            mode: this.mode,
            points: this.points,
            performPointIndex: i,
            performPoint: this.points[i]
          })
        }
      }

      if (this.currentStep === OVERLAY_DRAW_STEP_FINISHED) {
        this.performEventPressedMove?.({
          currentStep: this.currentStep,
          mode: this.mode,
          points: this.points,
          performPointIndex: this.points.length - 1,
          performPoint: this.points[this.points.length - 1]
        })
      }
    }
  }

  shouldUpdate (): { draw: boolean, sort: boolean } {
    const sort = this._prevOverlay.zLevel !== this.zLevel
    const draw = sort ||
      JSON.stringify(this._prevOverlay) !== JSON.stringify(this.points) ||
      this._prevOverlay.visible !== this.visible ||
      this._prevOverlay.extendData !== this.extendData ||
      this._prevOverlay.styles !== this.styles

    return { sort, draw }
  }

  nextStep (): void {
    if (this.currentStep === this.totalStep - 1) {
      this.currentStep = OVERLAY_DRAW_STEP_FINISHED
    } else {
      this.currentStep++
    }
  }

  forceComplete (): void {
    this.currentStep = OVERLAY_DRAW_STEP_FINISHED
  }

  isDrawing (): boolean {
    return this.currentStep !== OVERLAY_DRAW_STEP_FINISHED
  }

  isStart (): boolean {
    return this.currentStep === OVERLAY_DRAW_STEP_START
  }

  eventMoveForDrawing (point: Partial<Point>): void {
    const pointIndex = this.currentStep - 1
    const newPoint: Partial<Point> = {}
    if (isNumber(point.timestamp)) {
      newPoint.timestamp = point.timestamp
    }
    if (isNumber(point.dataIndex)) {
      newPoint.dataIndex = point.dataIndex
    }
    if (isNumber(point.value)) {
      newPoint.value = point.value
    }
    this.points[pointIndex] = newPoint
    this.performEventMoveForDrawing?.({
      currentStep: this.currentStep,
      mode: this.mode,
      points: this.points,
      performPointIndex: pointIndex,
      performPoint: newPoint
    })
  }

  eventPressedPointMove (point: Partial<Point>, pointIndex: number): void {
    if (isNumber(point.dataIndex)) {
      this.points[pointIndex].dataIndex = point.dataIndex
      this.points[pointIndex].timestamp = point.timestamp
    }
    if (isNumber(point.value)) {
      this.points[pointIndex].value = point.value
    }
    this.performEventPressedMove?.({
      currentStep: this.currentStep,
      points: this.points,
      mode: this.mode,
      performPointIndex: pointIndex,
      performPoint: this.points[pointIndex]
    })
  }

  startPressedMove (point: Partial<Point>): void {
    this._prevPressedPoint = { ...point }
    this._prevPressedPoints = clone(this.points)
  }

  eventPressedOtherMove (point: Partial<Point>, chartStore: ChartStore): void {
    if (this._prevPressedPoint !== null) {
      let difDataIndex: Nullable<number> = null
      if (isNumber(point.dataIndex) && isNumber(this._prevPressedPoint.dataIndex)) {
        difDataIndex = point.dataIndex - this._prevPressedPoint.dataIndex
      }
      let difValue: Nullable<number> = null
      if (isNumber(point.value) && isNumber(this._prevPressedPoint.value)) {
        difValue = point.value - this._prevPressedPoint.value
      }
      this.points = this._prevPressedPoints.map(p => {
        if (isNumber(p.timestamp)) {
          p.dataIndex = chartStore.timestampToDataIndex(p.timestamp)
        }
        const newPoint = { ...p }
        if (isNumber(difDataIndex) && isNumber(p.dataIndex)) {
          newPoint.dataIndex = p.dataIndex + difDataIndex
          newPoint.timestamp = chartStore.dataIndexToTimestamp(newPoint.dataIndex) ?? undefined
        }
        if (isNumber(difValue) && isNumber(p.value)) {
          newPoint.value = p.value + difValue
        }
        return newPoint
      })
    }
  }

  static extend (template: OverlayTemplate): OverlayInnerConstructor {
    class Custom extends OverlayImp {
      constructor () {
        super(template)
      }
    }
    return Custom
  }
}
