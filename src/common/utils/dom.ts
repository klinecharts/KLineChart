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
 * Create dom
 * @param tagName
 * @param styles
 * @return {*}
 */
export function createDom<K extends keyof HTMLElementTagNameMap> (tagName: K, styles?: Partial<CSSStyleDeclaration>): HTMLElementTagNameMap[K] {
  const dom = document.createElement(tagName)
  const s = styles ?? {}
  for (const key in s) {
    (dom.style)[key] = s[key] ?? ''
  }
  return dom
}
