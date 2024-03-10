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

import { type Locales } from '../../Options'

import zhCN from './zh-CN'
import enUS from './en-US'

const locales: Record<string, Locales> = {
  'zh-CN': zhCN,
  'en-US': enUS
}

function registerLocale (locale: string, ls: Locales): void {
  locales[locale] = { ...locales[locale], ...ls }
}

function getSupportedLocales (): string[] {
  return Object.keys(locales)
}

function i18n (key: string, locale: string): string {
  return locales[locale]?.[key] ?? key
}

export { i18n, registerLocale, getSupportedLocales }
