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

import Bounding from '../common/Bounding'
import { UpdateLevel } from '../common/Updater'
import Widget from './Widget'

import { createDom } from '../utils/dom'

export default class SeparatorWidget extends Widget {
  private _moveDom: HTMLDivElement

  protected getContainerStyle (): Partial<CSSStyleDeclaration> {
    return {
      margin: '0',
      padding: '0',
      position: 'relative',
      boxSizing: 'border-box'
    }
  }

  protected initDom (container: HTMLElement): void {
    this._moveDom = createDom('div', {
      width: '100%',
      height: '7px',
      margin: '0',
      padding: '0',
      position: 'absolute',
      top: '-3px',
      zIndex: '20',
      boxSizing: 'border-box'
    })
    container.appendChild(this._moveDom)
  }

  protected updateImp (level: UpdateLevel, container: HTMLElement, bounding: Bounding): void {
    if (level === UpdateLevel.ALL || level === UpdateLevel.SEPARATOR) {
      this._moveDom.style.top = `${-Math.floor((7 - separatorOptions.size) / 2)}px`
      container.style.backgroundColor = separatorOptions.color
      container.style.height = `${separatorOptions.size}px`
      container.style.marginLeft = `${separatorOptions.fill ? 0 : this._offsetLeft}px`
      container.style.width = separatorOptions.fill ? '100%' : `${bounding.width}px`
    }
  }
}
