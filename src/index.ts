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

import { Options } from './common/Options'
import ChartImp, { Chart } from './Chart'

import { checkCoordinateOnArc, drawArc } from './extension/figure/arc'
import { checkCoordinateOnCircle, drawCircle } from './extension/figure/circle'
import {
  checkCoordinateOnLine, drawLine,
  getLinearYFromSlopeIntercept, getLinearSlopeIntercept, getLinearYFromCoordinates
} from './extension/figure/line'
import { checkCoordinateOnPolygon, drawPolygon } from './extension/figure/polygon'
import { checkCoordinateOnRect, drawRect } from './extension/figure/rect'
import { drawRectText } from './extension/figure/rectText'
import { checkCoordinateOnText, drawText } from './extension/figure/text'

import { registerFigure, getSupportedFigures, getFigureClass } from './extension/figure/index'
import { registerIndicator, getSupportedIndicators } from './extension/indicator/index'
import { registerLocale, getSupportedLocales } from './extension/i18n/index'
import { registerOverlay, getSupportedOverlays } from './extension/overlay/index'
import { registerStyles } from './extension/styles/index'

import { logError, logTag, logWarn } from './common/utils/logger'

import {
  clone, merge, isString, isNumber, isValid, isObject, isArray, isFunction, isBoolean
} from './common/utils/typeChecks'
import { formatValue, formatPrecision, formatBigNumber, formatDate } from './common/utils/format'

const instances: {[id: string]: Chart} = {}
let chartBaseId = 1

/**
 * Chart version
 * @return {string}
 */
function version (): string {
  return '__BUILD_VERSION__'
}

/**
 * Init chart instance
 * @param ds
 * @param options
 * @returns {Chart}
 */
function init (ds: HTMLElement | string, options?: Options): Chart | null {
  logTag()
  const errorMessage = 'The chart cannot be initialized correctly. Please check the parameters. The chart container cannot be null and child elements need to be added!!!'
  let dom
  if (isString(ds)) {
    dom = document.getElementById(ds as string)
  } else {
    dom = ds
  }
  if (dom === null) {
    logError('', '', errorMessage)
    return null
  }
  let chart = instances[dom.chartId ?? '']
  if (chart !== undefined) {
    logWarn('', '', 'The chart has been initialized on the dom！！！')
    return chart
  }
  const id = `k_line_chart_${chartBaseId++}`
  chart = new ChartImp(dom, options)
  // @ts-expect-error
  chart.id = id
  dom.chartId = id
  instances[id] = chart
  return chart
}

/**
 * Destory chart instace
 * @param dcs
 */
function dispose (dcs: HTMLElement | Chart | string): void {
  let id: string | null
  if (isString(dcs)) {
    const dom = document.getElementById(dcs as string)
    id = dom?.getAttribute('chartId') ?? null
  } else if (dcs instanceof ChartImp) {
    // @ts-expect-error
    id = dcs.id
  } else {
    // @ts-expect-error
    id = dcs ?? dcs.chartId
  }
  if (id !== null) {
    instances[id].destroy()
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete instances[id]
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
  formatDate,
  getLinearSlopeIntercept,
  getLinearYFromSlopeIntercept,
  getLinearYFromCoordinates,
  checkCoordinateOnArc,
  checkCoordinateOnCircle,
  checkCoordinateOnLine,
  checkCoordinateOnPolygon,
  checkCoordinateOnRect,
  checkCoordinateOnText,
  drawArc,
  drawCircle,
  drawLine,
  drawPolygon,
  drawRect,
  drawText,
  drawRectText
}

export {
  version, init, dispose,
  registerFigure, getSupportedFigures, getFigureClass,
  registerIndicator, getSupportedIndicators,
  registerOverlay, getSupportedOverlays,
  registerLocale, getSupportedLocales,
  registerStyles, utils
}
