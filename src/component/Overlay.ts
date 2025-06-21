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
import type { OverlayStyle } from '../common/Styles'
import type { MouseTouchEvent } from '../common/EventHandler'
import { clone, isArray, isBoolean, isFunction, isNumber, isString, isValid, merge } from '../common/utils/typeChecks'

import type { XAxis } from './XAxis'
import type { YAxis } from './YAxis'
import type ChartStore from '../Store'
import type { Chart } from '../Chart'

export type OverlayMode = 'normal' | 'weak_magnet' | 'strong_magnet'

export interface OverlayPerformEventParams {
  currentStep: number
  mode: OverlayMode
  points: Array<Partial<Point>>
  performPointIndex: number
  performPoint: Partial<Point>
}

export interface OverlayEventCollection<E> {
  onDrawStart: Nullable<OverlayEventCallback<E>>
  onDrawing: Nullable<OverlayEventCallback<E>>
  onDrawEnd: Nullable<OverlayEventCallback<E>>
  onRemoved: Nullable<OverlayEventCallback<E>>
  onClick: Nullable<OverlayEventCallback<E>>
  onDoubleClick: Nullable<OverlayEventCallback<E>>
  onRightClick: Nullable<OverlayEventCallback<E>>
  onPressedMoveStart: Nullable<OverlayEventCallback<E>>
  onPressedMoving: Nullable<OverlayEventCallback<E>>
  onPressedMoveEnd: Nullable<OverlayEventCallback<E>>
  onMouseMove: Nullable<OverlayEventCallback<E>>
  onMouseEnter: Nullable<OverlayEventCallback<E>>
  onMouseLeave: Nullable<OverlayEventCallback<E>>
  onSelected: Nullable<OverlayEventCallback<E>>
  onDeselected: Nullable<OverlayEventCallback<E>>
}

export function checkOverlayFigureEvent (
  targetEventType: keyof Omit<OverlayEventCollection<unknown>, 'onDrawStart' | 'onDrawing' | 'onDrawEnd' | 'onRemoved'>,
  figure: Nullable<OverlayFigure>
): boolean {
  const ignoreEvent = figure?.ignoreEvent ?? false
  if (isBoolean(ignoreEvent)) {
    return !ignoreEvent
  }
  return !ignoreEvent.includes(targetEventType)
}

export interface OverlayFigure {
  key?: string
  type: string
  attrs: unknown
  styles?: unknown
  ignoreEvent?: boolean | Array<keyof Omit<OverlayEventCollection<unknown>, 'onDrawStart' | 'onDrawing' | 'onDrawEnd' | 'onRemoved'>>
}

export interface OverlayCreateFiguresCallbackParams<E> {
  chart: Chart
  overlay: Overlay<E>
  coordinates: Coordinate[]
  bounding: Bounding
  xAxis: Nullable<XAxis>
  yAxis: Nullable<YAxis>
}

export interface OverlayEvent<E> extends Partial<MouseTouchEvent> {
  figure?: OverlayFigure
  overlay: Overlay<E>
  chart: Chart
}

export type OverlayEventCallback<E> = (event: OverlayEvent<E>) => void

export type OverlayCreateFiguresCallback<E> = (params: OverlayCreateFiguresCallbackParams<E>) => OverlayFigure | OverlayFigure[]

export interface Overlay<E = unknown> extends OverlayEventCollection<E> {
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
  extendData: E

  /**
   * The style information and format are consistent with the overlay in the unified configuration
   */
  styles: Nullable<DeepPartial<OverlayStyle>>

  /**
   * Create figures corresponding to points
   */
  createPointFigures: Nullable<OverlayCreateFiguresCallback<E>>

  /**
   * Create figures on the Y axis
   */
  createXAxisFigures: Nullable<OverlayCreateFiguresCallback<E>>

  /**
   * Create figures on the X axis
   */
  createYAxisFigures: Nullable<OverlayCreateFiguresCallback<E>>

  /**
   * Special handling callbacks when pressing events
   */
  performEventPressedMove: Nullable<(params: OverlayPerformEventParams) => void>

  /**
   * In drawing, special handling callback when moving events
   */
  performEventMoveForDrawing: Nullable<(params: OverlayPerformEventParams) => void>
}

