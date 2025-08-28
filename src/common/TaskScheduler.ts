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

import { isValid } from './utils/typeChecks'

export function generateTaskId (...params: string[]): string {
  return params.join('_')
}

interface Task<T> {
  id: string
  handler: () => Promise<T>
}

type TaskRun = () => void

export type TaskRejectReason = 'canceled' | 'failed'

interface TaskWrapper {
  run: TaskRun
  reject: (reason?: TaskRejectReason) => void
}

const DEFAULT_TASK_LIMIT = 5

export default class TaskScheduler {
  private readonly _limit: number
  private _running = 0
  private _queue: TaskRun[] = []
  private readonly _taskMap = new Map<string, TaskWrapper>()

  constructor (limit?: number) {
    this._limit = limit ?? DEFAULT_TASK_LIMIT
  }

  async add<T> (task: Task<T>): Promise<T> {
    return await new Promise<T>((resolve, reject) => {
      const { id, handler } = task
      const run: TaskRun = () => {
        this._running++
        handler().then(
          result => {
            resolve(result)
          }
        ).catch(
          () => {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors, prefer-promise-reject-errors -- ignore
            reject('failed')
          }
        ).finally(() => {
          this._running--
          this._taskMap.delete(id)
          this._next()
        })
      }

      const oldTaskWrapper = this._taskMap.get(id)
      if (isValid(oldTaskWrapper)) {
        oldTaskWrapper.reject('canceled')

        const index = this._queue.indexOf(oldTaskWrapper.run)
        if (index > -1) {
          this._queue.splice(index, 1)
        }
      }

      this._taskMap.set(id, { run, reject })
      this._queue.push(run)
      this._next()
    })
  }

  private _next (): void {
    while (this._running < this._limit && this._queue.length > 0) {
      const fn = this._queue.shift()
      fn?.()
    }
  }

  remove (id: string): void {
    const taskWrapper = this._taskMap.get(id)
    if (isValid(taskWrapper)) {
      this._taskMap.delete(id)

      const index = this._queue.indexOf(taskWrapper.run)
      if (index > -1) {
        this._queue.splice(index, 1)
      }

      taskWrapper.reject('canceled')
    }
  }

  clear (): void {
    for (const [, { reject }] of this._taskMap) {
      reject('canceled')
    }
    this._taskMap.clear()
    this._queue = []
  }
}
