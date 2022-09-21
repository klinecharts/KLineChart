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

export default abstract class ElementGroup<E extends Element> extends Element {
  private _elements: E[] = []

  constructor (elements?: E[]) {
    super()
    this._elements = elements ?? []
  }

  getElements (): E[] {
    return this._elements
  }

  setElements (elements: E[]): void {
    this._elements = elements
  }

  checkEventOn (coordinate: Coordinate): boolean {
    const intercept = this.interceptEvent()
    let on = false
    for (const el of this._elements) {
      if (el.checkEventOn(coordinate)) {
        on = true
        if (intercept) {
          break
        }
      }
    }
    return on
  }

  interceptEvent (): boolean {
    return false
  }
}
