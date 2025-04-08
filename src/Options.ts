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

import type { KLineData } from './common/Data'
import type DeepPartial from './common/DeepPartial'
import type { Styles } from './common/Styles'

import type { IndicatorCreate } from './component/Indicator'
import type { PaneOptions } from './pane/types'

export type FormatDateType = 'tooltip' | 'crosshair' | 'xAxis'

export interface FormatDateParams {
  dateTimeFormat: Intl.DateTimeFormat
  timestamp: number
  template: string
  type: FormatDateType
}

export type FormatDate = (params: FormatDateParams) => string

export type FormatBigNumber = (value: string | number) => string

export type ExtendTextType = 'lastPrice'

export interface FormatExtendTextParams {
  type: ExtendTextType
  data: KLineData
  index: number
}

export type FormatExtendText = (params: FormatExtendTextParams) => string

export interface Formatter {
  formatDate: FormatDate
  formatBigNumber: FormatBigNumber
  formatExtendText: FormatExtendText
}

export interface Locales {
  time: string
  open: string
  high: string
  low: string
  close: string
  volume: string
  change: string
  turnover: string
  [key: string]: string
}

export type LayoutChildType = 'candle' | 'indicator' | 'xAxis'

export interface LayoutChild {
  type: LayoutChildType
  content?: Array<string | IndicatorCreate>
  options?: PaneOptions
}

export interface DecimalFold {
  threshold: number
  format: (value: string | number) => string
}

export interface ThousandsSeparator {
  sign: string
  format: (value: string | number) => string
}

export interface Options {
  locale?: string
  timezone?: string
  styles?: string | DeepPartial<Styles>
  formatter?: Partial<Formatter>
  thousandsSeparator?: Partial<ThousandsSeparator>
  decimalFold?: Partial<DecimalFold>
  layout?: LayoutChild[]
}
