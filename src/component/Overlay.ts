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
import DeepPartial from '../common/DeepPartial'
import ExcludePickPartial from '../common/ExcludePickPartial'
import Point from '../common/Point'
import Coordinate from '../common/Coordinate'
import Bounding from '../common/Bounding'
import BarSpace from '../common/BarSpace'
import Precision from '../common/Precision'
import { OverlayStyle } from '../common/Options'
import { MouseTouchEvent } from '../common/MouseTouchEventHandler'

import { clone } from '../common/utils/typeChecks'

import TimeScaleStore from '../store/TimeScaleStore'

import { XAxis } from './XAxis'
import { YAxis } from './YAxis'

export const enum OverlayMode {
  NORMAL = 'normal',
  WEAK_MAGNET = 'weak_magnet',
  STRONG_MAGNET = 'strong_magnet'
}

export interface OverlayPerformEventParams {
  currentStep: number
  mode: OverlayMode
  points: Array<PickPartial<Point, 'timestamp'>>
  performPointIndex: number
  performPoint: PickPartial<Point, 'timestamp'>
}

export interface OverlayFigure {
  key?: string
  type: string
  attrs: any | any[]
  styles?: any
  ignoreEvent?: boolean
}

export interface OverlayCreateFiguresCallbackParams {
  overlay: Overlay
  coordinates: Coordinate[]
  bounding: Bounding
  barSpace: BarSpace
  precision: Precision
  dateTimeFormat: Intl.DateTimeFormat
  defaultStyles: OverlayStyle
  xAxis: TypeOrNull<XAxis>
  yAxis: TypeOrNull<YAxis>
}

export interface OverlayEvent extends Partial<MouseTouchEvent> {
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
   * Time and value information
   */
  points: Array<PickPartial<Point, 'timestamp'>>

  /**
   * Extended Data
   */
  extendData: any

  /**
   * The style information and format are consistent with the overlay in the unified configuration
   */
  styles: TypeOrNull<DeepPartial<OverlayStyle>>

  /**
   * Create figures corresponding to points
   */
  createPointFigures: TypeOrNull<OverlayCreateFiguresCallback>

  /**
   * Create figures on the Y axis
   */
  createXAxisFigures: TypeOrNull<OverlayCreateFiguresCallback>

  /**
   * Create figures on the X axis
   */
  createYAxisFigures: TypeOrNull<OverlayCreateFiguresCallback>

  /**
   * Special handling callbacks when pressing events
   */
  performEventPressedMove: TypeOrNull<(params: OverlayPerformEventParams) => void>

  /**
   * In drawing, special handling callback when moving events
   */
  performEventMoveForDrawing: TypeOrNull<(params: OverlayPerformEventParams) => void>

  /**
   * Start drawing event
   */
  onDrawStart: TypeOrNull<OverlayEventCallback>

  /**
   * In drawing event
   */
  onDrawing: TypeOrNull<OverlayEventCallback>

  /**
   * Draw End Event
   */
  onDrawEnd: TypeOrNull<OverlayEventCallback>

  /**
   * Click event
   */
  onClick: TypeOrNull<OverlayEventCallback>

  /**
   * Right click event
   */
  onRightClick: TypeOrNull<OverlayEventCallback>

  /**
   * Pressed move start event
   */
  onPressedMoveStart: TypeOrNull<OverlayEventCallback>

  /**
   * Pressed moving event
   */
  onPressedMoving: TypeOrNull<OverlayEventCallback>

  /**
   * Pressed move end event
   */
  onPressedMoveEnd: TypeOrNull<OverlayEventCallback>

  /**
   * Mouse enter event
   */
  onMouseEnter: TypeOrNull<OverlayEventCallback>

  /**
   * Mouse leave event
   */
  onMouseLeave: TypeOrNull<OverlayEventCallback>

  /**
   * Removed event
   */
  onRemoved: TypeOrNull<OverlayEventCallback>

  /**
   * Selected event
   */
  onSelected: TypeOrNull<OverlayEventCallback>

  /**
   * Deselected event
   */
  onDeselected: TypeOrNull<OverlayEventCallback>
}

export type OverlayTemplate = ExcludePickPartial<Omit<Overlay, 'id' | 'points' | 'currentStep'>, 'name'>
export type OverlayCreate = ExcludePickPartial<Omit<Overlay, 'currentStep' | 'totalStep' | 'createPointFigures' | 'createXAxisFigures' | 'createYAxisFigures' | 'performEventPressedMove' | 'performEventMoveForDrawing'>, 'name'>
export type OverlayConstructor = new () => OverlayImp

