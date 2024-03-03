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

import { isFunction } from './utils/typeChecks'

export type ActionCallback = (data?: any) => void

export enum ActionType {
  OnDataReady = 'onDataReady',
  OnZoom = 'onZoom',
  OnScroll = 'onScroll',
  OnVisibleRangeChange = 'onVisibleRangeChange',
  OnTooltipIconClick = 'onTooltipIconClick',
  OnCrosshairChange = 'onCrosshairChange',
  OnCandleBarClick = 'onCandleBarClick',
  OnPaneDrag = 'onPaneDrag'
}

export default class Delegate {
  private _callbacks: ActionCallback[] = []

  subscribe (callback: ActionCallback): void {
    const index = this._callbacks.indexOf(callback) ?? -1
    if (index < 0) {
      this._callbacks.push(callback)
    }
  }

  unsubscribe (callback?: ActionCallback): void {
    if (isFunction(callback)) {
      const index = this._callbacks.indexOf(callback) ?? -1
      if (index > -1) {
        this._callbacks.splice(index, 1)
      }
    } else {
      this._callbacks = []
    }
  }

  execute (data?: any): void {
    this._callbacks.forEach(callback => {
      callback(data)
    })
  }

  isEmpty (): boolean {
    return this._callbacks.length === 0
  }
}
