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

export function isFF (): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return (window.navigator.userAgent.toLowerCase().indexOf('firefox') ?? -1) > -1
}

export function isIOS (): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return /iPhone|iPad|iPod/.test(window.navigator.platform)
}
