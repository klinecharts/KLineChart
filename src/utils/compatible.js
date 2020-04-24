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

/**
 * requestAnimationFrame兼容
 * @param fn
 */
export function requestAnimationFrame (fn) {
  if (!window.requestAnimationFrame) {
    return window.setTimeout(() => { fn() }, 1000 / 60)
  }
  return window.requestAnimationFrame(fn)
}

/**
 * cancelAnimationFrame兼容
 * @param id
 */
export function cancelAnimationFrame (id) {
  if (!window.cancelAnimationFrame) {
    clearTimeout(id)
  }
  window.cancelAnimationFrame(id)
}
