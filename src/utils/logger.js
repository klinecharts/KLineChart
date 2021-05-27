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

import { DEV } from './env'

/**
 * 打印警告日志
 * @param api
 * @param invalidParam
 * @param append
 */
export function logWarn (api, invalidParam, append) {
  if (DEV) {
    console.warn(`Call chart api ${api}${invalidParam ? `, invalid parameter ${invalidParam}` : ''}${append ? `, ${append}` : ''}`)
  }
}
