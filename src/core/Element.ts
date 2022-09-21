
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
import Event from './Event'

export interface ElementEvent {
  onClick: Event
  onMouseEnter: Event
  onMouseLeave: Event
}

export default abstract class Element implements ElementEvent {
  private _clickCallback?: Event
  private _mouseEnterCallback?: Event
  private _mouseLeaveCallback?: Event

  setClickCallback (callback: Event): Element {
    this._clickCallback = callback
    return this
  }

  setMouseEnterCallback (callback: Event): Element {
    this._mouseEnterCallback = callback
    return this
  }

  setMouseLeaveCallback (callback: Event): Element {
    this._mouseLeaveCallback = callback
    return this
  }

  onClick (coordinate: Coordinate): void {
    if (this._clickCallback != null && this.checkEventOn(coordinate)) {
      this._clickCallback(coordinate)
    }
  }

  onMouseEnter (coordinate: Coordinate): void {
    if (this._mouseEnterCallback != null && this.checkEventOn(coordinate)) {
      this._mouseEnterCallback(coordinate)
    }
  }

  onMouseLeave (coordinate: Coordinate): void {
    if (this._mouseLeaveCallback != null && this.checkEventOn(coordinate)) {
      this._mouseLeaveCallback(coordinate)
    }
  }

  abstract checkEventOn (coordinate: Coordinate): boolean

  abstract draw (ctx: CanvasRenderingContext2D): void
}
