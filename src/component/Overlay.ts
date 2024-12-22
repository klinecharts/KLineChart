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
import { type OverlayStyle } from '../common/Styles'
import { type MouseTouchEvent } from '../common/SyntheticEvent'
import { clone, isNumber, isString, merge } from '../common/utils/typeChecks'

import type TimeScaleStore from '../store/TimeScaleStore'

import { type XAxis } from './XAxis'
import { type YAxis } from './YAxis'

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
  attrs: any
  styles?: any
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
  extendData: any

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
export type OverlayCreate = ExcludePickPartial<Omit<Overlay, 'paneId' | 'currentStep' | 'totalStep' | 'createPointFigures' | 'createXAxisFigures' | 'createYAxisFigures' | 'performEventPressedMove' | 'performEventMoveForDrawing'>, 'name'>
export type OverlayRemove = Partial<Pick<Overlay, 'id' | 'groupId' | 'name'>>
export type OverlayInnerConstructor = new () => OverlayImp
export type OverlayConstructor = new () => Overlay

const OVERLAY_DRAW_STEP_START = 1
const OVERLAY_DRAW_STEP_FINISHED = -1

export const OVERLAY_ID_PREFIX = 'overlay_'

export const OVERLAY_FIGURE_KEY_PREFIX = 'overlay_figure_'

export default abstract class OverlayImp implements Overlay {
  id: string
  groupId: string
  paneId: string
  name: string
  totalStep: number
  currentStep: number = OVERLAY_DRAW_STEP_START
  needDefaultPointFigure: boolean
  needDefaultXAxisFigure: boolean
  needDefaultYAxisFigure: boolean
  lock: boolean
  visible: boolean
  zLevel: number
  mode: OverlayMode
  modeSensitivity: number
  points: Array<Partial<Point>> = []
  extendData: any
  styles: Nullable<DeepPartial<OverlayStyle>>
  createPointFigures: Nullable<OverlayCreateFiguresCallback>
  createXAxisFigures: Nullable<OverlayCreateFiguresCallback>
  createYAxisFigures: Nullable<OverlayCreateFiguresCallback>
  performEventPressedMove: Nullable<(params: OverlayPerformEventParams) => void>
  performEventMoveForDrawing: Nullable<(params: OverlayPerformEventParams) => void>
  onDrawStart: Nullable<OverlayEventCallback>
  onDrawing: Nullable<OverlayEventCallback>
  onDrawEnd: Nullable<OverlayEventCallback>
  onClick: Nullable<OverlayEventCallback>
  onDoubleClick: Nullable<OverlayEventCallback>
  onRightClick: Nullable<OverlayEventCallback>
  onPressedMoveStart: Nullable<OverlayEventCallback>
  onPressedMoving: Nullable<OverlayEventCallback>
  onPressedMoveEnd: Nullable<OverlayEventCallback>
  onMouseEnter: Nullable<OverlayEventCallback>
  onMouseLeave: Nullable<OverlayEventCallback>
  onRemoved: Nullable<OverlayEventCallback>
  onSelected: Nullable<OverlayEventCallback>
  onDeselected: Nullable<OverlayEventCallback>

  private _prevPressedPoint: Nullable<Partial<Point>> = null
  private _prevPressedPoints: Array<Partial<Point>> = []

