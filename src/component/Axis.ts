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

import type VisibleRange from '../common/VisibleRange'

import type DrawPane from '../pane/DrawPane'

import type Bounding from '../common/Bounding'

export interface AxisTick {
  coord: number
  value: number | string
  text: string
}

export interface AxisRange extends VisibleRange {
  readonly range: number
  readonly realRange: number
}

export interface Axis {
  getTicks: () => AxisTick[]
  getRange: () => AxisRange
  getAutoSize: () => number
  convertToPixel: (value: number) => number
  convertFromPixel: (px: number) => number
}

export interface AxisCreateTicksParams {
  range: AxisRange
  bounding: Bounding
  defaultTicks: AxisTick[]
}

export interface AxisCreateRangeParams {
  defaultRange: AxisRange
}

export type AxisCreateRangeCallback = (params: AxisCreateRangeParams) => AxisRange

export type AxisCreateTicksCallback = (params: AxisCreateTicksParams) => AxisTick[]

export interface AxisTemplate {
  name: string
  createRange?: AxisCreateRangeCallback
  createTicks?: AxisCreateTicksCallback
}

export default abstract class AxisImp implements AxisTemplate, Axis {
  private readonly _parent: DrawPane<Axis>

  private _range: AxisRange = { from: 0, to: 0, range: 0, realFrom: 0, realTo: 0, realRange: 0 }
  private _prevRange: AxisRange = { from: 0, to: 0, range: 0, realFrom: 0, realTo: 0, realRange: 0 }
  private _ticks: AxisTick[] = []

  private _autoCalcTickFlag = true

  constructor (parent: DrawPane<Axis>) {
    this._parent = parent
  }

  name: string

  getParent (): DrawPane<Axis> { return this._parent }

  buildTicks (force: boolean): boolean {
    if (this._autoCalcTickFlag) {
      const defaultRange = this.createDefaultRange()
      this._range = this.createRange?.({ defaultRange }) ?? defaultRange
    }
    if (this._prevRange.from !== this._range.from || this._prevRange.to !== this._range.to || force) {
      this._prevRange = this._range
      const defaultTicks = this.createDefaultTicks()
      this._ticks = this.createTicks?.({
        range: this._range,
        bounding: this.getBounding(),
        defaultTicks
      }) ?? defaultTicks
      return true
    }
    return false
  }

  getTicks (): AxisTick[] {
    return this._ticks
  }

  getScrollZoomEnabled (): boolean {
    return this.getParent().getOptions().axisOptions.scrollZoomEnabled ?? true
  }

  setRange (range: AxisRange): void {
    this._autoCalcTickFlag = false
    this._range = range
  }

  getRange (): AxisRange { return this._range }

  setAutoCalcTickFlag (flag: boolean): void {
    this._autoCalcTickFlag = flag
  }

  getAutoCalcTickFlag (): boolean { return this._autoCalcTickFlag }

  protected abstract createDefaultRange (): AxisRange

  protected abstract createDefaultTicks (): AxisTick[]

  protected abstract getBounding (): Bounding

  abstract createRange (params: AxisCreateRangeParams): AxisRange

  abstract createTicks (params: AxisCreateTicksParams): AxisTick[]

  abstract getAutoSize (): number

  abstract convertToPixel (value: number): number
  abstract convertFromPixel (px: number): number
}