const OVERLAY_DRAW_STEP_START = 1
const OVERLAY_DRAW_STEP_FINISHED = -1

export default abstract class OverlayImp implements Overlay {
  id: string
  name: string
  totalStep: number
  currentStep: number = OVERLAY_DRAW_STEP_START
  needDefaultPointFigure: boolean
  needDefaultXAxisFigure: boolean
  needDefaultYAxisFigure: boolean
  lock: boolean
  mode: OverlayMode
  points: Array<PickPartial<Point, 'timestamp'>> = []
  extendData: any
  styles: TypeOrNull<DeepPartial<OverlayStyle>>
  createPointFigures: TypeOrNull<OverlayCreateFiguresCallback>
  createXAxisFigures: TypeOrNull<OverlayCreateFiguresCallback>
  createYAxisFigures: TypeOrNull<OverlayCreateFiguresCallback>
  performEventPressedMove: TypeOrNull<(params: OverlayPerformEventParams) => void>
  performEventMoveForDrawing: TypeOrNull<(params: OverlayPerformEventParams) => void>
  onDrawStart: TypeOrNull<OverlayEventCallback>
  onDrawing: TypeOrNull<OverlayEventCallback>
  onDrawEnd: TypeOrNull<OverlayEventCallback>
  onClick: TypeOrNull<OverlayEventCallback>
  onRightClick: TypeOrNull<OverlayEventCallback>
  onPressedMoveStart: TypeOrNull<OverlayEventCallback>
  onPressedMoving: TypeOrNull<OverlayEventCallback>
  onPressedMoveEnd: TypeOrNull<OverlayEventCallback>
  onMouseEnter: TypeOrNull<OverlayEventCallback>
  onMouseLeave: TypeOrNull<OverlayEventCallback>
  onRemoved: TypeOrNull<OverlayEventCallback>
  onSelected: TypeOrNull<OverlayEventCallback>
  onDeselected: TypeOrNull<OverlayEventCallback>

  private _prevPressedPoint: TypeOrNull<Partial<Point>> = null
  private _prevPressedPoints: Array<PickPartial<Point, 'timestamp'>> = []

  constructor (overlay: OverlayTemplate) {
    const {
      mode, extendData, styles,
      name, totalStep, lock,
      needDefaultPointFigure, needDefaultXAxisFigure, needDefaultYAxisFigure,
      createPointFigures, createXAxisFigures, createYAxisFigures,
      performEventPressedMove, performEventMoveForDrawing,
      onDrawStart, onDrawing, onDrawEnd,
      onClick, onRightClick,
      onPressedMoveStart, onPressedMoving, onPressedMoveEnd,
      onMouseEnter, onMouseLeave, onRemoved,
      onSelected, onDeselected
    } = overlay
    this.name = name
    this.totalStep = (totalStep === undefined || totalStep < 2) ? 1 : totalStep
    this.lock = lock ?? false
    this.needDefaultPointFigure = needDefaultPointFigure ?? false
    this.needDefaultXAxisFigure = needDefaultXAxisFigure ?? false
    this.needDefaultYAxisFigure = needDefaultYAxisFigure ?? false
    this.mode = mode ?? OverlayMode.NORMAL
    this.points = []
    this.extendData = extendData
    this.styles = styles ?? null
    this.createPointFigures = createPointFigures ?? null
    this.createXAxisFigures = createXAxisFigures ?? null
    this.createYAxisFigures = createYAxisFigures ?? null
    this.performEventPressedMove = performEventPressedMove ?? null
    this.performEventMoveForDrawing = performEventMoveForDrawing ?? null
    this.onDrawStart = onDrawStart ?? null
    this.onDrawing = onDrawing ?? null
    this.onDrawEnd = onDrawEnd ?? null
    this.onClick = onClick ?? null
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
    if (this.id === undefined) {
      this.id = id
      return true
    }
    return false
  }

  setExtendData (extendData: any): boolean {
    if (extendData !== this.extendData) {
      this.extendData = extendData
      return true
    }
    return false
  }

  setStyles (styles: TypeOrNull<DeepPartial<OverlayStyle>>): boolean {
    if (styles !== this.styles) {
      this.styles = styles
      return true
    }
    return false
  }

