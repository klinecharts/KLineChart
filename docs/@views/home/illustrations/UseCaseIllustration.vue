<script setup>
const props = defineProps({
  variant: {
    type: Number,
    required: true,
    validator: value => value >= 1 && value <= 4
  }
})

const uid = `uc-${props.variant}`

const CANDLE_BODY_W = 3
const CANDLE_HALF = CANDLE_BODY_W / 2
const CHART_TOP = 34
const CHART_BOTTOM = 90
const DATA_MIN = 50
const DATA_MAX = 86
const DATA_RANGE = DATA_MAX - DATA_MIN

const terminalCandles = [
  { x: 42, open: 78, high: 72, low: 82, close: 74, vol: 4 },
  { x: 50, open: 74, high: 68, low: 78, close: 70, vol: 6 },
  { x: 58, open: 70, high: 66, low: 76, close: 74, vol: 3 },
  { x: 66, open: 74, high: 64, low: 78, close: 66, vol: 7 },
  { x: 74, open: 66, high: 62, low: 72, close: 70, vol: 5 },
  { x: 82, open: 70, high: 58, low: 74, close: 60, vol: 8 },
  { x: 90, open: 60, high: 56, low: 68, close: 64, vol: 4 },
  { x: 98, open: 64, high: 54, low: 68, close: 56, vol: 7 },
  { x: 106, open: 56, high: 52, low: 62, close: 58, vol: 5 },
  { x: 114, open: 58, high: 50, low: 64, close: 52, vol: 6 }
]

const replayCandles = [
  { x: 46, open: 80, high: 74, low: 84, close: 76, vol: 3 },
  { x: 56, open: 76, high: 70, low: 80, close: 72, vol: 5 },
  { x: 66, open: 72, high: 66, low: 78, close: 68, vol: 6 },
  { x: 76, open: 68, high: 62, low: 74, close: 70, vol: 4 },
  { x: 86, open: 70, high: 58, low: 74, close: 60, vol: 7 },
  { x: 96, open: 60, high: 56, low: 68, close: 64, vol: 4 },
  { x: 106, open: 64, high: 54, low: 68, close: 58, vol: 6 }
]

const dashboardCards = [
  { x: 18, y: 16, symbol: 'MSFT', trend: 'M26 48 L32 46 L38 47 L44 44 L50 45 L56 42 L62 43 L68 41', up: true },
  { x: 84, y: 16, symbol: 'NVDA', trend: 'M92 40 L98 42 L104 41 L110 43 L116 42 L122 44 L128 43 L134 45', up: false },
  { x: 18, y: 64, symbol: 'AAPL', trend: 'M26 94 L32 92 L38 93 L44 90 L50 91 L56 88 L62 89 L68 87', up: true },
  { x: 84, y: 64, symbol: 'TSLA', trend: 'M92 88 L98 90 L104 89 L110 91 L116 90 L122 92 L128 91 L134 93', up: false }
]

function isBullCandle (candle) {
  return candle.close < candle.open
}

function chartY (value) {
  return CHART_TOP + ((value - DATA_MIN) / DATA_RANGE) * (CHART_BOTTOM - CHART_TOP)
}

function candleBodyY (candle) {
  return chartY(Math.min(candle.open, candle.close))
}

function candleBodyH (candle) {
  return Math.max(Math.abs(chartY(candle.close) - chartY(candle.open)), 2)
}

function volumeY (candle) {
  return 100 - candle.vol
}
</script>

