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

import Bounding, { BoundingLike } from '../common/Bounding'
import Updater, { UpdateLevel } from '../common/Updater'

import Pane from '../panee/Pane'

import { createDom } from '../utils/dom'

export default abstract class Widget implements Updater {
  private readonly _pane: Pane

  private _container: HTMLDivElement

  private readonly _bounding: Bounding = new Bounding()

  constructor (rootContainer: HTMLElement, pane: Pane) {
    this._pane = pane
    this._init(rootContainer)
  }

  private _init (rootContainer: HTMLElement): void {
    this._container = createDom('div', this.getContainerStyle())
    rootContainer.appendChild(this._container)
    this.initDom(this._container)
  }

  setBounding (bounding: BoundingLike): Widget {
    this._bounding.merge(bounding)
    return this
  }

  getBounding (): Bounding {
    return this._bounding
  }

  getPane (): Pane {
    return this._pane
  }

  update (level: UpdateLevel): void {
    this.updateImp(level, this._container, this._bounding)
  }

  protected abstract getContainerStyle (): Partial<CSSStyleDeclaration>

  protected abstract initDom (container: HTMLElement): void

  protected abstract updateImp (level: UpdateLevel, container: HTMLElement, bounding: Bounding): void
}
