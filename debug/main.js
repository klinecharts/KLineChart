import { dispose, init } from '../src/index.ts'

const MINUTE = 60 * 1000
const LOAD_BAR_COUNT = 100
const STREAM_UPDATE_INTERVAL = 1000
const PERIODS = [
  { key: 'time-sharing', period: { span: 1, type: 'minute' }, candleType: 'area' },
  { key: '1m', period: { span: 1, type: 'minute' }, candleType: 'candle_solid' },
  { key: '5m', period: { span: 5, type: 'minute' }, candleType: 'candle_solid' },
  { key: '15m', period: { span: 15, type: 'minute' }, candleType: 'candle_solid' },
  { key: '1h', period: { span: 1, type: 'hour' }, candleType: 'candle_solid' },
  { key: '1d', period: { span: 1, type: 'day' }, candleType: 'candle_solid' }
]

let chart = null
let streamTimer = null
let activePeriodKey = PERIODS[0].key

function getActivePeriodConfig() {
  return PERIODS.find(({ key }) => key === activePeriodKey) ?? PERIODS[0]
}

function getPeriodDuration(period) {
  switch (period.type) {
    case 'second':
      return period.span * 1000
    case 'minute':
      return period.span * MINUTE
    case 'hour':
      return period.span * 60 * MINUTE
    case 'day':
      return period.span * 24 * 60 * MINUTE
    case 'week':
      return period.span * 7 * 24 * 60 * MINUTE
    case 'month':
      return period.span * 30 * 24 * 60 * MINUTE
    case 'year':
      return period.span * 365 * 24 * 60 * MINUTE
    default:
      return MINUTE
  }
}

