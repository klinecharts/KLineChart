import { dispose, init } from '../src/index.ts'

const MINUTE = 60 * 1000
const INITIAL_BAR_COUNT = 180
const CANDLE_TICKS = 8

let chart = null
let dataList = []
let latestBar = null
let tickInCandle = 0
let streamCallback = null
let streamTimer = null

function createInitialData () {
  const result = []
  let close = 2680
  const start = Date.now() - INITIAL_BAR_COUNT * MINUTE
  for (let i = 0; i < INITIAL_BAR_COUNT; i++) {
    const timestamp = start + i * MINUTE
    const open = close
    const drift = Math.sin(i / 8) * 7 + (Math.random() - 0.48) * 18
    close = Math.max(1200, open + drift)
    const high = Math.max(open, close) + Math.random() * 12
    const low = Math.min(open, close) - Math.random() * 12
    result.push({
      timestamp,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.round(900 + Math.random() * 6000)
    })
  }
  return result
}

function createNextBar () {
  const timestamp = latestBar.timestamp + MINUTE
  const open = latestBar.close
  const close = Math.max(1200, open + (Math.random() - 0.46) * 20)
  return {
    timestamp,
    open: Number(open.toFixed(2)),
    high: Number(Math.max(open, close).toFixed(2)),
    low: Number(Math.min(open, close).toFixed(2)),
    close: Number(close.toFixed(2)),
    volume: Math.round(500 + Math.random() * 5000)
  }
}

function updateActiveBar () {
  if (tickInCandle >= CANDLE_TICKS) {
    latestBar = createNextBar()
    tickInCandle = 0
  } else {
    const close = Math.max(1200, latestBar.close + (Math.random() - 0.48) * 10)
    latestBar = {
      ...latestBar,
      close: Number(close.toFixed(2)),
      high: Number(Math.max(latestBar.high, close).toFixed(2)),
      low: Number(Math.min(latestBar.low, close).toFixed(2)),
      volume: latestBar.volume + Math.round(100 + Math.random() * 700)
    }
    tickInCandle += 1
  }
  return { ...latestBar }
}

function createDataLoader () {
  return {
    getBars: ({ callback }) => {
      callback(dataList, { forward: false, backward: false })
    },
    subscribeBar: ({ callback }) => {
      streamCallback = callback
      restartStream()
    },
    unsubscribeBar: () => {
      streamCallback = null
      window.clearInterval(streamTimer)
    }
  }
}

function restartStream () {
  window.clearInterval(streamTimer)
  streamTimer = window.setInterval(() => {
    if (streamCallback === null || latestBar === null) {
      return
    }
    streamCallback(updateActiveBar())
  }, 1000)
}

function mountChart () {
  const chartDom = document.getElementById('chart')
  if (chartDom === null) {
    return
  }
  dispose(chartDom)
  dataList = createInitialData()
  latestBar = { ...dataList.at(-1) }
  tickInCandle = 0
  chart = init(chartDom, {
    layout: {
      basicParams: {
        // yAxisPosition: 'left',
        // paneHeight: 200
      },
      panes: [{ type: 'candle' }, { type: 'indicator', content: ['MA'] }]
    }
  })
  chart.setSymbol({ ticker: 'DEBUG', pricePrecision: 2, volumePrecision: 0 })
  chart.setPeriod({ span: 1, type: 'minute' })
  chart.setDataLoader(createDataLoader())
  chart.createIndicator('EMA', { pane: { id: 'candle_pane' }, yAxis: { id: 'new' } })
}

window.addEventListener('beforeunload', () => {
  window.clearInterval(streamTimer)
  const chartDom = document.getElementById('chart')
  if (chartDom !== null) {
    dispose(chartDom)
  }
})

mountChart()
