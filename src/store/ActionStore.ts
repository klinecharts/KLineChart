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

import Action, { type ActionType, type ActionCallback } from '../common/Action'
import { isValid } from '../common/utils/typeChecks'

export default class ActionStore {
  /**
   * Chart action map
   */
  private readonly _actions = new Map<ActionType, Action>()

  execute (type: ActionType, data?: any): void {
    this._actions.get(type)?.execute(data)
  }

  subscribe (type: ActionType, callback: ActionCallback): void {
    if (!this._actions.has(type)) {
      this._actions.set(type, new Action())
    }
    this._actions.get(type)?.subscribe(callback)
  }

  /**
   * 取消事件订阅
   * @param type
   * @param callback
   * @return {boolean}
   */
  unsubscribe (type: ActionType, callback?: ActionCallback): void {
    const action = this._actions.get(type)
    if (isValid(action)) {
      action.unsubscribe(callback)
      if (action.isEmpty()) {
        this._actions.delete(type)
      }
    }
  }

  has (type: ActionType): boolean {
    const action = this._actions.get(type)
    return isValid(action) && !action.isEmpty()
  }
}