function setActivePeriodButton() {
  document.querySelectorAll('#period-switcher button').forEach((button) => {
    button.classList.toggle('active', button.dataset.period === activePeriodKey)
  })
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function randomNormal() {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function roundPrice(price) {
  return Number(price.toFixed(2))
}

function createMarketState(period) {
  const periodFactor = period.type === 'day' ? 3.2 : period.type === 'hour' ? 1.7 : Math.sqrt(Math.max(period.span, 1))

  return {
    volatility: 0.0035 * periodFactor,
    trend: randomBetween(-0.00035, 0.00035) * periodFactor
  }
}

function createNextBar(open, timestamp, state) {
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

function createPreviousBar(nextOpen, timestamp, state) {
  const drift = state.trend + randomNormal() * state.volatility
  const open = Math.max(1, nextOpen / (1 + drift))
  const bar = createNextBar(open, timestamp, state)
  bar.close = roundPrice(nextOpen)
  bar.high = roundPrice(Math.max(bar.high, bar.open, bar.close))
  bar.low = roundPrice(Math.min(bar.low, bar.open, bar.close))
  return bar
}

function createForwardDataList(basePrice, timestamp, period, count = LOAD_BAR_COUNT) {
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

function createBackDataList(basePrice, timestamp, period, count = LOAD_BAR_COUNT) {
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

function stopRealtimeUpdates() {
  if (streamTimer !== null) {
    window.clearInterval(streamTimer)
    streamTimer = null
  }
}

function updateRealtimeBar(bar, state) {
  state.trend = clamp(state.trend * 0.98 + randomNormal() * state.volatility * 0.015, -0.004, 0.004)
  const changeRatio = clamp(state.trend * 0.08 + randomNormal() * state.volatility * 0.12, -0.012, 0.012)
  const close = roundPrice(Math.max(1, bar.close * (1 + changeRatio)))

  bar.close = close
  bar.high = roundPrice(Math.max(bar.high, close))
  bar.low = roundPrice(Math.min(bar.low, close))
  bar.volume += Math.max(1, Math.round(randomBetween(8, 65) * (1 + Math.abs(changeRatio) * 120)))
}

function startRealtimeUpdates(period, callback) {
  stopRealtimeUpdates()

  const dataList = chart?.getDataList() ?? []
  const lastBar = dataList[dataList.length - 1]
  if (lastBar === undefined) {
    return
  }

  const duration = getPeriodDuration(period)
  const state = createMarketState(period)
  let realtimeBar = { ...lastBar }

  streamTimer = window.setInterval(() => {
    const now = Date.now()
    if (now >= realtimeBar.timestamp + duration) {
      realtimeBar = {
        timestamp: realtimeBar.timestamp + duration,
        open: realtimeBar.close,
        high: realtimeBar.close,
        low: realtimeBar.close,
        close: realtimeBar.close,
        volume: 0
      }
    }

    updateRealtimeBar(realtimeBar, state)
    callback({ ...realtimeBar })
  }, STREAM_UPDATE_INTERVAL)
}

function createDataLoader() {
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
        callback(dataList, { forward: false, backward: false })
      }, 1000)
    },
    subscribeBar: ({ period, callback }) => {
      // startRealtimeUpdates(period, callback)
    },
    unsubscribeBar: () => {
      stopRealtimeUpdates()
    }
  }
}

function switchPeriod(periodKey) {
  const config = PERIODS.find(({ key }) => key === periodKey)
  if (chart === null || config === undefined || activePeriodKey === periodKey) {
    return
  }
  activePeriodKey = periodKey
  setActivePeriodButton()
  chart.setStyles({ candle: { type: config.candleType } })
  chart.setPeriod(config.period)
}

function mountChart() {
  const chartDom = document.getElementById('chart')
  if (chartDom === null) {
    return
  }
  dispose(chartDom)
  chart = init(chartDom, {
    styles: {
      candle: {
        type: getActivePeriodConfig().candleType,
        area: {
          point: {
            animation: true,
            animationDuration: 2000
          }
        }
      },
      indicator: {
        lastValueMark: {
          show: true
        }
      },
      crosshair: {
        horizontal: {
          features: [
            {
              id: '1',
              type: 'path',
              color: 'black',
              size: 20,
              backgroundColor: 'red',
              activeBackgroundColor: 'blue',
              paddingTop: 4,
              paddingLeft: 3,
              content: {
                path: 'M2.80417,10.9887L1.62563,12.1673C1.43037,12.3625,1.43037,12.6791,1.62563,12.8744C1.82089,13.0696,2.13748,13.0696,2.33274,12.8744L3.62638,11.5807C4.75595,12.2901,6.19328,12.7929,8,12.7929C13.1654,12.7929,15.3323,8.64289,15.8866,7.36789C16.0378,6.99289,16.0378,6.59289,15.8866,6.21789C15.5549,5.45486,14.6456,3.66212,12.8617,2.34545L14.3536,0.853553C14.5488,0.658291,14.5488,0.341709,14.3536,0.146447C14.1583,-0.0488155,13.8417,-0.0488155,13.6464,0.146447L12.0014,1.79154C10.9314,1.1969,9.61166,0.792893,8,0.792893C2.80945,0.792893,0.667717,4.94289,0.113386,6.21789C-0.0377951,6.59289,-0.0377951,6.99289,0.113386,7.36789C0.424435,8.08333,1.2353,9.70399,2.80417,10.9887ZM4.36012,10.847C5.32327,11.4074,6.52286,11.7929,8,11.7929C12.5606,11.7929,14.4756,8.11789,14.9543,6.99289C15.0047,6.86789,15.0047,6.74289,14.9543,6.61789C14.659,5.90846,13.8171,4.23812,12.1447,3.06241L9.96929,5.23782C10.3134,5.66543,10.5197,6.20642,10.5197,6.79289C10.5197,8.16789,9.38583,9.29289,8,9.29289C7.41596,9.29289,6.87667,9.09308,6.44815,8.75896L4.36012,10.847ZM5.79461,7.99829L3.5201,10.2728C2.06905,9.12119,1.32057,7.62825,1.04567,6.96789C0.995275,6.84289,0.995275,6.71789,1.04567,6.59289C1.52441,5.46789,3.43937,1.79289,8,1.79289C9.28868,1.79289,10.3661,2.08632,11.2596,2.53329L9.19759,4.5953C8.84086,4.40257,8.43271,4.29289,8,4.29289C6.61417,4.29289,5.48032,5.41789,5.48032,6.79289C5.48032,7.22918,5.59447,7.64029,5.79461,7.99829ZM7.16528,8.04183C7.40487,8.20032,7.69207,8.29289,8,8.29289C8.8315,8.29289,9.51181,7.61789,9.51181,6.79289C9.51181,6.48318,9.41593,6.1946,9.25216,5.95494L7.16528,8.04183ZM8.43602,5.35687L6.55616,7.23674C6.512,7.09633,6.48819,6.94724,6.48819,6.79289C6.48819,5.96789,7.1685,5.29289,8,5.29289C8.15142,5.29289,8.29782,5.31528,8.43602,5.35687Z'
              }
            }
          ]
        }
      }
    },
    layout: {
      basicParams: {
        // yAxisPosition: 'left',
        // paneHeight: 200
      }
    }
  })
  chart.setSymbol({ ticker: 'DEBUG', pricePrecision: 4, volumePrecision: 0 })
  chart.setPeriod(getActivePeriodConfig().period)
  chart.setDataLoader(createDataLoader())
  // const id = chart.createIndicator('EMA', true)
  // chart.createYAxis({ name: 'logarithm', position: 'left' })
  chart.createIndicator({ name: 'EMA', paneId: 'new' })
  // chart.createYAxis({ name: 'normal', position: 'left', paneId: 'new' })
  // chart.createIndicator('SAR', true)
  // chart.overrideIndicator({ id, yAxisId: 'new' })
  // chart.overrideYAxis({ id: 'new', position: 'left' })
  // chart.overrideYAxis({ paneId: 'candle_pane', name: 'percentage' })
  // chart.createOverlay('brush')
}

function bindToolbar() {
  document.querySelectorAll('#period-switcher button').forEach((periodButton) => {
    periodButton.addEventListener('click', () => {
      switchPeriod(periodButton.dataset.period)
    })
  })
  setActivePeriodButton()
}

window.addEventListener('beforeunload', () => {
  stopRealtimeUpdates()
  const chartDom = document.getElementById('chart')
  if (chartDom !== null) {
    dispose(chartDom)
  }
})

bindToolbar()
mountChart()
