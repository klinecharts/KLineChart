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

import Chart from './Chart'
import { logError, logTag, logWarn } from './utils/logger'
import {
  clone, merge, isString, isNumber, isValid, isObject, isArray, isFunction, isBoolean
} from './utils/typeChecks'

import { formatValue, formatPrecision, formatBigNumber } from './utils/format'

const instances = {}
let chartBaseId = 1
const CHART_NAME_PREFIX = 'k_line_chart_'

/**
 * 获取版本号
 * @returns {string}
 */
function version () {
  return '__BUILD_VERSION__'
}

/**
 * 初始化
 * @param ds
 * @param style
 * @returns {Chart}
 */
function init (ds, style = {}) {
  logTag()
  const errorMessage = 'The chart cannot be initialized correctly. Please check the parameters. The chart container cannot be null and child elements need to be added!!!'
  let dom
  if (!ds) {
    logError('', '', errorMessage)
    return null
  }
  if (isString(ds)) {
    dom = document.getElementById(ds)
  } else {
    dom = ds
  }
  if (!dom) {
    logError('', '', errorMessage)
    return null
  }
  let chart = instances[dom.chartId || '']
  if (chart) {
    logWarn('', '', 'The chart has been initialized on the dom！！！')
    return chart
  }
  const id = `${CHART_NAME_PREFIX}${chartBaseId++}`
  chart = new Chart(dom, style)
  chart.id = id
  dom.chartId = id
  instances[id] = chart
  return chart
}

/**
 * 销毁
 * @param dcs
 */
function dispose (dcs) {
  if (dcs) {
    let id
    if (isString(dcs)) {
      const dom = document.getElementById(dcs)
      id = dom && dom.chartId
    } else if (dcs instanceof Chart) {
      id = dcs.id
    } else {
      id = dcs && dcs.chartId
    }
    if (id) {
      instances[id].destroy()
      delete instances[id]
    }
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
  formatBigNumber
}

export {
  version, init, dispose, utils
}
