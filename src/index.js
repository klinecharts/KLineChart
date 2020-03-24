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
