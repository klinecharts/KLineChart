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

import type Nullable from './Nullable'
import { cancelAnimationFrame, DEFAULT_REQUEST_ID, requestAnimationFrame } from './utils/compatible'
import { merge } from './utils/typeChecks'

type AnimationDoFrameCallback = (frameTime: number) => void

interface AnimationOptions {
  duration: number
  iterationCount: number
}

export default class Animation {
  private readonly _options = { duration: 500, iterationCount: 1 }

  private _doFrameCallback: Nullable<AnimationDoFrameCallback>

  private _currentIterationCount = 0
  private _running = false

  private _requestAnimationId = DEFAULT_REQUEST_ID
  private _time = 0

  constructor(options?: Partial<AnimationOptions>) {
    merge(this._options, options)
  }

  private _loop(): void {
    this._running = true
    this._time = performance.now()
    const step = (timestamp: unknown): void => {
      this._requestAnimationId = DEFAULT_REQUEST_ID
      if (this._running) {
        const time = typeof timestamp === 'number' ? timestamp : performance.now()
        const diffTime = Math.max(0, time - this._time)
        if (diffTime < this._options.duration) {
          this._doFrameCallback?.(diffTime)
          if (this._running && this._requestAnimationId === DEFAULT_REQUEST_ID) {
            this._requestAnimationId = requestAnimationFrame(step)
          }
        } else {
          this.stop()
          this._currentIterationCount++
          if (this._currentIterationCount < this._options.iterationCount) {
            this._loop()
          }
        }
      }
    }
    this._requestAnimationId = requestAnimationFrame(step)
  }

  doFrame(callback: AnimationDoFrameCallback): this {
    this._doFrameCallback = callback
    return this
  }

  setDuration(duration: number): this {
    this._options.duration = duration
    return this
  }

  setIterationCount(iterationCount: number): this {
    this._options.iterationCount = iterationCount
    return this
  }

  start(): void {
    if (!this._running) {
      this._currentIterationCount = 0
      this._loop()
    }
  }

  stop(): void {
    if (this._running) {
      if (this._requestAnimationId !== DEFAULT_REQUEST_ID) {
        cancelAnimationFrame(this._requestAnimationId)
        this._requestAnimationId = DEFAULT_REQUEST_ID
      }
      this._doFrameCallback?.(this._options.duration)
    }
    this._running = false
  }

  cancel(): void {
    if (this._requestAnimationId !== DEFAULT_REQUEST_ID) {
      cancelAnimationFrame(this._requestAnimationId)
      this._requestAnimationId = DEFAULT_REQUEST_ID
    }
    this._running = false
  }
}