  constructor (overlay: OverlayTemplate) {
    const {
      mode, modeSensitivity, extendData, styles,
      name, totalStep, lock, visible, zLevel,
      needDefaultPointFigure, needDefaultXAxisFigure, needDefaultYAxisFigure,
      createPointFigures, createXAxisFigures, createYAxisFigures,
      performEventPressedMove, performEventMoveForDrawing,
      onDrawStart, onDrawing, onDrawEnd,
      onClick, onDoubleClick, onRightClick,
      onPressedMoveStart, onPressedMoving, onPressedMoveEnd,
      onMouseEnter, onMouseLeave, onRemoved,
      onSelected, onDeselected
    } = overlay
    this.name = name
    this.totalStep = (!isNumber(totalStep) || totalStep < 2) ? 1 : totalStep
    this.lock = lock ?? false
    this.visible = visible ?? true
    this.zLevel = zLevel ?? 0
    this.needDefaultPointFigure = needDefaultPointFigure ?? false
    this.needDefaultXAxisFigure = needDefaultXAxisFigure ?? false
    this.needDefaultYAxisFigure = needDefaultYAxisFigure ?? false
    this.mode = mode ?? OverlayMode.Normal
    this.modeSensitivity = modeSensitivity ?? 8
    this.extendData = extendData
    this.styles = clone(styles ?? {})
    this.createPointFigures = createPointFigures ?? null
    this.createXAxisFigures = createXAxisFigures ?? null
    this.createYAxisFigures = createYAxisFigures ?? null
    this.performEventPressedMove = performEventPressedMove ?? null
    this.performEventMoveForDrawing = performEventMoveForDrawing ?? null
    this.onDrawStart = onDrawStart ?? null
    this.onDrawing = onDrawing ?? null
    this.onDrawEnd = onDrawEnd ?? null
    this.onClick = onClick ?? null
    this.onDoubleClick = onDoubleClick ?? null
    this.onRightClick = onRightClick ?? null
    this.onPressedMoveStart = onPressedMoveStart ?? null
    this.onPressedMoving = onPressedMoving ?? null
    this.onPressedMoveEnd = onPressedMoveEnd ?? null
    this.onMouseEnter = onMouseEnter ?? null
    this.onMouseLeave = onMouseLeave ?? null
    this.onRemoved = onRemoved ?? null
    this.onSelected = onSelected ?? null
    this.onDeselected = onDeselected ?? null
  }

  setId (id: string): boolean {
    if (!isString(this.id)) {
      this.id = id
      return true
    }
    return false
  }

  setGroupId (groupId: string): boolean {
    if (!isString(this.groupId)) {
      this.groupId = groupId
      return true
    }
    return false
  }

  setPaneId (paneId: string): void {
    this.paneId = paneId
  }

  setExtendData (extendData: any): boolean {
    if (extendData !== this.extendData) {
      this.extendData = extendData
      return true
    }
    return false
  }

  setStyles (styles: DeepPartial<OverlayStyle>): boolean {
    merge(this.styles, styles)
    return true
  }

