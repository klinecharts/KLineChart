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

import { getPrecision, nice, round } from '../common/utils/number'
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
  convertToPixel: (value: number) => number
  convertFromPixel: (px: number) => number
}

export interface AxisCreateTicksParams {
  range: AxisRange
  bounding: Bounding
  defaultTicks: AxisTick[]
}

export type AxisCreateTicksCallback = (params: AxisCreateTicksParams) => AxisTick[]

export interface AxisTemplate {
  name: string
  createTicks: AxisCreateTicksCallback
}

export default abstract class AxisImp implements Pick<AxisTemplate, 'createTicks'>, Axis {
  private readonly _parent: DrawPane<AxisImp>

  private _range: AxisRange = { from: 0, to: 0, range: 0, realFrom: 0, realTo: 0, realRange: 0 }
  private _prevRange: AxisRange = { from: 0, to: 0, range: 0, realFrom: 0, realTo: 0, realRange: 0 }
  private _ticks: AxisTick[] = []

  private _autoCalcTickFlag = true

  constructor (parent: DrawPane<AxisImp>) {
    this._parent = parent
  }

  getParent (): DrawPane<AxisImp> { return this._parent }

  buildTicks (force: boolean): boolean {
    if (this._autoCalcTickFlag) {
      this._range = this.calcRange()
    }
    if (this._prevRange.from !== this._range.from || this._prevRange.to !== this._range.to || force) {
      this._prevRange = this._range
      const defaultTicks = this.optimalTicks(this._calcTicks())
      this._ticks = this.createTicks({
        range: this._range,
        bounding: this.getSelfBounding(),
        defaultTicks
      })
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

  private _calcTicks (): AxisTick[] {
    const { realFrom, realTo, realRange } = this._range
    const ticks: AxisTick[] = []

    if (realRange >= 0) {
      const [interval, precision] = this._calcTickInterval(realRange)
      const first = round(Math.ceil(realFrom / interval) * interval, precision)
      const last = round(Math.floor(realTo / interval) * interval, precision)
      let n = 0
      let f = first

      if (interval !== 0) {
        while (f <= last) {
          const v = f.toFixed(precision)
          ticks[n] = { text: v, coord: 0, value: v }
          ++n
          f += interval
        }
      }
    }
    return ticks
  }

  private _calcTickInterval (range: number): number[] {
    const interval = nice(range / 8.0)
    const precision = getPrecision(interval)
    return [interval, precision]
  }

  protected abstract calcRange (): AxisRange

  protected abstract optimalTicks (ticks: AxisTick[]): AxisTick[]

  abstract createTicks (params: AxisCreateTicksParams): AxisTick[]

  abstract getAutoSize (): number

  abstract getSelfBounding (): Bounding

  abstract convertToPixel (value: number): number
  abstract convertFromPixel (px: number): number
}
