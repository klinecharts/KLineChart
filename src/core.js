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

function checkContainer (container) {
  return container && (container instanceof HTMLElement) && container.appendChild && (typeof container.appendChild === 'function')
}

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
  const errorMessage = 'Chart version is __BUILD_VERSION__. The chart cannot be initialized correctly. Please check the parameters. The chart container cannot be null and child elements need to be added!!!'
  let container
  if (!ds) {
    if (DEV) {
      console.error(errorMessage)
    }
    return null
  }
  if (typeof ds === 'string') {
    container = document.getElementById(ds)
    if (!checkContainer(container)) {
      container = document.getElementsByClassName(ds)
    }
  } else {
    container = ds
  }
  if (!checkContainer(container)) {
    if (DEV) {
      console.error(errorMessage)
    }
    return null
  }
  let chart = instances[container.chartId || '']
  if (chart) {
    if (DEV) {
      console.warn('The chart has been initialized on the dom！！！')
    }
    return chart
  }
  const id = `${CHART_NAME_PREFIX}${chartBaseId++}`
  chart = new Chart(container, style)
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
    let container
    if (typeof dcs === 'string') {
      container = document.getElementById(dcs)
      if (container) {
        id = container.chartId
      }
      if (!id) {
        container = document.getElementsByClassName(dcs)
        if (container) {
          id = container.chartId
        }
      }
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
