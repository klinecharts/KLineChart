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
import { OverlayStyle } from '../common/Styles'

import { clone } from '../common/utils/typeChecks'

import TimeScaleStore from '../store/TimeScaleStore'

import Axis from './Axis'

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
  isCheckEvent?: boolean
}

export interface OverlayCreateFiguresCallbackParams {
  overlay: Overlay
  coordinates: Coordinate[]
  bounding: Bounding
  barSpace: BarSpace
  precision: Precision
  defaultStyles: OverlayStyle
  xAxis: Axis
  yAxis: Axis
}

export type OverlayEventCallback = (overlay: Overlay) => boolean

export type OverlayCreateFiguresCallback = (params: OverlayCreateFiguresCallbackParams) => OverlayFigure | OverlayFigure[]

export interface Overlay {
  id: string
  name: string
  totalStep: number
  currentStep: number
  lock: boolean
  needPointFigure: boolean
  mode: OverlayMode
  points: Array<PickPartial<Point, 'timestamp'>>
  extendData: any
  styles: TypeOrNull<DeepPartial<OverlayStyle>>
  createPointFigures: OverlayCreateFiguresCallback
  createXAxisFigures: OverlayCreateFiguresCallback
  createYAxisFigures: OverlayCreateFiguresCallback
  performEventPressedMove: TypeOrNull<(params: OverlayPerformEventParams) => void>
  performEventMoveForDrawing: TypeOrNull<(params: OverlayPerformEventParams) => void>
  onDrawStart: TypeOrNull<OverlayEventCallback>
  onDrawing: TypeOrNull<OverlayEventCallback>
  onDrawEnd: TypeOrNull<OverlayEventCallback>
  onClick: TypeOrNull<OverlayEventCallback>
  onRightClick: TypeOrNull<OverlayEventCallback>
  onPressedMove: TypeOrNull<OverlayEventCallback>
  onMouseEnter: TypeOrNull<OverlayEventCallback>
  onMouseLeave: TypeOrNull<OverlayEventCallback>
  onRemoved: TypeOrNull<OverlayEventCallback>
  onSelected: TypeOrNull<OverlayEventCallback>
  onDeselected: TypeOrNull<OverlayEventCallback>
}

export type OverlayTemplate = ExcludePickPartial<Omit<Overlay, 'id' | 'points' | 'currentStep'>, 'name'>
export type OverlayCreate = ExcludePickPartial<Omit<Overlay, 'series' | 'currentStep' | 'totalStep' | 'createPointFigures' | 'createXAxisFigures' | 'createYAxisFigures' | 'performEventPressedMove' | 'performEventMoveForDrawing'>, 'name'>
export type OverlayConstructor = new () => OverlayImp

const OVERLAY_DRAW_STEP_START = 1
const OVERLAY_DRAW_STEP_FINISHED = -1

export default abstract class OverlayImp implements Overlay {
  id: string
  name: string
  totalStep: number
  currentStep: number = OVERLAY_DRAW_STEP_START
  needPointFigure: boolean
  lock: boolean
  mode: OverlayMode
  points: Array<PickPartial<Point, 'timestamp'>> = []
  extendData: any
  styles: TypeOrNull<DeepPartial<OverlayStyle>>
  performEventPressedMove: TypeOrNull<(params: OverlayPerformEventParams) => void>
  performEventMoveForDrawing: TypeOrNull<(params: OverlayPerformEventParams) => void>
  onDrawStart: TypeOrNull<OverlayEventCallback>
  onDrawing: TypeOrNull<OverlayEventCallback>
  onDrawEnd: TypeOrNull<OverlayEventCallback>
  onClick: TypeOrNull<OverlayEventCallback>
  onRightClick: TypeOrNull<OverlayEventCallback>
  onPressedMove: TypeOrNull<OverlayEventCallback>
  onMouseEnter: TypeOrNull<OverlayEventCallback>
  onMouseLeave: TypeOrNull<OverlayEventCallback>
  onRemoved: TypeOrNull<OverlayEventCallback>
  onSelected: TypeOrNull<OverlayEventCallback>
  onDeselected: TypeOrNull<OverlayEventCallback>

  private _prevPressedPoint: TypeOrNull<PickPartial<Point, 'timestamp'>> = null
  private _prevPressedPoints: Array<PickPartial<Point, 'timestamp'>> = []

  constructor (overlay: OverlayTemplate) {
    const {
      name, totalStep, lock, needPointFigure, mode, extendData, styles,
      performEventPressedMove, performEventMoveForDrawing,
      onDrawStart, onDrawing, onDrawEnd,
      onClick, onRightClick, onPressedMove,
      onMouseEnter, onMouseLeave, onRemoved,
      onSelected, onDeselected
    } = overlay
    this.name = name
    this.totalStep = (totalStep === undefined || totalStep < 2) ? 1 : totalStep
    this.lock = lock ?? false
    this.needPointFigure = needPointFigure ?? false
    this.mode = mode ?? OverlayMode.NORMAL
    this.points = []
    this.extendData = extendData
    this.styles = styles ?? null
    this.performEventPressedMove = performEventPressedMove ?? null
    this.performEventMoveForDrawing = performEventMoveForDrawing ?? null
    this.onDrawStart = onDrawStart ?? null
    this.onDrawing = onDrawing ?? null
    this.onDrawEnd = onDrawEnd ?? null
    this.onClick = onClick ?? null
    this.onRightClick = onRightClick ?? null
    this.onPressedMove = onPressedMove ?? null
    this.onMouseEnter = onMouseEnter ?? null
    this.onMouseLeave = onMouseLeave ?? null
    this.onRemoved = onRemoved ?? null
    this.onSelected = onSelected ?? null
    this.onDeselected = onDeselected ?? null
  }

