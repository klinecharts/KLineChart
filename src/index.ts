/**
 *       ___           ___                   ___           ___           ___           ___           ___           ___           ___
 *      /\__\         /\__\      ___        /\__\         /\  \         /\  \         /\__\         /\  \         /\  \         /\  \
 *     /:/  /        /:/  /     /\  \      /::|  |       /::\  \       /::\  \       /:/  /        /::\  \       /::\  \        \:\  \
 *    /:/__/        /:/  /      \:\  \    /:|:|  |      /:/\:\  \     /:/\:\  \     /:/__/        /:/\:\  \     /:/\:\  \        \:\  \
 *   /::\__\____   /:/  /       /::\__\  /:/|:|  |__   /::\~\:\  \   /:/  \:\  \   /::\  \ ___   /::\~\:\  \   /::\~\:\  \       /::\  \
 *  /:/\:::::\__\ /:/__/     __/:/\/__/ /:/ |:| /\__\ /:/\:\ \:\__\ /:/__/ \:\__\ /:/\:\  /\__\ /:/\:\ \:\__\ /:/\:\ \:\__\     /:/\:\__\
 *  \/_|:|~~|~    \:\  \    /\/:/  /    \/__|:|/:/  / \:\~\:\ \/__/ \:\  \  \/__/ \/__\:\/:/  / \/__\:\/:/  / \/_|::\/:/  /    /:/  \/__/
 *     |:|  |      \:\  \   \::/__/         |:/:/  /   \:\ \:\__\    \:\  \            \::/  /       \::/  /     |:|::/  /    /:/  /
 *     |:|  |       \:\  \   \:\__\         |::/  /     \:\ \/__/     \:\  \           /:/  /        /:/  /      |:|\/__/     \/__/
 *     |:|  |        \:\__\   \/__/         /:/  /       \:\__\        \:\__\         /:/  /        /:/  /       |:|  |
 *      \|__|         \/__/                 \/__/         \/__/         \/__/         \/__/         \/__/         \|__|
 *
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

import ChartImp, { type Chart, type DomPosition, type YAxisFilter } from './Chart'
import type { ActionType } from './common/Action'
import type Nullable from './common/Nullable'
import type {CandleTooltipRectPosition, 
  CandleType, FeatureType, 
  LineType, PolygonType, TooltipFeaturePosition,TooltipShowRule, TooltipShowType 
} from './common/Styles'
import { calcTextWidth } from './common/utils/canvas'
import {
  formatBigNumber,
  formatFoldDecimal,
  formatPrecision,
  formatThousands,
  formatTimestampByTemplate, 
  formatValue
} from './common/utils/format'
import { logError, logTag, logWarn } from './common/utils/logger'
import {
  clone, isArray, isBoolean, isFunction, isNumber, isObject, isString, isValid, merge 
} from './common/utils/typeChecks'
import type { IndicatorSeries } from './component/Indicator'
import type { OverlayDrawingMode, OverlayMode } from './component/Overlay'
import type { YAxisOverride } from './component/YAxis'
import { checkCoordinateOnArc } from './extension/figure/arc'
import { checkCoordinateOnCircle } from './extension/figure/circle'
import { getFigureClass, getSupportedFigures, registerFigure } from './extension/figure/index'
import {
  checkCoordinateOnLine,
  getLinearSlopeIntercept,
  getLinearYFromCoordinates, 
  getLinearYFromSlopeIntercept
} from './extension/figure/line'
import { checkCoordinateOnPolygon } from './extension/figure/polygon'
import { checkCoordinateOnRect } from './extension/figure/rect'
import { checkCoordinateOnText } from './extension/figure/text'
import { getHotkey, getSupportedHotkeys, registerHotkey } from './extension/hotkey/index'
import { getSupportedLocales, registerLocale } from './extension/i18n/index'
import { getSupportedIndicators, registerIndicator } from './extension/indicator/index'
import { getOverlayClass, getSupportedOverlays, registerOverlay } from './extension/overlay/index'
import { registerStyles } from './extension/styles/index'
import { registerXAxis } from './extension/x-axis'
import { registerYAxis } from './extension/y-axis'
import type { FormatDateType, Options, ZoomAnchor } from './Options'

const charts = new Map<string, ChartImp>()
let chartBaseId = 1

/**
 * Chart version
 * @return {string}
 */
function version (): string {
  return '__VERSION__'
}

/**
 * Init chart instance
 * @param ds
 * @param options
 * @returns {Chart}
 */
function init (ds: HTMLElement | string, options?: Options): Nullable<Chart> {
  logTag()
  let dom: Nullable<HTMLElement> = null
  if (isString(ds)) {
    dom = document.getElementById(ds)
  } else {
    dom = ds
  }
  if (dom === null) {
    logError('', '', 'The chart cannot be initialized correctly. Please check the parameters. The chart container cannot be null and child elements need to be added!!!')
    return null
  }
  let chart = charts.get(dom.id)
  if (isValid(chart)) {
    logWarn('', '', 'The chart has been initialized on the dom！！！')
    return chart
  }
  const id = `k_line_chart_${chartBaseId++}`
  chart = new ChartImp(dom, options)
  chart.id = id
  dom.setAttribute('k-line-chart-id', id)
  charts.set(id, chart)
  return chart
}

/**
 * Destroy chart instance
 * @param dcs
 */
function dispose (dcs: HTMLElement | Chart | string): void {
  let id: Nullable<string> = null
  if (dcs instanceof ChartImp) {
    id = dcs.id
  } else {
    let dom: Nullable<HTMLElement> = null
    if (isString(dcs)) {
      dom = document.getElementById(dcs)
    } else {
      dom = dcs as HTMLElement
    }
    id = dom?.getAttribute('k-line-chart-id') ?? null
  }
  if (id !== null) {
    charts.get(id)?.destroy()
    charts.delete(id)
  }
}

const utils = {
  clone,
  merge,
  isString,
  isNumber,
  isValid,
  isObject,
  isArray,
  isFunction,
  isBoolean,
  formatValue,
  formatPrecision,
  formatBigNumber,
  formatDate: formatTimestampByTemplate,
  formatThousands,
  formatFoldDecimal,
  calcTextWidth,
  getLinearSlopeIntercept,
  getLinearYFromSlopeIntercept,
  getLinearYFromCoordinates,
  checkCoordinateOnArc,
  checkCoordinateOnCircle,
  checkCoordinateOnLine,
  checkCoordinateOnPolygon,
  checkCoordinateOnRect,
  checkCoordinateOnText
}

export {
  type ActionType, type CandleTooltipRectPosition,
  type CandleType, 
  type Chart, type DomPosition, dispose,type FeatureType, type FormatDateType, getFigureClass,getHotkey, getOverlayClass,getSupportedFigures, getSupportedHotkeys,getSupportedIndicators,getSupportedLocales,getSupportedOverlays, type IndicatorSeries, init, 
  type LineType, type OverlayDrawingMode, type OverlayMode, type PolygonType, 
  registerFigure, 
  registerHotkey, 
  registerIndicator, 
  registerLocale, 
  registerOverlay, 
  registerStyles,
  registerXAxis, registerYAxis,type TooltipFeaturePosition, type TooltipShowRule, type TooltipShowType, 
  utils,
  version, type YAxisFilter,type YAxisOverride, type ZoomAnchor
}
