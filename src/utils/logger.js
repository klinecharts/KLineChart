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

const DEV = '__BUILD_ENV__' === 'development'

/**
 * 打印警告日志
 * @param api
 * @param invalidParam
 * @param append
 */
export function logWarn (api, invalidParam, append = '') {
  if (DEV) {
    console.log(
      '%cklinecharts warning: \n%s%s%s',
      'color:#f58220;font-weight:bold',
      api ? `Call api ${api}${invalidParam || append ? ', ' : '.'}` : '',
      invalidParam ? `invalid parameter ${invalidParam}${append ? ', ' : '.'}` : '',
      append ? `${append}` : ''
    )
  }
}

/**
 * 打印错误日志
 * @param api
 * @param invalidParam
 * @param append
 */
export function logError (api, invalidParam, append = '') {
  if (DEV) {
    console.log(
      '%cklinecharts error: \n%s%s%s',
      'color:#ed1941;font-weight:bold',
      api ? `Call api ${api}${invalidParam || append ? ', ' : '.'},` : '',
      invalidParam ? `invalid parameter ${invalidParam}${append ? ', ' : '.'}` : '',
      append ? `${append}` : ''
    )
  }
}

/**
 * 打印标识
 */
export function logTag () {
  if (DEV) {
    console.log('%cKLINECHARTS __BUILD_VERSION__', 'font-size: 26px;color: #fff;text-shadow: #1e88e5 0px 2px,#1e88e5 2px 0px,#1e88e5 -2px 0px,#1e88e5 0px -2px,#1e88e5 -2px -2px,#1e88e5 2px 1.4px,#1e88e5 2px -2px,#1e88e5 -2px 2px')
  }
}
