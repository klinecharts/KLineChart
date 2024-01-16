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

import { isFunction } from './typeChecks'

export const DEFAULT_REQUEST_ID = -1

export function requestAnimationFrame (fn: (params: any) => any): number {
  if (isFunction(window.requestAnimationFrame)) {
    return window.requestAnimationFrame(fn)
  }
  return window.setTimeout(fn, 20)
}

export function cancelAnimationFrame (id: number): void {
  if (isFunction(window.cancelAnimationFrame)) {
    window.cancelAnimationFrame(id)
  } else {
    window.clearTimeout(id)
  }
}

export function requestIdleCallback (fn: IdleRequestCallback): number {
  if (isFunction(window.requestIdleCallback)) {
    return window.requestIdleCallback(fn)
  }
  const startTime = performance.now()
  return window.setTimeout(function () {
    fn({
      didTimeout: false,
      timeRemaining () {
        return Math.max(0, 50 - (performance.now() - startTime))
      }
    })
  }, 1)
}

export function cancelIdleCallback (id: number): void {
  if (isFunction(window.cancelIdleCallback)) {
    window.cancelIdleCallback(id)
  } else {
    window.clearTimeout(id)
  }
}
