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

import type Nullable from './Nullable'
import { isValid } from './utils/typeChecks'

type TaskFinishedCallback = () => void

export default class TaskScheduler {
  private _holdingTasks: Nullable<Record<string, Promise<unknown>>> = null

  private _running = false

  private readonly _callback: Nullable<TaskFinishedCallback>

  constructor (callback: TaskFinishedCallback) {
    this._callback = callback
  }

  add (tasks: Record<string, Promise<unknown>>): void {
    if (!this._running) {
      void this._runTask(tasks)
    } else {
      if (isValid(this._holdingTasks)) {
        this._holdingTasks = {
          ...this._holdingTasks,
          ...tasks
        }
      } else {
        this._holdingTasks = tasks
      }
    }
  }

  private async _runTask (tasks: Record<string, Promise<unknown>>): Promise<void> {
    this._running = true
    try {
      await Promise.all(Object.values(tasks))
    } finally {
      this._running = false
      this._callback?.()
      if (isValid(this._holdingTasks)) {
        const next = this._holdingTasks
        void this._runTask(next)
        this._holdingTasks = null
      }
    }
  }

  clear (): void {
    this._holdingTasks = null
  }
}
