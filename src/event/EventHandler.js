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

import { EventType } from './EventBase'

export function isTouch (event) {
  return event.type === EventType.TOUCH
}

export function isMouse (event) {
  return event.type === EventType.MOUSE
}

export default class EventHandler {
  constructor (chartData) {
    this._chartData = chartData
    this._chartContentSize = {}
    this._paneContentSize = {}
  }

  _checkEventPointX (x) {
    return x > 0 && x < this._chartContentSize.contentRight - this._chartContentSize.contentLeft
  }

  /**
   * 获取事件所在的窗口id
   * @param event
   * @return {string}
   */
  _getEventPaneId (event) {
    for (const paneId in this._paneContentSize) {
      if (Object.prototype.hasOwnProperty.call(this._paneContentSize, paneId)) {
        const size = this._paneContentSize[paneId]
        if (event.localY > size.contentTop && event.localY < size.contentBottom) {
          return paneId
        }
      }
    }
  }

  /**
   * 设置图表尺寸
   * @param chartContentSize
   */
  setChartContentSize (chartContentSize) {
    this._chartContentSize = chartContentSize
  }

  /**
   * 设置窗口尺寸
   * @param paneContentSize
   */
  setPaneContentSize (paneContentSize) {
    this._paneContentSize = paneContentSize
  }
}
