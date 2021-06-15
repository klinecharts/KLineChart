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

const ArrowKey = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight'
}

export default class KeyBoardEventHandler extends EventHandler {
  /**
   * 键盘事件
   * @param event
   */
  keyBoardDownEvent (event) {
    if (event.shiftKey) {
      switch (event.code) {
        case ArrowKey.UP: {
          this._chartData.zoom(-0.5)
          break
        }
        case ArrowKey.DOWN: {
          this._chartData.zoom(0.5)
          break
        }
        case ArrowKey.LEFT: {
          this._chartData.startScroll()
          this._chartData.scroll(-this._chartData.dataSpace())
          break
        }
        case ArrowKey.RIGHT: {
          this._chartData.startScroll()
          this._chartData.scroll(this._chartData.dataSpace())
          break
        }
        default: {
          break
        }
      }
    }
  }
}
