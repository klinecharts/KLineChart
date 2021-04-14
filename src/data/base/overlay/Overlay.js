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

import { isObject, clone, merge } from '../../../utils/typeChecks'

/**
 * 覆盖物
 */
export default class Overlay {
  constructor ({
    id, chartData, xAxis, yAxis
  }) {
    this._id = id
    this._chartData = chartData
    this._xAxis = xAxis
    this._yAxis = yAxis
    this._styles = null
  }

  /**
   * 绘制
   * @param ctx
   */
  draw (ctx) {}

  /**
   * 设置样式
   * @param styles
   * @param defaultStyles
   */
  setStyles (styles, defaultStyles) {
    if (!isObject(styles)) {
      return false
    }
    if (!this._styles) {
      this._styles = clone(defaultStyles)
    }
    merge(this._styles, styles)
    return true
  }

  /**
   * 获取id
   * @return {*}
   */
  id () {
    return this._id
  }

  /**
   * 检查鼠标点是否在图形上
   * @param point
   */
  checkMousePointOnGraphic (point) {}

  // -------------------- 事件开始 -------------------

  /**
   * 点击事件
   * @param id
   * @param event
   */
  onClick ({ id, event }) {}

  /**
   * 右击事件
   * @param id
   * @param event
   */
  onRightClick ({ id, event }) {}

  /**
   * 鼠标进入事件
   * @param id
   * @param event
   */
  onMouseEnter ({ id, event }) {}

  /**
   * 鼠标离开事件
   * @param id
   * @param event
   */
  onMouseLeave ({ id, event }) {}

  // -------------------- 事件结束 -------------------
}
