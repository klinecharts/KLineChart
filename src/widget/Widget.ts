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
import ElementGroup from '../common/ElementGroup'

import Axis from '../componentl/Axis'

import Pane from '../pane/Pane'

import { createDom } from '../common/utils/dom'
import { merge } from '../common/utils/typeChecks'

export default abstract class Widget<C extends Axis> extends ElementGroup implements Updater {
  private readonly _pane: Pane<C>

  private _container: HTMLElement

  private readonly _bounding: Required<Bounding> = getDefaultBounding()

  constructor (rootContainer: HTMLElement, pane: Pane<C>) {
    super()
    this._pane = pane
    this._init(rootContainer)
  }

  private _init (rootContainer: HTMLElement): void {
    this._container = createDom('div', this.getContainerStyle())
    rootContainer.appendChild(this._container)
    this.initDom(this._container)
  }

  setBounding (bounding: Bounding): Widget<C> {
    merge(this._bounding, bounding)
    return this
  }

  getContainer (): HTMLElement { return this._container }

  getBounding (): Required<Bounding> {
    return this._bounding
  }

  getPane (): Pane<C> {
    return this._pane
  }

  update (level: UpdateLevel): void {
    this.updateImp(level, this._container, this._bounding)
  }

  protected abstract getContainerStyle (): Partial<CSSStyleDeclaration>

  protected abstract initDom (container: HTMLElement): void

  protected abstract updateImp (level: UpdateLevel, container: HTMLElement, bounding: Required<Bounding>): void
}
