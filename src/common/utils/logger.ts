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

const DEV = process.env.NODE_ENV === 'development'

function log (templateText: string, tagStyle: string, messageStyle: string, api: string, invalidParam: string, append: string): void {
  if (DEV) {
    const apiStr = api !== '' ? `Call api \`${api}\`${invalidParam !== '' || append !== '' ? ', ' : '.'}` : ''
    const invalidParamStr = invalidParam !== '' ? `invalid parameter \`${invalidParam}\`${append !== '' ? ', ' : '.'}` : ''
    const appendStr = append !== '' ? append : ''
    console.log(templateText, tagStyle, messageStyle, apiStr, invalidParamStr, appendStr)
  }
}

export function logWarn (api: string, invalidParam: string, append?: string): void {
  log(
    '%c😑 klinecharts warning%c %s%s%s',
    'padding:3px 4px;border-radius:2px;color:#ffffff;background-color:#FF9600',
    'color:#FF9600',
    api, invalidParam, append ?? ''
  )
}

export function logError (api: string, invalidParam: string, append?: string): void {
  log(
    '%c😟 klinecharts error%c %s%s%s',
    'padding:3px 4px;border-radius:2px;color:#ffffff;background-color:#F92855;',
    'color:#F92855;',
    api, invalidParam, append ?? ''
  )
}

export function logTag (): void {
  log(
    '%c❤️ Welcome to klinecharts. Version is __VERSION__',
    'border-radius:4px;border:dashed 1px #1677FF;line-height:70px;padding:0 20px;margin:16px 0;font-size:14px;color:#1677FF;',
    '',
    '',
    '',
    ''
  )
}
