<template>
  <div :class="rootClass">
    <div class="chart-skeleton">
      <div class="main-pane">
        <div class="grid-lines grid-lines-h">
          <span v-for="line in 5" :key="`grid-h-${line}`"/>
        </div>
        <div class="grid-lines grid-lines-v">
          <span v-for="line in 8" :key="`grid-v-${line}`"/>
        </div>
        <div class="candles">
          <div
            v-for="(candle, index) in candles"
            :key="`candle-${index}`"
            class="candle"
            :style="{ '--bar-x': `${(index / (candles.length - 1)) * 100}%` }">
            <span
              class="wick wick-upper"
              :style="{
                height: `${candle.upperWick}%`,
                bottom: `${candle.bodyTop}%`
              }"/>
            <span
              class="wick wick-lower"
              :style="{
                height: `${candle.lowerWick}%`,
                bottom: `${candle.wickBottom}%`
              }"/>
            <span
              class="body"
              :class="{ bullish: candle.bullish, bearish: !candle.bullish }"
              :style="{
                height: `${candle.bodyHeight}%`,
                bottom: `${candle.bodyBottom}%`
              }"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  className: {
    type: String,
    default: ''
  }
})

const rootClass = computed(() => {
  return props.className ? `chart-skeleton-root ${props.className}` : 'chart-skeleton-root'
})

function generateCandles (count) {
  const raw = []
  let close = 50

  for (let i = 0; i < count; i++) {
    const open = close
    const progress = i / (count - 1)

    const trend =
      progress < 0.22
        ? -0.9 - Math.sin(i * 0.9) * 0.55
        : progress < 0.38
          ? Math.sin(i * 1.4) * 0.65 - 0.12
          : progress < 0.82
            ? 1.1 + Math.sin(i * 0.42) * 0.42
            : -0.62 - Math.sin(i * 0.75) * 0.35

    const noise = Math.sin(i * 1.17) * 0.55 + Math.cos(i * 0.63) * 0.38
    close = open + trend + noise

    const bodyTop = Math.max(open, close)
    const bodyBottom = Math.min(open, close)
    const bodySize = Math.max(0.4, bodyTop - bodyBottom)
    const bullish = close >= open

    const seed = (i * 13 + 5) % 9
    const wave = 0.35 + (seed % 4) * 0.18

    let upperWick = bodySize * wave * (0.55 + (seed % 3) * 0.22)
    let lowerWick = bodySize * wave * (0.5 + ((seed + 1) % 3) * 0.24)

    // 十字星：实体越小，影线越长
    if (bodySize < 0.75) {
      upperWick = Math.max(upperWick, 0.9 + (seed % 3) * 0.35)
      lowerWick = Math.max(lowerWick, 0.8 + ((seed + 2) % 3) * 0.3)
    }

    // 强势阳线：上影偏短
    if (bullish && bodySize > 1.4) {
      upperWick *= 0.45
      lowerWick *= 0.85
    }

    // 强势阴线：下影偏短
    if (!bullish && bodySize > 1.4) {
      lowerWick *= 0.45
      upperWick *= 0.85
    }

    // 阶段性上影线（见顶回落感）
    if (progress > 0.78 && i % 4 === 0) {
      upperWick = bodySize * (1.1 + (seed % 2) * 0.4)
      lowerWick *= 0.5
    }

    // 阶段性下影线（探底反弹感）
    if (progress > 0.18 && progress < 0.42 && i % 5 === 2) {
      lowerWick = bodySize * (1.0 + (seed % 2) * 0.35)
      upperWick *= 0.45
    }

    raw.push({
      low: bodyBottom - lowerWick,
      high: bodyTop + upperWick,
      bodyBottom,
      bodyTop,
      bullish
    })
  }

  let minLow = Infinity
  let maxHigh = -Infinity
  for (const candle of raw) {
    minLow = Math.min(minLow, candle.low)
    maxHigh = Math.max(maxHigh, candle.high)
  }

  const padding = 0.05
  const range = maxHigh - minLow || 1
  const scale = (1 - padding * 2) / range
  const toPercent = (value) => (padding + (value - minLow) * scale) * 100

  return raw.map((candle) => {
    const bodyBottom = toPercent(candle.bodyBottom)
    const bodyTop = toPercent(candle.bodyTop)
    const low = toPercent(candle.low)
    const high = toPercent(candle.high)

    return {
      wickBottom: low,
      upperWick: high - bodyTop,
      lowerWick: bodyBottom - low,
      bodyBottom,
      bodyTop,
      bodyHeight: Math.max(1.1, bodyTop - bodyBottom),
      bullish: candle.bullish
    }
  })
}

const candles = generateCandles(42)
</script>

<style scoped>
@property --shine-x {
  syntax: '<percentage>';
  inherits: true;
  initial-value: -35%;
}

