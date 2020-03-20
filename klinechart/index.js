import Chart from './chart/Chart'
import { DEV } from './utils/env'

const instances = {}
let idBase = 1

/**
 * 获取版本号
 * @returns {string}
 */
function version () {
  return 'K_LINE_VERSION'
}

/**
 * 初始化
 * @param dom
 * @param style
 * @returns {RootChart}
 */
function init (dom, style = {}) {
  if (!dom) {
    throw new Error('Chart version is K_LINE_VERSION. Root dom is null, can not initialize the chart!!!')
  }
  const instance = instances[dom.chart_id || '']
  if (instance) {
    if (DEV) {
      console.warn('The chart has been initialized on the dom！！！')
    }
    return instance
  }
  const id = `k_line_chart_${idBase++}`
  const chart = new Chart(dom, style)
  chart.id = id
  dom.chart_id = id
  instances[id] = chart
  return chart
}

/**
 * 销毁
 * @param dc
 */
function dispose (dc) {
  if (dc) {
    let id = dc.chart_id
    if (!id && dc instanceof Chart) {
      id = dc.id
    }
    if (id) {
      delete instances[id]
    }
  }
}

export { version, init, dispose }
