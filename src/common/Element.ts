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

import Coordinate from './Coordinate'

export type ElementEvent = (coordinate: Coordinate) => void

export interface ElementEventMap {
  onClick: ElementEvent
  onMouseEnter: ElementEvent
  onMouseLeave: ElementEvent
}

export default abstract class Element {
  private readonly _events = new Map<keyof ElementEventMap, ElementEvent>()

  registerEvent (type: keyof ElementEventMap, event: ElementEvent): Element {
    this._events.set(type, event)
    return this
  }

  onEvent (type: keyof ElementEventMap, coordinate: Coordinate): void {
    if (this._events.size === 0) {
      return
    }
    if (this.checkEventOn(coordinate)) {
      this._events.get(type)?.(coordinate)
    }
  }

  abstract checkEventOn (coordinate: Coordinate): boolean
}