  /**
   * 设置点
   * @param points
   * @return {boolean}
   */
  setPoints (points: Array<PickPartial<Point, 'timestamp'>>): boolean {
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

  setMode (mode: OverlayMode): boolean {
    if (mode !== this.mode) {
      this.mode = mode
      return true
    }
    return false
  }

  setOnDrawStartCallback (callback: TypeOrNull<OverlayEventCallback>): boolean {
    if (this.onDrawStart !== callback) {
      this.onDrawStart = callback
      return true
    }
    return false
  }

  setOnDrawingCallback (callback: TypeOrNull<OverlayEventCallback>): boolean {
    if (this.onDrawing !== callback) {
      this.onDrawing = callback
      return true
    }
    return false
  }

  setOnDrawEndCallback (callback: TypeOrNull<OverlayEventCallback>): boolean {
    if (this.onDrawEnd !== callback) {
      this.onDrawEnd = callback
      return true
    }
    return false
  }

  setOnClickCallback (callback: TypeOrNull<OverlayEventCallback>): boolean {
    if (this.onClick !== callback) {
      this.onClick = callback
      return true
    }
    return false
  }

  setOnRightClickCallback (callback: TypeOrNull<OverlayEventCallback>): boolean {
    if (this.onRightClick !== callback) {
      this.onRightClick = callback
      return true
    }
    return false
  }

  setOnPressedMoveStartCallback (callback: TypeOrNull<OverlayEventCallback>): boolean {
    if (this.onPressedMoveStart !== callback) {
      this.onPressedMoveStart = callback
      return true
    }
    return false
  }

  setOnPressedMovingCallback (callback: TypeOrNull<OverlayEventCallback>): boolean {
    if (this.onPressedMoving !== callback) {
      this.onPressedMoving = callback
      return true
    }
    return false
  }

  setOnPressedMoveEndCallback (callback: TypeOrNull<OverlayEventCallback>): boolean {
    if (this.onPressedMoveEnd !== callback) {
      this.onPressedMoveEnd = callback
      return true
    }
    return false
  }

  setOnMouseEnterCallback (callback: TypeOrNull<OverlayEventCallback>): boolean {
    if (this.onMouseEnter !== callback) {
      this.onMouseEnter = callback
      return true
    }
    return false
  }

  setOnMouseLeaveCallback (callback: TypeOrNull<OverlayEventCallback>): boolean {
    if (this.onMouseLeave !== callback) {
      this.onMouseLeave = callback
      return true
    }
    return false
  }

  setOnRemovedCallback (callback: TypeOrNull<OverlayEventCallback>): boolean {
    if (this.onRemoved !== callback) {
      this.onRemoved = callback
      return true
    }
    return false
  }

  setOnSelectedCallback (callback: TypeOrNull<OverlayEventCallback>): boolean {
    if (this.onSelected !== callback) {
      this.onSelected = callback
      return true
    }
    return false
  }

  setOnDeselectedCallback (callback: TypeOrNull<OverlayEventCallback>): boolean {
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

  isDrawing (): boolean {
    return this.currentStep !== OVERLAY_DRAW_STEP_FINISHED
  }

  isStart (): boolean {
    return this.currentStep === OVERLAY_DRAW_STEP_START
  }

  eventMoveForDrawing (point: Partial<Point>): void {
    const pointIndex = this.currentStep - 1
    const newPoint: PickPartial<Point, 'timestamp'> = { dataIndex: -1, value: -1 }
    if (point.dataIndex !== undefined) {
      newPoint.dataIndex = point.dataIndex
      newPoint.timestamp = point.timestamp
    }
    if (point.value !== undefined) {
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
    if (point.dataIndex !== undefined) {
      this.points[pointIndex].dataIndex = point.dataIndex
      this.points[pointIndex].timestamp = point.timestamp
    }
    if (point.value !== undefined) {
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
      if (point.dataIndex !== undefined && this._prevPressedPoint.dataIndex !== undefined) {
        difDataIndex = point.dataIndex - this._prevPressedPoint.dataIndex
      }
      let difValue: number
      if (point.value !== undefined && this._prevPressedPoint.value !== undefined) {
        difValue = point.value - this._prevPressedPoint.value
      }
      this.points = this._prevPressedPoints.map(p => {
        if (p.dataIndex === undefined && p.timestamp !== undefined) {
          p.dataIndex = timeScaleStore.timestampToDataIndex(p.timestamp)
        }
        const newPoint = { ...p }
        if (difDataIndex !== undefined) {
          newPoint.dataIndex = p.dataIndex + difDataIndex
          newPoint.timestamp = timeScaleStore.dataIndexToTimestamp(newPoint.dataIndex) ?? undefined
        }
        if (difValue !== undefined) {
          newPoint.value = p.value + difValue
        }
        return newPoint
      })
    }
  }

  static extend (template: OverlayTemplate): OverlayConstructor {
    class Custom extends OverlayImp {
      constructor () {
        super(template)
      }
    }
    return Custom
  }
}
