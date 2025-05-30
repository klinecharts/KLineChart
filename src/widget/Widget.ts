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

import type Bounding from '../common/Bounding'
import { createDefaultBounding } from '../common/Bounding'
import type Updater from '../common/Updater'
import { UpdateLevel } from '../common/Updater'
import Eventful from '../common/Eventful'

import type Pane from '../pane/Pane'

import { isString, merge } from '../common/utils/typeChecks'
import type { MouseTouchEvent } from '../common/EventHandler'
import type Nullable from '../common/Nullable'

export default abstract class Widget<P extends Pane = Pane> extends Eventful implements Updater {
  /**
   * root container
   */
  private readonly _rootContainer: HTMLElement

  /**
   * Parent pane
   */
  private readonly _pane: P

  /**
   * wrapper container
   */
  private readonly _container: HTMLElement

  private readonly _bounding: Bounding = createDefaultBounding()

  private _cursor = 'crosshair'

  private _forceCursor: Nullable<string> = null

  constructor (rootContainer: HTMLElement, pane: P) {
    super()
    this._pane = pane
    this._rootContainer = rootContainer
    this._container = this.createContainer()
    rootContainer.appendChild(this._container)
  }

  setBounding (bounding: Partial<Bounding>): this {
    merge(this._bounding, bounding)
    return this
  }

  getContainer (): HTMLElement { return this._container }

  getBounding (): Bounding {
    return this._bounding
  }

  getPane (): P {
    return this._pane
  }

  override checkEventOn (_: MouseTouchEvent): boolean {
    return true
  }

  setCursor (cursor: string): void {
    if (!isString(this._forceCursor)) {
      if (cursor !== this._cursor) {
        this._cursor = cursor
        this._container.style.cursor = this._cursor
      }
    }
  }

  setForceCursor (cursor: Nullable<string>): void {
    if (cursor !== this._forceCursor) {
      this._forceCursor = cursor
      this._container.style.cursor = this._forceCursor ?? this._cursor
    }
  }

  getForceCursor (): Nullable<string> {
    return this._forceCursor
  }

  update (level?: UpdateLevel): void {
    this.updateImp(this._container, this._bounding, level ?? UpdateLevel.Drawer)
  }

  destroy (): void {
    this._rootContainer.removeChild(this._container)
  }

  abstract getName (): string

  protected abstract createContainer (): HTMLElement

  protected abstract updateImp (container: HTMLElement, bounding: Bounding, level: UpdateLevel): void
}