<template>
  <svg
    class="use-case-illustration"
    width="160"
    height="120"
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <clipPath :id="`${uid}-terminal-clip`">
        <rect x="32" y="32" width="90" height="70" rx="4" />
      </clipPath>
      <clipPath :id="`${uid}-replay-clip`">
        <rect x="34" y="32" width="88" height="70" rx="4" />
      </clipPath>
    </defs>

    <template v-if="variant === 1">
      <rect x="10" y="8" width="140" height="104" rx="8" class="panel" />
      <path d="M18 8 H142 Q150 8 150 16 V26 H10 V16 Q10 8 18 8 Z" class="panel-header" />
      <circle cx="20" cy="17" r="2" class="window-dot-red" />
      <circle cx="28" cy="17" r="2" class="window-dot-amber" />
      <circle cx="36" cy="17" r="2" class="window-dot-green" />
      <rect x="18" y="38" width="12" height="5" rx="2.5" class="pill accent" />
      <rect x="18" y="52" width="12" height="5" rx="2.5" class="pill soft" />
      <rect x="18" y="66" width="12" height="5" rx="2.5" class="pill soft" />
      <rect x="18" y="80" width="12" height="5" rx="2.5" class="pill soft" />

      <g :clip-path="`url(#${uid}-terminal-clip)`">
        <line x1="32" y1="46" x2="122" y2="46" class="grid" />
        <line x1="32" y1="62" x2="122" y2="62" class="grid" />
        <line x1="32" y1="78" x2="122" y2="78" class="grid" />
        <g v-for="candle in terminalCandles" :key="candle.x">
          <line
            :x1="candle.x"
            :y1="chartY(candle.high)"
            :x2="candle.x"
            :y2="chartY(candle.low)"
            class="candle-wick"
            :class="isBullCandle(candle) ? 'candle-up' : 'candle-down'"
          />
          <rect
            :x="candle.x - CANDLE_HALF"
            :y="candleBodyY(candle)"
            :width="CANDLE_BODY_W"
            :height="candleBodyH(candle)"
            rx=".75"
            class="candle-body"
            :class="isBullCandle(candle) ? 'candle-up' : 'candle-down'"
          />
          <rect
            :x="candle.x - 1"
            :y="volumeY(candle)"
            width="2"
            :height="candle.vol"
            rx=".5"
            class="volume"
            :class="isBullCandle(candle) ? 'candle-up' : 'candle-down'"
          />
        </g>
        <path d="M36 84 C50 70 62 76 74 62 S98 46 118 50" class="indicator-line" />
        <line x1="98" y1="32" x2="98" y2="102" class="crosshair-line" />
      </g>

      <rect x="128" y="38" width="12" height="46" rx="4" class="order-panel" />
      <rect x="131" y="46" width="6" height="3" rx="1.5" class="buy" />
      <rect x="131" y="58" width="6" height="3" rx="1.5" class="sell" />
      <circle cx="134" cy="76" r="2.5" class="live-dot" />
    </template>

    <template v-else-if="variant === 2">
      <rect x="10" y="8" width="68" height="104" rx="10" class="phone" />
      <rect x="18" y="22" width="52" height="78" rx="6" class="panel" />
      <rect x="31" y="14" width="26" height="3" rx="1.5" class="phone-speaker" />
      <rect x="24" y="32" width="20" height="5" rx="2.5" class="pill accent" />
      <text x="24" y="54" class="symbol">ETF</text>
      <path d="M24 82 L30 72 L36 76 L42 62 L48 68 L58 48" class="spark up" />
      <circle cx="58" cy="48" r="2.5" class="live-dot" />
      <rect x="24" y="90" width="34" height="4" rx="2" class="pill soft" />

      <rect x="86" y="40" width="64" height="50" rx="7" class="floating-card" />
      <rect x="94" y="50" width="20" height="4" rx="2" class="pill soft" />
      <path d="M94 76 L100 68 L106 72 L114 60 L120 66 L134 54" class="spark up" />
      <rect x="130" y="50" width="14" height="8" rx="4" class="touch-chip" />
      <path d="M102 94 C90 106 74 108 62 100" class="gesture" />
      <path d="M62 100 L68 98 L66 104 Z" class="gesture-tip" />
    </template>

    <template v-else-if="variant === 3">
      <rect x="10" y="8" width="140" height="104" rx="8" class="panel" />
      <path d="M18 8 H142 Q150 8 150 16 V26 H10 V16 Q10 8 18 8 Z" class="panel-header" />
      <circle cx="20" cy="17" r="2" class="window-dot-red" />
      <circle cx="28" cy="17" r="2" class="window-dot-amber" />
      <circle cx="36" cy="17" r="2" class="window-dot-green" />
      <rect x="18" y="38" width="12" height="5" rx="2.5" class="pill accent" />
      <rect x="18" y="52" width="12" height="5" rx="2.5" class="pill soft" />
      <rect x="18" y="66" width="12" height="5" rx="2.5" class="pill soft" />
      <rect x="18" y="80" width="12" height="5" rx="2.5" class="pill soft" />

      <g :clip-path="`url(#${uid}-replay-clip)`">
        <line x1="34" y1="46" x2="122" y2="46" class="grid" />
        <line x1="34" y1="62" x2="122" y2="62" class="grid" />
        <line x1="34" y1="78" x2="122" y2="78" class="grid" />
        <g v-for="candle in replayCandles" :key="candle.x">
          <line
            :x1="candle.x"
            :y1="chartY(candle.high)"
            :x2="candle.x"
            :y2="chartY(candle.low)"
            class="candle-wick"
            :class="isBullCandle(candle) ? 'candle-up' : 'candle-down'"
          />
          <rect
            :x="candle.x - CANDLE_HALF"
            :y="candleBodyY(candle)"
            :width="CANDLE_BODY_W"
            :height="candleBodyH(candle)"
            rx=".75"
            class="candle-body"
            :class="isBullCandle(candle) ? 'candle-up' : 'candle-down'"
          />
          <rect
            :x="candle.x - 1"
            :y="volumeY(candle)"
            width="2"
            :height="candle.vol"
            rx=".5"
            class="volume"
            :class="isBullCandle(candle) ? 'candle-up' : 'candle-down'"
          />
        </g>
        <path d="M38 84 C50 72 62 76 74 62 S96 44 118 52" class="indicator-line" />
        <line x1="86" y1="32" x2="86" y2="102" class="replay-line" />
        <circle cx="86" cy="62" r="2.5" class="live-dot" />
      </g>

      <rect x="18" y="96" width="12" height="8" rx="3" class="play-btn" />
      <path d="M22 98 L22 102 L26 100 Z" class="play-icon" />
      <path d="M38 100 H112" class="timeline" />
      <circle cx="86" cy="100" r="2.5" class="timeline-dot" />
    </template>

    <template v-else>
      <defs>
        <clipPath
          v-for="card in dashboardCards"
          :id="`${uid}-dash-${card.symbol}`"
          :key="`${uid}-dash-${card.symbol}`"
        >
          <rect :x="card.x + 6" :y="card.y + 18" width="46" height="18" rx="2" />
        </clipPath>
      </defs>
      <rect x="10" y="8" width="140" height="104" rx="8" class="panel" />
      <g class="dashboard-grid">
        <g v-for="card in dashboardCards" :key="card.symbol">
          <rect :x="card.x" :y="card.y" width="58" height="40" rx="6" class="pane" />
          <text :x="card.x + 8" :y="card.y + 14" class="symbol">{{ card.symbol }}</text>
          <path
            :d="card.trend"
            class="spark"
            :class="card.up ? 'up' : 'down'"
            :clip-path="`url(#${uid}-dash-${card.symbol})`"
          />
        </g>
      </g>
    </template>
  </svg>
