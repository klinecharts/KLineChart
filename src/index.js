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
import { DEV } from './utils/env'

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
  const errorMessage = 'Chart version is __BUILD_VERSION__. Root dom is null, can not initialize the chart!!!'
  let container = ds
  if (!container) {
    if (DEV) {
      console.warn(errorMessage)
    }
    return null
  }
  if (typeof container === 'string') {
    container = document.getElementById(ds) || document.getElementsByClassName(ds)
  }
  if (!container) {
    if (DEV) {
      console.warn(errorMessage)
    }
    return null
  }
  const instance = instances[container.chartId || '']
  if (instance) {
    if (DEV) {
      console.warn('The chart has been initialized on the dom！！！')
    }
    return instance
  }
  const id = `${CHART_NAME_PREFIX}${chartBaseId++}`
  const chart = new Chart(container, style)
  chart.id = id
  container.chartId = id
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
    if (typeof dcs === 'string') {
      dcs = document.getElementById(dcs) || document.getElementsByClassName(dcs)
      id = dcs.chartId
    }
    if (!id) {
      id = dcs.chartId
    }
    if (!id && dcs instanceof Chart) {
      id = dcs.id
    }
    if (id) {
      instances[id].destroy()
      delete instances[id]
    }
  }
}

export { version, init, dispose }
