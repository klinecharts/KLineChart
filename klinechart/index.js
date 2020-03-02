import RootChart from './chart/RootChart'
import { VERSION, DEV } from './utils/env'

const instances = {}
let idBase = 1

function version () {
  return VERSION
}

function init (dom, style = {}) {
  if (!dom) {
    throw new Error(`Chart version is ${VERSION}. Root dom is null, can not initialize the chart!!!`)
  }
  const instance = instances[dom.chart_id || '']
  if (instance) {
    if (DEV) {
      console.warn('The chart has been initialized on the dom！！！')
    }
    return instance
  }
  const chart = new RootChart(dom, style)
  const id = `k_line_chart_${idBase++}`
  dom.chart_id = id
  instances[id] = chart
  return chart
}

export { version, init }