</template>

<style scoped>
.use-case-illustration {
  --uc-line: #6366f1;
  --uc-up: #2DC08E;
  --uc-down: #F92855;
  --uc-live: #2DC08E;
  --uc-panel-stroke: var(--home-brand-border, var(--vp-c-gutter));
  --uc-grid-stroke: color-mix(in srgb, var(--uc-panel-stroke) 72%, transparent);
  --uc-symbol: #64748b;
  --uc-muted: rgb(148 163 184 / 24%);

  display: block;
  flex: 0 0 auto;
  width: 160px;
  height: 120px;
}

:global(.dark) .use-case-illustration {
  --uc-line: #818cf8;
  --uc-grid-stroke: color-mix(in srgb, var(--uc-panel-stroke) 56%, transparent);
  --uc-symbol: #94a3b8;
  --uc-muted: rgb(148 163 184 / 18%);
}

.panel,
.pane,
.phone,
.floating-card {
  fill: transparent;
  stroke: var(--uc-panel-stroke);
  stroke-width: 1;
}

.panel-header {
  fill: transparent;
  stroke: var(--uc-panel-stroke);
  stroke-width: 1;
}

.window-dot-red,
.sell {
  fill: var(--uc-down);
}

.window-dot-amber {
  fill: #E6AC00;
}

.window-dot-green,
.buy {
  fill: var(--uc-up);
}

.pill.soft,
.phone-speaker {
  fill: var(--uc-muted);
}

.pill.accent,
.touch-chip {
  fill: rgb(99 102 241 / 16%);
  stroke: rgb(99 102 241 / 28%);
  stroke-width: 1;
}

.grid {
  stroke: var(--uc-grid-stroke);
  stroke-width: 1;
  stroke-dasharray: 3 4;
}

.candle-wick {
  stroke-width: 1;
  stroke-linecap: round;
}

.candle-wick.candle-up {
  stroke: var(--uc-up);
}

.candle-wick.candle-down {
  stroke: var(--uc-down);
}

.candle-body,
.volume {
  stroke-width: 0;
}

.candle-body.candle-up,
.volume.candle-up {
  fill: var(--uc-up);
}

.candle-body.candle-down,
.volume.candle-down {
  fill: var(--uc-down);
}

.indicator-line,
.signal-line {
  stroke: var(--uc-line);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.crosshair-line,
.replay-line {
  stroke: #E6AC00;
  stroke-width: 1;
  stroke-dasharray: 3 3;
}

.order-panel,
.tag-card {
  fill: transparent;
  stroke: var(--uc-panel-stroke);
  stroke-width: 1;
}

.symbol {
  font-family: var(--vp-font-family-mono);
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 0;
  fill: var(--uc-symbol);
}

.spark {
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.spark.up {
  stroke: var(--uc-up);
}

.spark.down {
  stroke: var(--uc-down);
}

.live-dot {
  fill: var(--uc-live);
  opacity: .9;
}

.gesture,
.timeline {
  stroke: rgb(99 102 241 / 34%);
  stroke-width: 1;
  stroke-linecap: round;
  stroke-dasharray: 3 3;
  fill: none;
}

.gesture-tip,
.play-icon {
  fill: var(--uc-line);
}

.play-btn,
.timeline-dot {
  fill: rgb(99 102 241 / 14%);
  stroke: var(--uc-line);
  stroke-width: 1;
}
</style>
