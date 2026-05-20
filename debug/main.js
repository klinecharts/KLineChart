import { dispose, init } from '../src/index.ts'

const MINUTE = 60 * 1000
const INITIAL_BAR_COUNT = 180
const LOAD_FORWARD_BAR_COUNT = 80
const CANDLE_TICKS = 8
const PERIODS = [
  { key: '1m', label: '1m', period: { span: 1, type: 'minute' } },
  { key: '5m', label: '5m', period: { span: 5, type: 'minute' } },
  { key: '15m', label: '15m', period: { span: 15, type: 'minute' } },
  { key: '1h', label: '1h', period: { span: 1, type: 'hour' } },
  { key: '1d', label: '1d', period: { span: 1, type: 'day' } }
]

let chart = null
let dataList = []
let latestBar = null
let tickInCandle = 0
let streamCallback = null
let streamTimer = null
let loadingForward = false
let activePeriodKey = PERIODS[0].key
let mockDataVersion = 0

function setLoadStatus (text) {
  const statusDom = document.getElementById('load-status')
  if (statusDom !== null) {
    statusDom.textContent = text
  }
}

function setForwardButtonDisabled (disabled) {
  const button = document.getElementById('load-forward')
  if (button !== null) {
    button.disabled = disabled
  }
}

function getActivePeriodConfig () {
  return PERIODS.find(({ key }) => key === activePeriodKey) ?? PERIODS[0]
}

function getPeriodDuration (period) {
  switch (period.type) {
    case 'second': return period.span * 1000
    case 'minute': return period.span * MINUTE
    case 'hour': return period.span * 60 * MINUTE
    case 'day': return period.span * 24 * 60 * MINUTE
    case 'week': return period.span * 7 * 24 * 60 * MINUTE
    case 'month': return period.span * 30 * 24 * 60 * MINUTE
    case 'year': return period.span * 365 * 24 * 60 * MINUTE
    default: return MINUTE
  }
}

function setActivePeriodButton () {
  document.querySelectorAll('#period-switcher button').forEach(button => {
    button.classList.toggle('active', button.dataset.period === activePeriodKey)
  })
}

function createInitialData (period = getActivePeriodConfig().period) {
  const result = []
  let close = 2680
  const duration = getPeriodDuration(period)
  const start = Date.now() - INITIAL_BAR_COUNT * duration
  for (let i = 0; i < INITIAL_BAR_COUNT; i++) {
    const timestamp = start + i * duration
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

function createBar (timestamp, open, indexOffset) {
  const drift = Math.sin(indexOffset / 8) * 7 + (Math.random() - 0.48) * 18
  const close = Math.max(1200, open + drift)
  const high = Math.max(open, close) + Math.random() * 12
  const low = Math.min(open, close) - Math.random() * 12
  return {
    timestamp,
    open: Number(open.toFixed(2)),
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
    close: Number(close.toFixed(2)),
    volume: Math.round(900 + Math.random() * 6000)
  }
}

function createForwardData (timestamp, period = getActivePeriodConfig().period, count = LOAD_FORWARD_BAR_COUNT) {
  const result = []
  const duration = getPeriodDuration(period)
  let open = dataList[0]?.open ?? 2680
  for (let i = 1; i <= count; i++) {
    const bar = createBar(timestamp - i * duration, open, dataList.length - i)
    result.push(bar)
    open = bar.open
  }
  return result.reverse()
}

function createNextBar (period = getActivePeriodConfig().period) {
  const timestamp = latestBar.timestamp + getPeriodDuration(period)
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

function updateActiveBar (period = getActivePeriodConfig().period) {
  if (tickInCandle >= CANDLE_TICKS) {
    latestBar = createNextBar(period)
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
    getBars: ({ type, timestamp, period, callback }) => {
      if (type === 'forward') {
        const loadVersion = mockDataVersion
        loadingForward = true
        setForwardButtonDisabled(true)
        setLoadStatus(`Loading ${LOAD_FORWARD_BAR_COUNT} bars before ${new Date(timestamp).toLocaleString()}...`)
        window.setTimeout(() => {
          if (loadVersion !== mockDataVersion) {
            return
          }
          const forwardData = createForwardData(timestamp, period)
          dataList = forwardData.concat(dataList)
          loadingForward = false
          setForwardButtonDisabled(false)
          setLoadStatus(`Loaded ${forwardData.length} earlier ${getActivePeriodConfig().label} bars. Total: ${dataList.length}`)
          callback(forwardData, { forward: true, backward: false })
        }, 300)
        return
      }
      callback(dataList, { forward: true, backward: false })
      setLoadStatus(`${getActivePeriodConfig().label} initial bars: ${dataList.length}. Scroll left to load earlier data.`)
    },
    subscribeBar: ({ period, callback }) => {
      streamCallback = callback
      restartStream(period)
    },
    unsubscribeBar: () => {
      streamCallback = null
      window.clearInterval(streamTimer)
    }
  }
}

function restartStream (period = getActivePeriodConfig().period) {
  window.clearInterval(streamTimer)
  streamTimer = window.setInterval(() => {
    if (streamCallback === null || latestBar === null) {
      return
    }
    streamCallback(updateActiveBar(period))
  }, 1000)
}

function resetMockData (period = getActivePeriodConfig().period) {
  mockDataVersion += 1
  window.clearInterval(streamTimer)
  streamCallback = null
  dataList = createInitialData(period)
  latestBar = { ...dataList.at(-1) }
  tickInCandle = 0
  loadingForward = false
  setForwardButtonDisabled(false)
}

function switchPeriod (periodKey) {
  const config = PERIODS.find(({ key }) => key === periodKey)
  if (chart === null || config === undefined || activePeriodKey === periodKey) {
    return
  }
  activePeriodKey = periodKey
  resetMockData(config.period)
  setActivePeriodButton()
  setLoadStatus(`Switching to ${config.label}...`)
  chart.setPeriod(config.period)
}

function mountChart () {
  const chartDom = document.getElementById('chart')
  if (chartDom === null) {
    return
  }
  dispose(chartDom)
  resetMockData()
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
  chart.setPeriod(getActivePeriodConfig().period)
  chart.setDataLoader(createDataLoader())
  chart.createIndicator('EMA', { pane: { id: 'candle_pane' }, yAxis: { id: 'new' } })

  chart.createOverlay('brush')
}

function bindToolbar () {
  const button = document.getElementById('load-forward')
  button?.addEventListener('click', () => {
    if (chart === null || loadingForward) {
      return
    }
    chart.scrollToDataIndex(0, 250)
    setLoadStatus('Scrolling to the first bar...')
  })
  document.querySelectorAll('#period-switcher button').forEach(periodButton => {
    periodButton.addEventListener('click', () => {
      switchPeriod(periodButton.dataset.period)
    })
  })
  setActivePeriodButton()
}

window.addEventListener('beforeunload', () => {
  window.clearInterval(streamTimer)
  const chartDom = document.getElementById('chart')
  if (chartDom !== null) {
    dispose(chartDom)
  }
})

bindToolbar()
mountChart()