.chart-skeleton-root {
  --sk-bar: color-mix(in srgb, var(--vp-c-text-3) 52%, var(--vp-c-divider));
  --sk-bar-bullish: color-mix(in srgb, var(--vp-c-text-3) 40%, var(--vp-c-divider));
  --sk-bar-bearish: color-mix(in srgb, var(--vp-c-text-3) 64%, var(--vp-c-divider));
  --sk-shine: color-mix(in srgb, white 62%, var(--vp-c-text-3));
  --sk-shade: color-mix(in srgb, black 6%, var(--vp-c-text-3));
  --sk-glow-mid: 42%;
  --sk-glow-wick-outer: 35%;
  --sk-glow-wick-core: 55%;
  --sk-grid: color-mix(in srgb, var(--vp-c-divider) 40%, transparent);
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.chart-skeleton {
  width: 100%;
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
}

.main-pane {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
}

.grid-lines {
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
}

.grid-lines-h {
  flex-direction: column;
  justify-content: space-between;
}

.grid-lines-h span {
  display: block;
  height: 1px;
  background: var(--sk-grid);
}

.grid-lines-v {
  flex-direction: row;
  justify-content: space-between;
}

.grid-lines-v span {
  display: block;
  width: 1px;
  height: 100%;
  background: var(--sk-grid);
}

.candles {
  --shine-x: -35%;
  container-type: inline-size;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2px;
  padding: 0 4px;
  animation: shine-sweep 3.8s cubic-bezier(0.42, 0, 0.18, 1) infinite;
}

.candle {
  --bar-x: 0%;
  position: relative;
  flex: 1;
  min-width: 0;
  max-width: 12px;
  height: 100%;
}

.wick {
  --bar-base: var(--sk-bar);
  position: absolute;
  left: 50%;
  width: 1px;
  min-height: 2px;
  transform: translateX(-50%);
  border-radius: 1px;
  background: var(--bar-base);
}

.body {
  --bar-base: var(--sk-bar);
  --bar-highlight: var(--sk-shine);
  position: absolute;
  left: 50%;
  width: 68%;
  min-width: 3px;
  transform: translateX(-50%);
  border-radius: 1px;
  background-color: var(--bar-base);
  background-image: linear-gradient(
    118deg,
    var(--bar-base) 0%,
    var(--bar-base) 22%,
    var(--sk-shade) 34%,
    color-mix(in srgb, var(--bar-highlight) var(--sk-glow-mid), var(--bar-base)) 44%,
    var(--bar-highlight) 50%,
    color-mix(in srgb, var(--bar-highlight) var(--sk-glow-mid), var(--bar-base)) 56%,
    var(--bar-base) 66%,
    var(--bar-base) 100%
  );
  background-size: 320px 260%;
  background-size: 52cqw 260%;
  background-repeat: no-repeat;
  background-position: calc(var(--shine-x) - var(--bar-x)) 54%;
}

.wick-upper {
  opacity: 0.92;
}

.wick-lower {
  opacity: 0.86;
}

.body.bullish {
  --bar-base: var(--sk-bar-bullish);
}

.body.bearish {
  --bar-base: var(--sk-bar-bearish);
}

.wick-upper,
.wick-lower {
  background-image: linear-gradient(
    118deg,
    var(--bar-base) 0%,
    var(--bar-base) 28%,
    color-mix(in srgb, var(--sk-shine) var(--sk-glow-wick-outer), var(--bar-base)) 46%,
    color-mix(in srgb, var(--sk-shine) var(--sk-glow-wick-core), var(--bar-base)) 50%,
    color-mix(in srgb, var(--sk-shine) var(--sk-glow-wick-outer), var(--bar-base)) 54%,
    var(--bar-base) 72%,
    var(--bar-base) 100%
  );
  background-size: 320px 260%;
  background-size: 52cqw 260%;
  background-repeat: no-repeat;
  background-position: calc(var(--shine-x) - var(--bar-x)) 54%;
}

@keyframes shine-sweep {
  0%, 16% {
    --shine-x: -48%;
  }
  84%, 100% {
    --shine-x: 148%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .candles {
    animation: none;
    --shine-x: 50%;
  }
}
</style>

<style>
html.dark .chart-skeleton-root {
  --sk-bar: color-mix(in srgb, var(--vp-c-bg-soft) 68%, var(--vp-c-divider));
  --sk-bar-bullish: color-mix(in srgb, var(--vp-c-bg-soft) 74%, var(--vp-c-divider));
  --sk-bar-bearish: color-mix(in srgb, var(--vp-c-bg-soft) 56%, var(--vp-c-divider));
  --sk-shine: color-mix(in srgb, white 5%, var(--vp-c-bg-soft));
  --sk-shade: color-mix(in srgb, black 5%, var(--vp-c-divider));
  --sk-glow-mid: 18%;
  --sk-glow-wick-outer: 16%;
  --sk-glow-wick-core: 24%;
  --sk-grid: color-mix(in srgb, var(--vp-c-divider) 26%, transparent);
}
</style>
