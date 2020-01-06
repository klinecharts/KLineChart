import RootChart from './chart/RootChart'

function version () {
  return process.env.K_LINE_VERSION
}

function init (dom, style = {}) {
  return new RootChart(dom, style)
}

export { version, init }
