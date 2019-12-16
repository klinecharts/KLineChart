import RootChart from './chart/RootChart'

const version = process.env.K_LINE_VERSION

function init (dom, config = {}) {
  return new RootChart(dom, config)
}

export { version, init }
