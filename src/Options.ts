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

import type DeepPartial from './common/DeepPartial'
import { type Styles } from './common/Styles'
import { formatDate, formatBigNumber } from './common/utils/format'

import { type IndicatorCreate } from './component/Indicator'
import { type PaneOptions } from './pane/types'

export enum FormatDateType {
  Tooltip,
  Crosshair,
  XAxis
}

export type FormatDate = (dateTimeFormat: Intl.DateTimeFormat, timestamp: number, format: string, type: FormatDateType) => string

export type FormatBigNumber = (value: string | number) => string

export interface CustomApi {
  formatDate: FormatDate
  formatBigNumber: FormatBigNumber
}

export function getDefaultCustomApi (): CustomApi {
  return {
    formatDate,
    formatBigNumber
  }
}

export const defaultLocale = 'en-US'

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

export const enum LayoutChildType {
  Candle = 'candle',
  Indicator = 'indicator',
  XAxis = 'xAxis'
}

export interface LayoutChild {
  type: LayoutChildType
  content?: Array<string | IndicatorCreate>
  options?: PaneOptions
}

export interface Options {
  layout?: LayoutChild[]
  locale?: string
  timezone?: string
  styles?: string | DeepPartial<Styles>
  customApi?: Partial<CustomApi>
  thousandsSeparator?: string
  decimalFoldThreshold?: number
}
