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

import Bounding, { getDefaultBounding } from '../common/Bounding'
import Updater, { UpdateLevel } from '../common/Updater'
import Eventful from '../common/Eventful'

import Axis from '../component/Axis'

import Pane from '../pane/Pane'

import { createDom } from '../common/utils/dom'
import { merge } from '../common/utils/typeChecks'

export default abstract class Widget<C extends Axis = Axis> extends Eventful implements Updater {
  /**
   * Parent pane
   */
  private readonly _pane: Pane<C>

  /**
   * Root dom container
   */
  private _container: HTMLElement

  private readonly _bounding: Bounding = getDefaultBounding()

  constructor (rootContainer: HTMLElement, pane: Pane<C>) {
    super()
    this._pane = pane
    this._init(rootContainer)
  }

  private _init (rootContainer: HTMLElement): void {
    this._container = createDom('div', this.getContainerStyle())
    if (this.insertBefore()) {
      const lastElement = rootContainer.lastChild
      if (lastElement !== null) {
        rootContainer.insertBefore(this._container, lastElement)
      } else {
        rootContainer.appendChild(this._container)
      }
    } else {
      rootContainer.appendChild(this._container)
    }
    this.initDom(this._container)
  }

  setBounding (bounding: Partial<Bounding>): Widget<C> {
    merge(this._bounding, bounding)
    return this
  }

  getContainer (): HTMLElement { return this._container }

  getBounding (): Bounding {
    return this._bounding
  }

  getPane (): Pane<C> {
    return this._pane
  }

  update (level: UpdateLevel): void {
    this.updateImp(level, this._container, this._bounding)
  }

  abstract getName (): string

  protected insertBefore (): boolean { return false }

  protected abstract getContainerStyle (): Partial<CSSStyleDeclaration>

  protected abstract initDom (container: HTMLElement): void

  protected abstract updateImp (level: UpdateLevel, container: HTMLElement, bounding: Bounding): void
}
