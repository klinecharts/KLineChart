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

export function isIPad (ua) {
  return ua.match(/(iPad).*OS\s([\d_]+)/)
}

export function isIPhone (ua) {
  return !isIPad(ua) && ua.match(/(iPhone\sOS)\s([\d_]+)/)
}

export function isAndroid (ua) {
  // eslint-disable-next-line no-useless-escape
  return ua.match(/(Android);?[\s\/]+([\d.]+)?/)
}

export function isMobile (ua) {
  return isIPad(ua) || isIPhone(ua) || isAndroid(ua)
}
