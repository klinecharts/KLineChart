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

import DrawPane from '../pane/DrawPane'

import { getPrecision, nice, round } from '../common/utils/number'

export interface AxisTick {
  coord: number
  value: number | string
  text: string
}

export interface AxisExtremum {
  min: number
  max: number
  range: number
  realMin: number
  realMax: number
  realRange: number
}

export interface Axis {
  convertToPixel: (value: number) => number
  convertFromPixel: (px: number) => number
}

export default abstract class AxisImp {
  private readonly _parent: DrawPane<AxisImp>

  private _extremum: AxisExtremum = { min: 0, max: 0, range: 0, realMin: 0, realMax: 0, realRange: 0 }
  private _prevExtremum: AxisExtremum = { min: 0, max: 0, range: 0, realMin: 0, realMax: 0, realRange: 0 }
  private _ticks: AxisTick[] = []

  private _autoCalcTickFlag = true

  constructor (parent: DrawPane<AxisImp>) {
    this._parent = parent
  }

  getParent (): DrawPane<AxisImp> { return this._parent }

  buildTicks (force: boolean): boolean {
    if (this._autoCalcTickFlag) {
      this._extremum = this.calcExtremum()
    }
    if (this._prevExtremum.min !== this._extremum.min || this._prevExtremum.max !== this._extremum.max || force) {
      this._prevExtremum = this._extremum
      this._ticks = this.optimalTicks(this._calcTicks())
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

  setExtremum (extremum: AxisExtremum): void {
    this._autoCalcTickFlag = false
    this._extremum = extremum
  }

  getExtremum (): AxisExtremum { return this._extremum }

  setAutoCalcTickFlag (flag: boolean): void {
    this._autoCalcTickFlag = flag
  }

  getAutoCalcTickFlag (): boolean { return this._autoCalcTickFlag }

  private _calcTicks (): AxisTick[] {
    const { realMin, realMax, realRange } = this._extremum
    const ticks: AxisTick[] = []

    if (realRange >= 0) {
      const [interval, precision] = this._calcTickInterval(realRange)
      const first = round(Math.ceil(realMin / interval) * interval, precision)
      const last = round(Math.floor(realMax / interval) * interval, precision)
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

  protected abstract calcExtremum (): AxisExtremum

  protected abstract optimalTicks (ticks: AxisTick[]): AxisTick[]

  abstract getAutoSize (): number

  abstract convertToPixel (value: number): number
  abstract convertFromPixel (px: number): number
}
