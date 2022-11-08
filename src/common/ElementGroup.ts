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
import Element from './Element'

export default class ElementGroup extends Element {
  private _elements: Element[] = []

  checkEventOn (coordinate: Coordinate): boolean {
    for (const element of this._elements) {
      if (element.checkEventOn(coordinate)) {
        return true
      }
    }
    return false
  }

  dispatchEvent (type: string, coordinate: Coordinate): boolean {
    for (const element of this._elements) {
      if (element.onEvent(type, coordinate)) {
        return true
      }
    }
    return this.onEvent(type, coordinate)
  }

  addElement (element: Element): ElementGroup {
    this._elements.push(element)
    return this
  }

  clear (): void {
    this._elements = []
  }
}
