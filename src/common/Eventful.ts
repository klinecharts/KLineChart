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

import { isValid } from './utils/typeChecks'

import { type EventName, type MouseTouchEvent, type MouseTouchEventCallback } from './SyntheticEvent'

export interface EventDispatcher {
  dispatchEvent: (name: EventName, event: MouseTouchEvent, other?: number) => boolean
}

export default abstract class Eventful implements EventDispatcher {
  private _children: Eventful[] = []

  private readonly _callbacks = new Map<EventName, MouseTouchEventCallback>()

  registerEvent (name: EventName, callback: MouseTouchEventCallback): this {
    this._callbacks.set(name, callback)
    return this
  }

  onEvent (name: EventName, event: MouseTouchEvent, other?: number): boolean {
    const callback = this._callbacks.get(name)
    if (isValid(callback) && this.checkEventOn(event)) {
      return callback(event, other)
    }
    return false
  }

  checkEventOn (event: MouseTouchEvent): boolean {
    for (const eventful of this._children) {
      if (eventful.checkEventOn(event)) {
        return true
      }
    }
    return false
  }

  dispatchEvent (name: EventName, event: MouseTouchEvent, other?: number): boolean {
    const start = this._children.length - 1
    if (start > -1) {
      for (let i = start; i > -1; i--) {
        if (this._children[i].dispatchEvent(name, event, other)) {
          return true
        }
      }
    }
    return this.onEvent(name, event, other)
  }

  addChild (eventful: Eventful): this {
    this._children.push(eventful)
    return this
  }

  clear (): void {
    this._children = []
  }
}