  setId (id: string): boolean {
    if (this.id !== undefined) {
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
      // 重新演练绘制一遍，防止因为点不对而绘制出错误的图形
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

  /**
   * 设置模式
   * @param mode
   */
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

  setOnPressedMoveCallback (callback: TypeOrNull<OverlayEventCallback>): boolean {
    if (this.onPressedMove !== callback) {
      this.onPressedMove = callback
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
      this.onDrawEnd?.(this)
    } else {
      this.currentStep++
    }
  }

  /**
   * 是否在绘制中
   * @return {boolean}
   */
  isDrawing (): boolean {
    return this.currentStep !== OVERLAY_DRAW_STEP_FINISHED
  }

  /**
   * 是否开始
   * @returns
   */
  isStart (): boolean {
    return this.currentStep === OVERLAY_DRAW_STEP_START
  }

  mouseMoveForDrawing (point: PickPartial<Point, 'timestamp'>): void {
    const pointIndex = this.currentStep - 1
    this.points[pointIndex] = point
    this.performEventMoveForDrawing?.({
      currentStep: this.currentStep,
      mode: this.mode,
      points: this.points,
      performPointIndex: pointIndex,
      performPoint: point
    })
    this.onDrawing?.(this)
  }

  /**
   * 鼠标按住移动方法
   * @param point
   * @param elementIndex
   */
  mousePressedPointMove (point: PickPartial<Point, 'timestamp'>, elementIndex: number): void {
    if (this.onPressedMove?.(this) ?? false) {
      this.points[elementIndex].timestamp = point.timestamp
      this.points[elementIndex].dataIndex = point.dataIndex
      this.points[elementIndex].value = point.value
      this.performEventPressedMove?.({
        currentStep: this.currentStep,
        points: this.points,
        mode: this.mode,
        performPointIndex: elementIndex,
        performPoint: point
      })
    }
  }

  /**
   * 按住非点拖动开始事件
   * @param point
   */
  startPressedOtherMove (point: PickPartial<Point, 'timestamp'>): void {
    this._prevPressedPoint = { ...point }
    this._prevPressedPoints = clone(this.points)
  }

  /**
   * 按住非点拖动时事件
   * @param point
   */
  mousePressedOtherMove (point: PickPartial<Point, 'timestamp'>, timeScaleStore: TimeScaleStore): void {
    if (!this.lock && this._prevPressedPoint !== null) {
      if (this.onPressedMove?.(this) ?? false) {
        const difDataIndex = point.dataIndex - this._prevPressedPoint.dataIndex
        const difValue = point.value - this._prevPressedPoint.value
        this.points = this._prevPressedPoints.map(p => {
          if (p.dataIndex === undefined && p.timestamp !== undefined) {
            p.dataIndex = timeScaleStore.timestampToDataIndex(p.timestamp)
          }
          const dataIndex = p.dataIndex + difDataIndex
          const value = p.value + difValue
          return {
            dataIndex,
            value,
            timestamp: timeScaleStore.dataIndexToTimestamp(dataIndex) ?? undefined
          }
        })
      }
    }
  }

  createPointFigures (params: OverlayCreateFiguresCallbackParams): OverlayFigure | OverlayFigure[] {
    return []
  }

  createXAxisFigures (params: OverlayCreateFiguresCallbackParams): OverlayFigure | OverlayFigure[] {
    const { coordinates, bounding } = params
    const figures: OverlayFigure[] = []
    let leftX = Number.MAX_SAFE_INTEGER
    let rightX = Number.MIN_SAFE_INTEGER
    if (coordinates.length > 1) {
      coordinates.forEach(coordinate => {
        leftX = Math.min(leftX, coordinate.x)
        rightX = Math.max(rightX, coordinate.x)
      })
      figures.push({ type: 'rect', attrs: { x: leftX, y: 0, width: rightX - leftX, height: bounding.height } })
    }
    return figures
  }

  createYAxisFigures (params: OverlayCreateFiguresCallbackParams): OverlayFigure | OverlayFigure[] {
    const { coordinates, bounding } = params
    const figures: OverlayFigure[] = []
    let topY = Number.MAX_SAFE_INTEGER
    let bottomY = Number.MIN_SAFE_INTEGER
    if (coordinates.length > 1) {
      coordinates.forEach(coordinate => {
        topY = Math.min(topY, coordinate.y)
        bottomY = Math.max(bottomY, coordinate.y)
      })
      figures.push({ type: 'rect', attrs: { x: 0, y: topY, width: bounding.width, height: bottomY - topY } })
    }
    return figures
  }

  static extend (template: OverlayTemplate): OverlayConstructor {
    class Custom extends OverlayImp {
      constructor () {
        super(template)
      }

      createPointFigures (params: OverlayCreateFiguresCallbackParams): OverlayFigure | OverlayFigure[] {
        if (template.createPointFigures !== undefined) {
          return template.createPointFigures(params)
        }
        return super.createPointFigures(params)
      }

      createXAxisFigures (params: OverlayCreateFiguresCallbackParams): OverlayFigure | OverlayFigure[] {
        if (template.createXAxisFigures !== undefined) {
          return template.createXAxisFigures(params)
        }
        return super.createXAxisFigures(params)
      }

      createYAxisFigures (params: OverlayCreateFiguresCallbackParams): OverlayFigure | OverlayFigure[] {
        if (template.createYAxisFigures !== undefined) {
          return template.createYAxisFigures(params)
        }
        return super.createYAxisFigures(params)
      }
    }
    return Custom
  }
}
