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

import RequiredPick from '../../common/PickPartial'
import Point from '../../common/Point'
import Coordinate from '../../common/Coordinate'
import Bounding from '../../common/Bounding'
import Precision from '../../common/Precision'

import { Axis } from '../../componentl/Axis'

export const enum ShapeMode {
  NORMAL = 'normal',
  WEAK_MAGNET = 'weak_magnet',
  STRONG_MAGNET = 'strong_magnet'
}

export interface ShapePerformEventParams {
  currentStep: number
  mode: ShapeMode
  points: Point[]
  performPointIndex: number
  performPoint: Point
}

export interface ShapeDataSourceChild {
  radius?: number
  startAngle?: number
  endAngle?: number
  text?: string
}

export interface ShapeDataSource {
  type: 'line'
  key?: string
  isDraw?: boolean
  isCheck?: boolean
  styles?: any
  dataSource: ShapeDataSourceChild[] | ShapeDataSourceChild[][]
}

export interface ShapeCreateDataSourceParams {
  currentStep: number
  mode: ShapeMode
  points: Point[]
  coordinates: Coordinate[]
  bounding: Bounding
  precision: Precision
  styles: any
  extendData: any
  xAxis: Axis
  yAxis: Axis
}

export interface ShapeDrawParams {
  ctx: CanvasRenderingContext2D
  currentStep: number
  mode: ShapeMode
  dataSource: ShapeDataSource[]
  bounding: Bounding
  precision: Precision
  styles: any
  extendData: any
  xAxis: Axis
  yAxis: Axis
}

export type ShapeConstructor = new () => ShapeTemplate

export interface Shape {
  id?: string
  name?: string
  totalStep?: number
  lock?: boolean
  mode?: ShapeMode
  points?: Point[]
  extendData?: any
  styles?: any
  checkEventOn?: any
  createDataSource?: (params: ShapeCreateDataSourceParams) => ShapeDataSource[]
  performEventPressedMove?: (params: ShapePerformEventParams) => void
  performEventMoveForDrawing?: (params: ShapePerformEventParams) => void
  draw?: (params: ShapeDrawParams) => boolean
}

const SHAPE_DRAW_STEP_START = 1
const SHAPE_DRAW_STEP_FINISHED = -1

export default abstract class ShapeTemplate implements RequiredPick<Shape, 'name' | 'totalStep' | 'createDataSource'> {
  name: string
  totalStep: number
  lock?: boolean
  mode?: ShapeMode
  points?: Point[] = []
  extendData?: any
  styles?: any
  checkEventOn?: any
  performEventPressedMove?: (params: ShapePerformEventParams) => void
  performEventMoveForDrawing?: (params: ShapePerformEventParams) => void
  draw?: (params: ShapeDrawParams) => boolean

  id: string
  currentStep: number = SHAPE_DRAW_STEP_START

  constructor (shape: RequiredPick<Shape, 'name' | 'totalStep' | 'createDataSource'>) {
    const { name, totalStep, lock, mode, points, extendData, styles } = shape
    this.name = name
    this.totalStep = totalStep
    this.lock = lock ?? false
    this.mode = mode ?? ShapeMode.NORMAL
    this.setPoints(points ?? [])
    this.extendData = extendData
    this.styles = styles
  }

  /**
   * 设置点
   * @param points
   * @return {boolean}
   */
  setPoints (points: Point[]): boolean {
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
      for (let i = 0; i < repeatTotalStep; i++) {
        this.performEventMoveForDrawing?.({
          currentStep: i + 2,
          mode: this.mode ?? ShapeMode.NORMAL,
          points: this.points,
          performPointIndex: i,
          performPoint: this.points[i]
        })
      }
      if (this.currentStep === SHAPE_DRAW_STEP_FINISHED) {
        this.performEventPressedMove?.({
          currentStep: this.currentStep,
          mode: this.mode ?? ShapeMode.NORMAL,
          points: this.points,
          performPointIndex: this.points.length - 1,
          performPoint: this.points[this.points.length - 1]
        })
      }
      return true
    }
    return false
  }

  setLock (lock: boolean): void {
    this.lock = lock
  }

  /**
   * 设置模式
   * @param mode
   */
  setMode (mode: ShapeMode): void {
    if (mode !== this.mode) {
      this.mode = mode
    }
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

  setStyles (styles: any): boolean {
    if (styles !== this.styles) {
      this.styles = styles
      return true
    }
    return false
  }

  nextStep (): void {
    if (this.currentStep === this.totalStep - 1) {
      this.currentStep = SHAPE_DRAW_STEP_FINISHED
      // this._chartStore.shapeStore().progressInstanceComplete()
      // this.onDrawEnd({ id: this.id, points: this.points })
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

  abstract createDataSource (params: ShapeCreateDataSourceParams): ShapeDataSource[]

  static extend (shape: RequiredPick<Shape, 'name' | 'totalStep' | 'createDataSource'>): ShapeConstructor {
    class Custom extends ShapeTemplate {
      constructor () {
        super(shape)
      }

      createDataSource (params: ShapeCreateDataSourceParams): ShapeDataSource[] {
        return shape.createDataSource(params)
      }
    }
    Custom.prototype.checkEventOn = shape.checkEventOn
    Custom.prototype.createDataSource = shape.createDataSource

    Custom.prototype.performEventPressedMove = shape.performEventPressedMove
    Custom.prototype.performEventMoveForDrawing = shape.performEventMoveForDrawing
    Custom.prototype.draw = shape.draw

    return Custom
  }
}
