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
import DeepPartial from '../common/DeepPartial'
import PickPartial from '../common/PickPartial'
import ExcludePickPartial from '../common/ExcludePickPartial'
import Point from '../common/Point'
import Coordinate from '../common/Coordinate'
import Bounding from '../common/Bounding'
import Precision from '../common/Precision'
import BarSpace from '../common/BarSpace'
import { ShapeStyle } from '../common/Styles'
import { clone } from '../common/utils/typeChecks'

import Axis from './Axis'

import TimeScaleStore from '../store/TimeScaleStore'

export const enum ShapeMode {
  NORMAL = 'normal',
  WEAK_MAGNET = 'weak_magnet',
  STRONG_MAGNET = 'strong_magnet'
}

export interface ShapePerformEventParams {
  currentStep: number
  mode: ShapeMode
  points: Array<PickPartial<Point, 'timestamp'>>
  performPointIndex: number
  performPoint: PickPartial<Point, 'timestamp'>
}

export interface ShapeFigure {
  isCheck?: boolean
  type: string
  attrs: any | any[]
  styles?: any
}

export interface ShapeCreateFiguresParams {
  shape: Shape
  coordinates: Coordinate[]
  bounding: Bounding
  barSpace: BarSpace
  precision: Precision
  defaultStyles: ShapeStyle
  xAxis: Axis
  yAxis: Axis
}

export type ShapeConstructor = new () => ShapeImp

export type ShapeEventCllback = (shape: Shape) => boolean

export interface Shape {
  id: string
  name: string
  totalStep: number
  currentStep: number
  lock: boolean
  mode: ShapeMode
  points: Array<PickPartial<Point, 'timestamp'>>
  extendData: any
  styles: TypeOrNull<DeepPartial<ShapeStyle>>
  createFigures: (params: ShapeCreateFiguresParams) => ShapeFigure[]
  performEventPressedMove: TypeOrNull<(params: ShapePerformEventParams) => void>
  performEventMoveForDrawing: TypeOrNull<(params: ShapePerformEventParams) => void>
  onDrawStart: TypeOrNull<ShapeEventCllback>
  onDrawing: TypeOrNull<ShapeEventCllback>
  onDrawEnd: TypeOrNull<ShapeEventCllback>
  onClick: TypeOrNull<ShapeEventCllback>
  onRightClick: TypeOrNull<ShapeEventCllback>
  onPressedMove: TypeOrNull<ShapeEventCllback>
  onMouseEnter: TypeOrNull<ShapeEventCllback>
  onMouseLeave: TypeOrNull<ShapeEventCllback>
  onRemoved: TypeOrNull<ShapeEventCllback>
  onSelected: TypeOrNull<ShapeEventCllback>
  onDeselected: TypeOrNull<ShapeEventCllback>
}

const SHAPE_DRAW_STEP_START = 1
const SHAPE_DRAW_STEP_FINISHED = -1

export default abstract class ShapeImp implements Shape {
  name: string
  totalStep: number
  lock: boolean
  mode: ShapeMode
  points: Array<PickPartial<Point, 'timestamp'>> = []
  extendData: any
  styles: TypeOrNull<DeepPartial<ShapeStyle>>
  performEventPressedMove: TypeOrNull<(params: ShapePerformEventParams) => void>
  performEventMoveForDrawing: TypeOrNull<(params: ShapePerformEventParams) => void>
  onDrawStart: TypeOrNull<ShapeEventCllback>
  onDrawing: TypeOrNull<ShapeEventCllback>
  onDrawEnd: TypeOrNull<ShapeEventCllback>
  onClick: TypeOrNull<ShapeEventCllback>
  onRightClick: TypeOrNull<ShapeEventCllback>
  onPressedMove: TypeOrNull<ShapeEventCllback>
  onMouseEnter: TypeOrNull<ShapeEventCllback>
  onMouseLeave: TypeOrNull<ShapeEventCllback>
  onRemoved: TypeOrNull<ShapeEventCllback>
  onSelected: TypeOrNull<ShapeEventCllback>
  onDeselected: TypeOrNull<ShapeEventCllback>

  id: string
  currentStep: number = SHAPE_DRAW_STEP_START

  private _prevPressedPoint: TypeOrNull<PickPartial<Point, 'timestamp'>> = null
  private _prevPressedPoints: Array<PickPartial<Point, 'timestamp'>> = []

