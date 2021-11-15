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

import EventHandler from './EventHandler'

const KeyBoardCode = {
  EQUAL: 'Equal',
  MINUS: 'Minus',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight'
}

export default class KeyBoardEventHandler extends EventHandler {
  /**
   * 键盘事件
   * @param event
   */
  keyBoardDownEvent (event) {
    if (event.shiftKey) {
      switch (event.code) {
        case KeyBoardCode.EQUAL: {
          this._chartStore.timeScaleStore().zoom(0.5)
          break
        }
        case KeyBoardCode.MINUS: {
          this._chartStore.timeScaleStore().zoom(-0.5)
          break
        }
        case KeyBoardCode.ARROW_LEFT: {
          this._chartStore.timeScaleStore().startScroll()
          this._chartStore.timeScaleStore().scroll(-3 * this._chartStore.timeScaleStore().dataSpace())
          break
        }
        case KeyBoardCode.ARROW_RIGHT: {
          this._chartStore.timeScaleStore().startScroll()
          this._chartStore.timeScaleStore().scroll(3 * this._chartStore.timeScaleStore().dataSpace())
          break
        }
        default: {
          break
        }
      }
    }
  }
}