  setPoints (points: Array<Partial<Point>>): boolean {
    if (points.length > 0) {
      let repeatTotalStep: number
      this.points = [...points]
      if (points.length >= this.totalStep - 1) {
        this.currentStep = OVERLAY_DRAW_STEP_FINISHED
        repeatTotalStep = this.totalStep - 1
      } else {
        this.currentStep = points.length + 1
        repeatTotalStep = points.length
      }
      // Prevent wrong drawing due to wrong points
      if (this.performEventMoveForDrawing !== null) {
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
      if (this.currentStep === OVERLAY_DRAW_STEP_FINISHED && this.performEventPressedMove !== null) {
        this.performEventPressedMove({
          currentStep: this.currentStep,
          mode: this.mode,
          points: this.points,
          performPointIndex: this.points.length - 1,
          performPoint: this.points[this.points.length - 1]
        })
      }
      return true
    }
    return false
  }

  setLock (lock: boolean): boolean {
    if (this.lock !== lock) {
      this.lock = lock
      return true
    }
    return false
  }

  setVisible (visible: boolean): boolean {
    if (this.visible !== visible) {
      this.visible = visible
      return true
    }
    return false
  }

  setZLevel (zLevel: number): boolean {
    if (this.zLevel !== zLevel) {
      this.zLevel = zLevel
      return true
    }
    return false
  }

  setMode (mode: OverlayMode): boolean {
    if (this.mode !== mode) {
      this.mode = mode
      return true
    }
    return false
  }

  setModeSensitivity (modeSensitivity: number): boolean {
    if (this.modeSensitivity !== modeSensitivity) {
      this.modeSensitivity = modeSensitivity
      return true
    }
    return false
  }

  setOnDrawStartCallback (callback: Nullable<OverlayEventCallback>): boolean {
    if (this.onDrawStart !== callback) {
      this.onDrawStart = callback
      return true
    }
    return false
  }

  setOnDrawingCallback (callback: Nullable<OverlayEventCallback>): boolean {
    if (this.onDrawing !== callback) {
      this.onDrawing = callback
      return true
    }
    return false
  }

  setOnDrawEndCallback (callback: Nullable<OverlayEventCallback>): boolean {
    if (this.onDrawEnd !== callback) {
      this.onDrawEnd = callback
      return true
    }
    return false
  }

  setOnClickCallback (callback: Nullable<OverlayEventCallback>): boolean {
    if (this.onClick !== callback) {
      this.onClick = callback
      return true
    }
    return false
  }

  setOnDoubleClickCallback (callback: Nullable<OverlayEventCallback>): boolean {
    if (this.onDoubleClick !== callback) {
      this.onDoubleClick = callback
      return true
    }
    return false
  }

  setOnRightClickCallback (callback: Nullable<OverlayEventCallback>): boolean {
    if (this.onRightClick !== callback) {
      this.onRightClick = callback
      return true
    }
    return false
  }

  setOnPressedMoveStartCallback (callback: Nullable<OverlayEventCallback>): boolean {
    if (this.onPressedMoveStart !== callback) {
      this.onPressedMoveStart = callback
      return true
    }
    return false
  }

  setOnPressedMovingCallback (callback: Nullable<OverlayEventCallback>): boolean {
    if (this.onPressedMoving !== callback) {
      this.onPressedMoving = callback
      return true
    }
    return false
  }

  setOnPressedMoveEndCallback (callback: Nullable<OverlayEventCallback>): boolean {
    if (this.onPressedMoveEnd !== callback) {
      this.onPressedMoveEnd = callback
      return true
    }
    return false
  }

  setOnMouseEnterCallback (callback: Nullable<OverlayEventCallback>): boolean {
    if (this.onMouseEnter !== callback) {
      this.onMouseEnter = callback
      return true
    }
    return false
  }

  setOnMouseLeaveCallback (callback: Nullable<OverlayEventCallback>): boolean {
    if (this.onMouseLeave !== callback) {
      this.onMouseLeave = callback
      return true
    }
    return false
  }

  setOnRemovedCallback (callback: Nullable<OverlayEventCallback>): boolean {
    if (this.onRemoved !== callback) {
      this.onRemoved = callback
      return true
    }
    return false
  }

  setOnSelectedCallback (callback: Nullable<OverlayEventCallback>): boolean {
    if (this.onSelected !== callback) {
      this.onSelected = callback
      return true
    }
    return false
  }

  setOnDeselectedCallback (callback: Nullable<OverlayEventCallback>): boolean {
    if (this.onDeselected !== callback) {
      this.onDeselected = callback
      return true
    }
    return false
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

  eventPressedOtherMove (point: Partial<Point>, timeScaleStore: TimeScaleStore): void {
    if (this._prevPressedPoint !== null) {
      let difDataIndex: number
      if (isNumber(point.dataIndex) && isNumber(this._prevPressedPoint.dataIndex)) {
        difDataIndex = point.dataIndex - this._prevPressedPoint.dataIndex
      }
      let difValue: number
      if (isNumber(point.value) && isNumber(this._prevPressedPoint.value)) {
        difValue = point.value - this._prevPressedPoint.value
      }
      this.points = this._prevPressedPoints.map(p => {
        if (isNumber(p.timestamp)) {
          p.dataIndex = timeScaleStore.timestampToDataIndex(p.timestamp)
        }
        const newPoint = { ...p }
        if (isNumber(difDataIndex) && isNumber(p.dataIndex)) {
          newPoint.dataIndex = p.dataIndex + difDataIndex
          newPoint.timestamp = timeScaleStore.dataIndexToTimestamp(newPoint.dataIndex) ?? undefined
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