export type OverlayTemplate<E = unknown> = ExcludePickPartial<Omit<Overlay<E>, 'id' | 'groupId' | 'paneId' | 'points' | 'currentStep'>, 'name'>

export type OverlayCreate<E = unknown> = ExcludePickPartial<Omit<Overlay<E>, 'currentStep' | 'totalStep' | 'createPointFigures' | 'createXAxisFigures' | 'createYAxisFigures' | 'performEventPressedMove' | 'performEventMoveForDrawing'>, 'name'>
export type OverlayOverride<E = unknown> = Partial<Omit<Overlay<E>, 'currentStep' | 'totalStep' | 'createPointFigures' | 'createXAxisFigures' | 'createYAxisFigures' | 'performEventPressedMove' | 'performEventMoveForDrawing'>>

export type OverlayFilter<E = unknown> = Partial<Pick<Overlay<E>, 'id' | 'groupId' | 'name' | 'paneId'>>

export type OverlayInnerConstructor<E = unknown> = new () => OverlayImp<E>
export type OverlayConstructor<E = unknown> = new () => Overlay<E>

const OVERLAY_DRAW_STEP_START = 1
const OVERLAY_DRAW_STEP_FINISHED = -1

export const OVERLAY_ID_PREFIX = 'overlay_'

export const OVERLAY_FIGURE_KEY_PREFIX = 'overlay_figure_'

export default class OverlayImp<E = unknown> implements Overlay<E> {
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
  mode: OverlayMode = 'normal'
  modeSensitivity = 8
  points: Array<Partial<Omit<Point, 'dataIndex'>>> = []
  extendData: E
  styles: Nullable<DeepPartial<OverlayStyle>> = null
  createPointFigures: Nullable<OverlayCreateFiguresCallback<E>> = null
  createXAxisFigures: Nullable<OverlayCreateFiguresCallback<E>> = null
  createYAxisFigures: Nullable<OverlayCreateFiguresCallback<E>> = null
  performEventPressedMove: Nullable<(params: OverlayPerformEventParams) => void> = null
  performEventMoveForDrawing: Nullable<(params: OverlayPerformEventParams) => void> = null
  onDrawStart: Nullable<OverlayEventCallback<E>> = null
  onDrawing: Nullable<OverlayEventCallback<E>> = null
  onDrawEnd: Nullable<OverlayEventCallback<E>> = null
  onClick: Nullable<OverlayEventCallback<E>> = null
  onDoubleClick: Nullable<OverlayEventCallback<E>> = null
  onRightClick: Nullable<OverlayEventCallback<E>> = null
  onPressedMoveStart: Nullable<OverlayEventCallback<E>> = null
  onPressedMoving: Nullable<OverlayEventCallback<E>> = null
  onPressedMoveEnd: Nullable<OverlayEventCallback<E>> = null
  onMouseMove: Nullable<OverlayEventCallback<E>> = null
  onMouseEnter: Nullable<OverlayEventCallback<E>> = null
  onMouseLeave: Nullable<OverlayEventCallback<E>> = null
  onRemoved: Nullable<OverlayEventCallback<E>> = null
  onSelected: Nullable<OverlayEventCallback<E>> = null
  onDeselected: Nullable<OverlayEventCallback<E>> = null

  private _prevZLevel = 0

  private _prevOverlay: Overlay<E>

  private _prevPressedPoint: Nullable<Partial<Point>> = null
  private _prevPressedPoints: Array<Partial<Point>> = []

  constructor (overlay: OverlayTemplate<E>) {
    this.override(overlay)
  }

  override (overlay: Partial<Overlay<E>>): void {
    this._prevOverlay = clone({
      ...this,
      _prevOverlay: null
    })

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

  getPrevZLevel (): number { return this._prevZLevel }

  setPrevZLevel (zLevel: number): void { this._prevZLevel = zLevel }

  shouldUpdate (): { draw: boolean, sort: boolean } {
    const sort = this._prevOverlay.zLevel !== this.zLevel
    const draw = sort ||
      JSON.stringify(this._prevOverlay.points) !== JSON.stringify(this.points) ||
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
    this.points[pointIndex].timestamp = point.timestamp
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

  static extend<E = unknown> (template: OverlayTemplate<E>): OverlayInnerConstructor<E> {
    class Custom extends OverlayImp<E> {
      constructor () {
        super(template)
      }
    }
    return Custom
  }
}