  constructor (shape: ExcludePickPartial<Shape, 'name' | 'totalStep' | 'createFigures'>) {
    const {
      name, totalStep, lock, mode, points, extendData, styles,
      performEventPressedMove, performEventMoveForDrawing,
      onDrawStart, onDrawing, onDrawEnd,
      onClick, onRightClick, onPressedMove,
      onMouseEnter, onMouseLeave, onRemoved,
      onSelected, onDeselected
    } = shape
    this.name = name
    this.totalStep = totalStep
    this.lock = lock ?? false
    this.mode = mode ?? ShapeMode.NORMAL
    this.setPoints(points ?? [])
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
    if (this.id !== id) {
      this.id = id
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
      if (points.length >= this.totalStep - 1) {
        this.currentStep = SHAPE_DRAW_STEP_FINISHED
        this.points = points.slice(0, this.totalStep - 1)
        repeatTotalStep = this.totalStep - 1
      } else {
        this.currentStep = points.length + 1
        this.points = [...points]
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
      if (this.currentStep === SHAPE_DRAW_STEP_FINISHED && this.performEventPressedMove !== null) {
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
  setMode (mode: ShapeMode): boolean {
    if (mode !== this.mode) {
      this.mode = mode
      return true
    }
    return false
  }

  /**
   * 设置扩展数据
   * @param extendData
   */
  setExtendData (extendData: any): boolean {
    if (extendData !== this.extendData) {
      this.extendData = extendData
      return true
    }
    return false
  }

  setStyles (styles: TypeOrNull<DeepPartial<ShapeStyle>>): boolean {
    if (styles !== this.styles) {
      this.styles = styles
      return true
    }
    return false
  }

  setOnDrawStartCallback (callback: TypeOrNull<ShapeEventCllback>): boolean {
    if (this.onDrawStart !== callback) {
      this.onDrawStart = callback
      return true
    }
    return false
  }

  setOnDrawingCallback (callback: TypeOrNull<ShapeEventCllback>): boolean {
    if (this.onDrawing !== callback) {
      this.onDrawing = callback
      return true
    }
    return false
  }

  setOnDrawEndCallback (callback: TypeOrNull<ShapeEventCllback>): boolean {
    if (this.onDrawEnd !== callback) {
      this.onDrawEnd = callback
      return true
    }
    return false
  }

  setOnClickCallback (callback: TypeOrNull<ShapeEventCllback>): boolean {
    if (this.onClick !== callback) {
      this.onClick = callback
      return true
    }
    return false
  }

  setOnRightClickCallback (callback: TypeOrNull<ShapeEventCllback>): boolean {
    if (this.onRightClick !== callback) {
      this.onRightClick = callback
      return true
    }
    return false
  }

  setOnPressedMoveCallback (callback: TypeOrNull<ShapeEventCllback>): boolean {
    if (this.onPressedMove !== callback) {
      this.onPressedMove = callback
      return true
    }
    return false
  }

  setOnMouseEnterCallback (callback: TypeOrNull<ShapeEventCllback>): boolean {
    if (this.onMouseEnter !== callback) {
      this.onMouseEnter = callback
      return true
    }
    return false
  }

  setOnMouseLeaveCallback (callback: TypeOrNull<ShapeEventCllback>): boolean {
    if (this.onMouseLeave !== callback) {
      this.onMouseLeave = callback
      return true
    }
    return false
  }

  setOnRemovedCallback (callback: TypeOrNull<ShapeEventCllback>): boolean {
    if (this.onRemoved !== callback) {
      this.onRemoved = callback
      return true
    }
    return false
  }

  setOnSelectedCallback (callback: TypeOrNull<ShapeEventCllback>): boolean {
    if (this.onSelected !== callback) {
      this.onSelected = callback
      return true
    }
    return false
  }

  setOnDeselectedCallback (callback: TypeOrNull<ShapeEventCllback>): boolean {
    if (this.onDeselected !== callback) {
      this.onDeselected = callback
      return true
    }
    return false
  }

  nextStep (): void {
    if (this.currentStep === this.totalStep - 1) {
      this.currentStep = SHAPE_DRAW_STEP_FINISHED
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
    return this.currentStep !== SHAPE_DRAW_STEP_FINISHED
  }

  /**
   * 是否开始
   * @returns
   */
  isStart (): boolean {
    return this.currentStep === SHAPE_DRAW_STEP_START
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
    this.onPressedMove?.(this)
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
      const difDataIndex = point.dataIndex - this._prevPressedPoint.dataIndex
      const difValue = point.value - this._prevPressedPoint.value
      this.points = this._prevPressedPoints.map(p => {
        const dataIndex = p.dataIndex + difDataIndex
        const value = p.value + difValue
        return {
          dataIndex,
          value,
          timestamp: timeScaleStore.dataIndexToTimestamp(dataIndex) ?? undefined
        }
      })
      this.onPressedMove?.(this)
    }
  }

  abstract createFigures (params: ShapeCreateFiguresParams): ShapeFigure[]

  static extend (
    shape: ExcludePickPartial<Shape, 'name' | 'totalStep' | 'createFigures'>
  ): ShapeConstructor {
    class Custom extends ShapeImp {
      constructor () {
        super(shape)
      }

      createFigures (params: ShapeCreateFiguresParams): ShapeFigure[] {
        return shape.createFigures(params)
      }
    }
    return Custom
  }
}
