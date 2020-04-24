/**
 * Copyright (c) 2019 lihu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import Chart from './Chart'
import { DEV } from './utils/env'

const instances = {}
let idBase = 1

const errorMessage = 'Chart version is K_LINE_VERSION. Root dom is null, can not initialize the chart!!!'

/**
 * 获取版本号
 * @returns {string}
 */
function version () {
  return 'K_LINE_VERSION'
}

/**
 * 初始化
 * @param ds
 * @param style
 * @returns {Chart}
 */
function init (ds, style = {}) {
  let container = ds
  if (!container) {
    throw new Error(errorMessage)
  }
  if (typeof container === 'string') {
    container = document.getElementById(ds) || document.getElementsByClassName(ds)
  }
  if (!container) {
    throw new Error(errorMessage)
  }
  const instance = instances[container.chart_id || '']
  if (instance) {
    if (DEV) {
      console.warn('The chart has been initialized on the dom！！！')
    }
    return instance
  }
  const id = `k_line_chart_${idBase++}`
  const chart = new Chart(container, style)
  chart.id = id
  container.chart_id = id
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
      id = dcs.chart_id
    }
    if (!id) {
      id = dcs.chart_id
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
