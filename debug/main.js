import { createApp, nextTick } from 'vue/dist/vue.esm-bundler.js'

import { init, dispose, version } from '../src/index.ts'

const MINUTE = 60 * 1000
const INITIAL_BAR_COUNT = 180
const CANDLE_TICKS = 8

const candleTypes = ['candle_solid', 'candle_stroke', 'candle_up_stroke', 'candle_down_stroke', 'ohlc', 'area']
const indicatorNames = ['MA', 'EMA', 'BOLL', 'VOL', 'MACD', 'RSI']
const speedOptions = [250, 500, 1000, 2000]

let chart = null
let dataList = []
let latestBar = null
let tickInCandle = 0
let streamCallback = null
let streamTimer = null
let indicatorIds = {}
let overlayIds = []

function formatNumber (value, precision = 2) {
  return Number.isFinite(value) ? value.toFixed(precision) : '--'
}

function formatTime (timestamp) {
  return new Intl.DateTimeFormat('zh-CN', {
    hour12: false,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(timestamp))
}

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

function updateActiveBar (volatility) {
  if (tickInCandle >= CANDLE_TICKS) {
    latestBar = createNextBar()
    tickInCandle = 0
  } else {
    const close = Math.max(1200, latestBar.close + (Math.random() - 0.48) * volatility)
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

function createStyleOptions (styles) {
  const barColors = {
    compareRule: styles.compareRule,
    upColor: styles.upColor,
    downColor: styles.downColor,
    noChangeColor: styles.noChangeColor,
    upBorderColor: styles.upColor,
    downBorderColor: styles.downColor,
    noChangeBorderColor: styles.noChangeColor,
    upWickColor: styles.upColor,
    downWickColor: styles.downColor,
    noChangeWickColor: styles.noChangeColor
  }
  return {
    grid: {
      show: styles.gridShow,
      horizontal: { show: styles.gridShow, color: styles.gridColor, style: styles.gridStyle },
      vertical: { show: styles.gridShow, color: styles.gridColor, style: styles.gridStyle }
    },
    candle: {
      type: styles.candleType,
      bar: barColors,
      priceMark: {
        show: styles.priceMarkShow,
        high: { show: styles.highLowMarkShow },
        low: { show: styles.highLowMarkShow },
        last: {
          show: styles.priceMarkShow,
          compareRule: styles.compareRule,
          upColor: styles.upColor,
          downColor: styles.downColor,
          noChangeColor: styles.noChangeColor,
          line: { show: styles.lastPriceLineShow }
        }
      },
      tooltip: {
        showRule: styles.tooltipShowRule,
        showType: styles.tooltipShowType
      }
    },
    indicator: {
      ohlc: {
        compareRule: styles.compareRule,
        upColor: styles.upColor,
        downColor: styles.downColor,
        noChangeColor: styles.noChangeColor
      },
      lastValueMark: { show: styles.indicatorLastValueShow },
      tooltip: {
        showRule: styles.tooltipShowRule,
        showType: styles.tooltipShowType
      }
    },
    xAxis: {
      show: styles.axisShow,
      axisLine: { show: styles.axisShow },
      tickLine: { show: styles.axisShow },
      tickText: { show: styles.axisTextShow }
    },
    yAxis: {
      show: styles.axisShow,
      axisLine: { show: styles.axisShow },
      tickLine: { show: styles.axisShow },
      tickText: { show: styles.axisTextShow }
    },
    crosshair: {
      show: styles.crosshairShow,
      horizontal: { show: styles.crosshairShow },
      vertical: { show: styles.crosshairShow }
    },
    separator: {
      fill: styles.separatorFill
    },
    overlay: {
      point: {
        color: styles.overlayPointColor,
        borderColor: styles.overlayPointColor,
        activeColor: styles.overlayColor,
        activeBorderColor: styles.overlayColor
      },
      line: { color: styles.overlayColor, size: 2, style: 'solid' },
      rect: { borderColor: styles.overlayColor, color: 'rgba(208, 100, 138, 0.12)' },
      polygon: { borderColor: styles.overlayColor, color: 'rgba(208, 100, 138, 0.12)' },
      circle: { borderColor: styles.overlayColor, color: 'rgba(208, 100, 138, 0.12)' },
      arc: { color: styles.overlayColor },
      text: { color: styles.overlayColor, borderColor: styles.overlayColor }
    }
  }
}

createApp({
  template: `
    <main class="debug-shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">KLineChart Vue Debug</p>
          <h1>实时行情调试台</h1>
        </div>
        <div class="status-strip" aria-live="polite">
          <span :class="['status-dot', runtime.streaming ? 'is-live' : 'is-paused']"></span>
          <span>{{ runtime.streaming ? '实时推送中' : '已暂停' }}</span>
        </div>
      </header>

      <section class="workspace">
        <aside class="control-panel" aria-label="调试控制">
          <section class="panel-section">
            <h2>实时与 API</h2>
            <div class="button-grid">
              <button type="button" @click="runtime.streaming = !runtime.streaming">{{ runtime.streaming ? '暂停' : '继续' }}</button>
              <button type="button" @click="resetData">重置数据</button>
              <button type="button" @click="scrollRealtime">定位最新</button>
              <button type="button" @click="writeSnapshot">输出快照</button>
            </div>
            <label class="field">
              <span>推送间隔</span>
              <select v-model.number="runtime.speed" @change="restartStream">
                <option v-for="speed in speedOptions" :key="speed" :value="speed">{{ speed }}ms</option>
              </select>
            </label>
            <label class="field">
              <span>波动幅度</span>
              <input type="range" min="1" max="24" v-model.number="runtime.volatility">
            </label>
          </section>

          <section class="panel-section">
            <h2>图表行为</h2>
            <label class="field">
              <span>Bar Space</span>
              <input type="range" min="3" max="24" v-model.number="api.barSpace" @input="applyApiOptions">
            </label>
            <label class="field">
              <span>右侧偏移</span>
              <input type="range" min="0" max="180" v-model.number="api.offsetRight" @input="applyApiOptions">
            </label>
            <label class="field">
              <span>缩放锚点</span>
              <select v-model="api.zoomAnchor" @change="applyApiOptions">
                <option value="last_bar">last_bar</option>
                <option value="cursor">cursor</option>
              </select>
            </label>
            <div class="inline-actions">
              <button type="button" @click="zoom(1.2)">放大</button>
              <button type="button" @click="zoom(0.8)">缩小</button>
              <button type="button" @click="scroll(-80)">左移</button>
              <button type="button" @click="scroll(80)">右移</button>
            </div>
            <label class="switch"><input type="checkbox" v-model="api.zoomEnabled" @change="applyApiOptions"><span>启用缩放</span></label>
            <label class="switch"><input type="checkbox" v-model="api.scrollEnabled" @change="applyApiOptions"><span>启用滚动</span></label>
          </section>

          <section class="panel-section">
            <h2>样式覆盖</h2>
            <label class="field">
              <span>主题</span>
              <select v-model="styles.theme" @change="applyStyles">
                <option value="light">light</option>
                <option value="dark">dark</option>
              </select>
            </label>
            <label class="field">
              <span>K 线类型</span>
              <select v-model="styles.candleType" @change="applyStyles">
                <option v-for="type in candleTypes" :key="type" :value="type">{{ type }}</option>
              </select>
            </label>
            <label class="field">
              <span>比较规则</span>
              <select v-model="styles.compareRule" @change="applyStyles">
                <option value="current_open">current_open</option>
                <option value="previous_close">previous_close</option>
              </select>
            </label>
            <div class="color-grid">
              <label class="field"><span>上涨色</span><input type="color" v-model="styles.upColor" @input="applyStyles"></label>
              <label class="field"><span>下跌色</span><input type="color" v-model="styles.downColor" @input="applyStyles"></label>
              <label class="field"><span>Overlay</span><input type="color" v-model="styles.overlayColor" @input="applyStyles"></label>
            </div>
            <label class="switch"><input type="checkbox" v-model="styles.gridShow" @change="applyStyles"><span>Grid</span></label>
            <label class="switch"><input type="checkbox" v-model="styles.crosshairShow" @change="applyStyles"><span>Crosshair</span></label>
            <label class="switch"><input type="checkbox" v-model="styles.priceMarkShow" @change="applyStyles"><span>价格标记</span></label>
            <label class="switch"><input type="checkbox" v-model="styles.highLowMarkShow" @change="applyStyles"><span>最高最低价</span></label>
            <label class="switch"><input type="checkbox" v-model="styles.lastPriceLineShow" @change="applyStyles"><span>最新价线</span></label>
          </section>

          <section class="panel-section">
            <h2>Tooltip / Axis</h2>
            <label class="field">
              <span>Tooltip 规则</span>
              <select v-model="styles.tooltipShowRule" @change="applyStyles">
                <option value="always">always</option>
                <option value="follow_cross">follow_cross</option>
                <option value="none">none</option>
              </select>
            </label>
            <label class="field">
              <span>Tooltip 类型</span>
              <select v-model="styles.tooltipShowType" @change="applyStyles">
                <option value="standard">standard</option>
                <option value="rect">rect</option>
              </select>
            </label>
            <label class="field">
              <span>Y 轴位置</span>
              <select v-model="api.yAxisPosition" @change="applyApiOptions">
                <option value="right">right</option>
                <option value="left">left</option>
              </select>
            </label>
            <label class="switch"><input type="checkbox" v-model="styles.axisShow" @change="applyStyles"><span>Axis 显示</span></label>
            <label class="switch"><input type="checkbox" v-model="styles.axisTextShow" @change="applyStyles"><span>Axis 文本</span></label>
            <label class="switch"><input type="checkbox" v-model="api.yAxisInside" @change="applyApiOptions"><span>Y 轴 inside</span></label>
            <label class="switch"><input type="checkbox" v-model="api.yAxisReverse" @change="applyApiOptions"><span>Y 轴 reverse</span></label>
            <label class="switch"><input type="checkbox" v-model="api.xAxisInside" @change="applyApiOptions"><span>X 轴 inside</span></label>
          </section>

          <section class="panel-section">
            <h2>格式化</h2>
            <label class="field">
              <span>Locale</span>
              <select v-model="api.locale" @change="applyApiOptions">
                <option value="zh-CN">zh-CN</option>
                <option value="en-US">en-US</option>
              </select>
            </label>
            <label class="field">
              <span>Timezone</span>
              <select v-model="api.timezone" @change="applyApiOptions">
                <option value="">local</option>
                <option value="Asia/Shanghai">Asia/Shanghai</option>
                <option value="America/New_York">America/New_York</option>
                <option value="UTC">UTC</option>
              </select>
            </label>
            <label class="field">
              <span>千分位</span>
              <select v-model="api.thousandsSeparator" @change="applyApiOptions">
                <option value=",">comma</option>
                <option value=" ">space</option>
                <option value="">none</option>
              </select>
            </label>
            <label class="field">
              <span>小数折叠阈值</span>
              <input type="number" min="0" max="16" v-model.number="api.decimalFoldThreshold" @change="applyApiOptions">
            </label>
          </section>

          <section class="panel-section">
            <h2>指标 / Pane</h2>
            <div class="toggle-grid">
              <label v-for="name in indicatorNames" :key="name" class="switch">
                <input type="checkbox" v-model="indicators[name]" @change="syncIndicators">
                <span>{{ name }}</span>
              </label>
            </div>
            <label class="field">
              <span>指标 Pane 高度</span>
              <input type="range" min="70" max="260" v-model.number="api.paneHeight" @input="applyApiOptions">
            </label>
            <label class="field">
              <span>Pane 状态</span>
              <select v-model="api.paneState" @change="applyApiOptions">
                <option value="normal">normal</option>
                <option value="maximize">maximize</option>
                <option value="minimize">minimize</option>
              </select>
            </label>
            <label class="switch"><input type="checkbox" v-model="styles.indicatorLastValueShow" @change="applyStyles"><span>指标最新值</span></label>
          </section>

          <section class="panel-section">
            <h2>覆盖物</h2>
            <div class="button-grid">
              <button type="button" @click="addOverlay('segment')">Segment</button>
              <button type="button" @click="addOverlay('priceLine')">Price Line</button>
              <button type="button" @click="addOverlay('horizontalStraightLine')">H Line</button>
              <button type="button" @click="clearOverlays">清除</button>
            </div>
          </section>
        </aside>

        <section class="chart-area" aria-label="实时 K 线图">
          <div class="metrics-strip">
            <div><span>最新价</span><strong>{{ metrics.lastPrice }}</strong></div>
            <div><span>涨跌幅</span><strong :data-trend="metrics.trend">{{ metrics.changeRate }}</strong></div>
            <div><span>K 线数量</span><strong>{{ metrics.barCount }}</strong></div>
            <div><span>更新时间</span><strong>{{ metrics.lastTime }}</strong></div>
          </div>
          <div ref="chartDom" class="chart"></div>
          <pre class="debug-log" aria-live="polite">{{ snapshotText }}</pre>
        </section>
      </section>
    </main>
  `,
  data () {
    return {
      speedOptions,
      candleTypes,
      indicatorNames,
      runtime: { streaming: true, speed: 1000, volatility: 7 },
      api: {
        barSpace: 6,
        offsetRight: 60,
        zoomEnabled: true,
        scrollEnabled: true,
        zoomAnchor: 'last_bar',
        timezone: '',
        locale: 'zh-CN',
        thousandsSeparator: ',',
        decimalFoldThreshold: 8,
        yAxisPosition: 'right',
        yAxisInside: false,
        yAxisReverse: false,
        xAxisInside: false,
        paneHeight: 120,
        paneState: 'normal'
      },
      styles: {
        theme: 'light',
        candleType: 'candle_solid',
        compareRule: 'current_open',
        upColor: '#2DC08E',
        downColor: '#F92855',
        noChangeColor: '#76808F',
        gridShow: true,
        gridStyle: 'dashed',
        gridColor: '#E2E8E7',
        crosshairShow: true,
        tooltipShowRule: 'always',
        tooltipShowType: 'standard',
        priceMarkShow: true,
        highLowMarkShow: true,
        lastPriceLineShow: true,
        axisShow: true,
        axisTextShow: true,
        separatorFill: true,
        indicatorLastValueShow: true,
        overlayColor: '#D0648A',
        overlayPointColor: '#167C80'
      },
      indicators: { MA: true, EMA: false, BOLL: false, VOL: true, MACD: false, RSI: false },
      metrics: { lastPrice: '--', changeRate: '--', trend: 'up', barCount: 0, lastTime: '--' },
      snapshot: {}
    }
  },
  computed: {
    snapshotText () {
      return JSON.stringify(this.snapshot, null, 2)
    }
  },
  mounted () {
    this.mountChart()
    window.addEventListener('resize', this.resizeChart)
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.resizeChart)
    window.clearInterval(streamTimer)
    if (this.$refs.chartDom) {
      dispose(this.$refs.chartDom)
    }
  },
  methods: {
    createDataLoader () {
      return {
        getBars: ({ callback }) => {
          callback(dataList, { forward: false, backward: false })
        },
        subscribeBar: ({ callback }) => {
          streamCallback = callback
          this.restartStream()
        },
        unsubscribeBar: () => {
          streamCallback = null
          window.clearInterval(streamTimer)
        }
      }
    },
    mountChart () {
      dispose(this.$refs.chartDom)
      dataList = createInitialData()
      latestBar = { ...dataList.at(-1) }
      tickInCandle = 0
      indicatorIds = {}
      overlayIds = []
      chart = init(this.$refs.chartDom, { layout: [{ type: 'candle' }, { type: 'xAxis' }] })
      chart.setSymbol({ ticker: 'KLC-REALTIME', pricePrecision: 2, volumePrecision: 0 })
      chart.setPeriod({ span: 1, type: 'minute' })
      chart.setDataLoader(this.createDataLoader())
      nextTick(() => {
        this.applyStyles()
        this.applyApiOptions()
        this.syncIndicators()
        this.refreshMetrics()
        this.writeSnapshot()
      })
    },
    restartStream () {
      window.clearInterval(streamTimer)
      streamTimer = window.setInterval(() => {
        if (!this.runtime.streaming || streamCallback === null || latestBar === null) {
          return
        }
        const bar = updateActiveBar(this.runtime.volatility)
        streamCallback(bar)
        this.refreshMetrics()
      }, this.runtime.speed)
    },
    refreshMetrics () {
      const list = chart?.getDataList() ?? dataList
      const latest = list.at(-1)
      const previous = list.at(-2)
      if (!latest) {
        return
      }
      const changeRate = previous ? ((latest.close - previous.close) / previous.close) * 100 : 0
      this.metrics = {
        lastPrice: formatNumber(latest.close),
        changeRate: `${changeRate >= 0 ? '+' : ''}${formatNumber(changeRate)}%`,
        trend: changeRate >= 0 ? 'up' : 'down',
        barCount: list.length,
        lastTime: formatTime(latest.timestamp)
      }
    },
    resetData () {
      dataList = createInitialData()
      latestBar = { ...dataList.at(-1) }
      tickInCandle = 0
      chart?.resetData()
      this.refreshMetrics()
      this.writeSnapshot()
    },
    applyStyles () {
      if (chart === null) {
        return
      }
      document.documentElement.dataset.theme = this.styles.theme
      chart.setStyles(this.styles.theme)
      chart.setStyles(createStyleOptions(this.styles))
      this.writeSnapshot()
    },
    applyApiOptions () {
      if (chart === null) {
        return
      }
      chart.setBarSpace(this.api.barSpace)
      chart.setOffsetRightDistance(this.api.offsetRight)
      chart.setZoomEnabled(this.api.zoomEnabled)
      chart.setScrollEnabled(this.api.scrollEnabled)
      chart.setZoomAnchor(this.api.zoomAnchor)
      chart.setLocale(this.api.locale)
      chart.setTimezone(this.api.timezone)
      chart.setThousandsSeparator({
        sign: this.api.thousandsSeparator,
        format: value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, this.api.thousandsSeparator)
      })
      chart.setDecimalFold({ threshold: this.api.decimalFoldThreshold, format: value => `${value}` })
      chart.overrideYAxis({
        name: 'normal',
        position: this.api.yAxisPosition,
        inside: this.api.yAxisInside,
        reverse: this.api.yAxisReverse,
        scrollZoomEnabled: this.api.zoomEnabled
      })
      chart.overrideXAxis({ name: 'normal', inside: this.api.xAxisInside, scrollZoomEnabled: this.api.zoomEnabled })
      const volumePaneId = indicatorIds.VOL
      if (volumePaneId) {
        chart.setPaneOptions({ id: volumePaneId, height: this.api.paneHeight, minHeight: 60, state: this.api.paneState })
      }
      this.refreshMetrics()
      this.writeSnapshot()
    },
    syncIndicators () {
      if (chart === null) {
        return
      }
      indicatorNames.forEach(name => {
        const active = this.indicators[name]
        const existingId = indicatorIds[name]
        if (active && !existingId) {
          const options = name === 'MA' || name === 'EMA' || name === 'BOLL'
            ? { isStack: true }
            : { pane: { minHeight: 60, height: this.api.paneHeight } }
          indicatorIds[name] = chart.createIndicator(name, options)
        } else if (!active && existingId) {
          chart.removeIndicator({ id: existingId })
          delete indicatorIds[name]
        }
      })
      this.applyApiOptions()
    },
    addOverlay (name) {
      const list = chart?.getDataList() ?? []
      if (chart === null || list.length < 60) {
        return
      }
      const startData = list[list.length - 55]
      const endData = list[list.length - 12]
      const points = name === 'priceLine'
        ? [{ timestamp: endData.timestamp, value: endData.close }]
        : [{ timestamp: startData.timestamp, value: startData.high }, { timestamp: endData.timestamp, value: endData.low }]
      const id = chart.createOverlay({ name, paneId: 'candle_pane', points })
      if (id) {
        overlayIds.push(id)
        chart.overrideOverlay({ id, styles: { line: { color: this.styles.overlayColor } } })
      }
      this.writeSnapshot()
    },
    clearOverlays () {
      chart?.removeOverlay()
      overlayIds = []
      this.writeSnapshot()
    },
    writeSnapshot () {
      if (chart === null) {
        return
      }
      this.snapshot = {
        version: version(),
        size: chart.getSize(),
        barSpace: chart.getBarSpace(),
        visibleRange: chart.getVisibleRange(),
        offsetRight: chart.getOffsetRightDistance(),
        zoomAnchor: chart.getZoomAnchor(),
        symbol: chart.getSymbol(),
        period: chart.getPeriod(),
        timezone: chart.getTimezone(),
        locale: chart.getLocale(),
        indicators: chart.getIndicators().map(({ id, name, paneId }) => ({ id, name, paneId })),
        overlays: chart.getOverlays().map(({ id, name, paneId }) => ({ id, name, paneId })),
        panes: chart.getPaneOptions(),
        latestBar: chart.getDataList().at(-1)
      }
      console.info('[KLineChart debug snapshot]', this.snapshot)
    },
    scrollRealtime () {
      chart?.scrollToRealTime(250)
    },
    scroll (distance) {
      chart?.scrollByDistance(distance, 180)
    },
    zoom (scale) {
      chart?.zoomAtCoordinate(scale, undefined, 180)
    },
    resizeChart () {
      chart?.resize()
    }
  }
}).mount('#root')
