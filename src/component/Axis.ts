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

import Pane from '../pane/Pane'

import { getPrecision, nice, round } from '../common/utils/number'
import { createDom } from '../common/utils/dom'
import { getPixelRatio } from '../common/utils/canvas'

export interface Tick {
  coord: number
  value: number | string
  text: string
}

export interface Extremum {
  min: number
  max: number
  range: number
  realMin: number
  realMax: number
  realRange: number
}

export default abstract class Axis {
  private readonly _parent: Pane<Axis>

  private _extremum: Extremum = { min: 0, max: 0, range: 0, realMin: 0, realMax: 0, realRange: 0 }
  private _prevExtremum: Extremum = { min: 0, max: 0, range: 0, realMin: 0, realMax: 0, realRange: 0 }
  private _ticks: Tick[] = []

  private readonly _measureCtx: CanvasRenderingContext2D

  constructor (parent: Pane<Axis>) {
    this._parent = parent
    const canvas = createDom('canvas')
    const pixelRatio = getPixelRatio(canvas)
    this._measureCtx = canvas.getContext('2d') as CanvasRenderingContext2D
    this._measureCtx.scale(pixelRatio, pixelRatio)
  }

  getParent (): Pane<Axis> { return this._parent }

  getMeasureCtx (): CanvasRenderingContext2D { return this._measureCtx }

  buildTicks (force: boolean): boolean {
    this._extremum = this.calcExtremum()
    if (this._prevExtremum.min !== this._extremum.min || this._prevExtremum.max !== this._extremum.max || force) {
      this._prevExtremum = this._extremum
      this._ticks = this.optimalTicks(this._calcTicks())
      return true
    }
    return false
  }

  getTicks (): Tick[] {
    return this._ticks
  }

  getExtremum (): Extremum { return this._extremum }

  private _calcTicks (): Tick[] {
    const { realMin, realMax, realRange } = this._extremum
    const ticks: Tick[] = []

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

  protected abstract calcExtremum (): Extremum

  protected abstract optimalTicks (ticks: Tick[]): Tick[]

  abstract convertToPixel (value: number): number
  abstract convertFromPixel (px: number): number
}
