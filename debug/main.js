import { dispose, init } from '../src/index.ts'

const MINUTE = 60 * 1000
const LOAD_BAR_COUNT = 100
const PERIODS = [
  { key: '1m', label: '1m', period: { span: 1, type: 'minute' } },
  { key: '5m', label: '5m', period: { span: 5, type: 'minute' } },
  { key: '15m', label: '15m', period: { span: 15, type: 'minute' } },
  { key: '1h', label: '1h', period: { span: 1, type: 'hour' } },
  { key: '1d', label: '1d', period: { span: 1, type: 'day' } }
]

let chart = null
const streamTimer = null
let activePeriodKey = PERIODS[0].key

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

function clamp (value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function randomBetween (min, max) {
  return min + Math.random() * (max - min)
}

function randomNormal () {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function roundPrice (price) {
  return Number(price.toFixed(2))
}

function createMarketState (period) {
  const periodFactor = period.type === 'day'
    ? 3.2
    : period.type === 'hour'
      ? 1.7
      : Math.sqrt(Math.max(period.span, 1))

  return {
    volatility: 0.0035 * periodFactor,
    trend: randomBetween(-0.00035, 0.00035) * periodFactor
  }
}

function createNextBar (open, timestamp, state) {
  state.trend = clamp(state.trend * 0.96 + randomNormal() * state.volatility * 0.035, -0.004, 0.004)
  state.volatility = clamp(state.volatility * 0.92 + Math.abs(randomNormal()) * 0.00065, 0.0018, 0.032)

  const shock = randomNormal() * state.volatility
  const jump = Math.random() < 0.035 ? randomNormal() * state.volatility * 3.2 : 0
  const close = Math.max(1, open * (1 + state.trend + shock + jump))
  const bodyHigh = Math.max(open, close)
  const bodyLow = Math.min(open, close)
  const wickRatio = state.volatility * randomBetween(0.35, 2.6)
  const high = bodyHigh * (1 + wickRatio * randomBetween(0.15, 1.1))
  const low = Math.max(1, bodyLow * (1 - wickRatio * randomBetween(0.15, 1.1)))
  const rangeRatio = (high - low) / open
  const volumeBase = 450 + open * 0.18
  const volumeSpike = Math.random() < 0.055 ? randomBetween(1.8, 4.8) : 1
  const volume = Math.round(volumeBase * (1 + rangeRatio * 90) * randomBetween(0.55, 1.45) * volumeSpike)

  return {
    timestamp,
    open: roundPrice(open),
    high: roundPrice(high),
    low: roundPrice(low),
    close: roundPrice(close),
    volume
  }
}

function createPreviousBar (nextOpen, timestamp, state) {
  const drift = state.trend + randomNormal() * state.volatility
  const open = Math.max(1, nextOpen / (1 + drift))
  const bar = createNextBar(open, timestamp, state)
  bar.close = roundPrice(nextOpen)
  bar.high = roundPrice(Math.max(bar.high, bar.open, bar.close))
  bar.low = roundPrice(Math.min(bar.low, bar.open, bar.close))
  return bar
}

function createForwardDataList (basePrice, timestamp, period, count = LOAD_BAR_COUNT) {
  const duration = getPeriodDuration(period)
  const dataList = []
  const state = createMarketState(period)
  let nextOpen = basePrice
  for (let i = 1; i <= count; i++) {
    const bar = createPreviousBar(nextOpen, timestamp - i * duration, state)
    dataList.unshift(bar)
    nextOpen = bar.open
  }
  return dataList
}

function createBackDataList (basePrice, timestamp, period, count = LOAD_BAR_COUNT) {
  const duration = getPeriodDuration(period)
  const dataList = []
  const state = createMarketState(period)
  let open = basePrice

  for (let i = 1; i <= count; i++) {
    const bar = createNextBar(open, timestamp + i * duration, state)
    dataList.push(bar)
    open = bar.close
  }
  return dataList
}

function createDataLoader () {
  return {
    getBars: ({ type, timestamp, period, callback }) => {
      let dataList = []
      switch (type) {
        case 'init': {
          const duration = getPeriodDuration(period)
          dataList = createBackDataList(2680, (timestamp ?? Date.now()) - LOAD_BAR_COUNT * duration, period)
          break
        }
        case 'forward': {
          const historyDataList = chart.getDataList()
          const firstData = historyDataList[0]
          dataList = createForwardDataList(firstData.open, timestamp, period)
          break
        }
        case 'backward': {
          const historyDataList = chart.getDataList()
          const lastData = historyDataList[historyDataList.length - 1]
          dataList = createBackDataList(lastData.close, timestamp, period)
          break
        }
      }
      // callback(dataList, { forward: true, backward: true })
      setTimeout(() => {
        callback(dataList, { forward: true, backward: true })
      }, 1000)
    },
    subscribeBar: ({ period, callback }) => {
    },
    unsubscribeBar: () => {
    }
  }
}

function switchPeriod (periodKey) {
  const config = PERIODS.find(({ key }) => key === periodKey)
  if (chart === null || config === undefined || activePeriodKey === periodKey) {
    return
  }
  activePeriodKey = periodKey
  setActivePeriodButton()
  chart.setPeriod(config.period)
}

function mountChart () {
  const chartDom = document.getElementById('chart')
  if (chartDom === null) {
    return
  }
  dispose(chartDom)
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

  // chart.createOverlay('brush')
}

function bindToolbar () {
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
