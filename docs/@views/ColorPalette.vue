<template>
  <div v-if="visible" ref="rootRef" class="color-palette">
    <button
      class="trigger"
      type="button"
      :aria-expanded="popoverVisible"
      :aria-label="paletteAriaLabel"
      @click="popoverVisible = !popoverVisible">
      <span class="trigger-color" :style="{ backgroundColor: finalColor }"/>
      <svg viewBox="0 0 1024 1024" width="20" height="20" fill="var(--vp-c-text-1)">
        <path d="M443.904 956.416c-6.144 0-12.8-0.512-18.944-2.048-116.736-23.552-221.696-94.72-287.744-195.584S49.152 537.088 74.752 417.28C105.984 270.848 212.48 147.968 353.28 96.256c135.68-49.664 281.6-34.304 400.896 43.008 118.272 76.8 195.072 205.312 205.312 344.576 4.096 64-17.408 122.88-61.44 168.448-46.08 48.128-109.056 75.776-177.152 74.24l-183.808-3.072c-13.312-0.512-20.992 5.12-27.136 14.336-6.144 9.216-7.168 20.48-2.56 30.208l23.04 54.272c14.336 33.28 8.704 71.168-14.336 99.328-18.432 22.528-44.544 34.816-72.192 34.816zM512 131.584c-45.568 0-92.16 8.192-136.704 24.576C254.976 200.192 163.84 305.152 137.216 430.592c-22.016 103.424-3.072 207.872 53.248 293.888 56.32 86.528 146.432 147.456 246.784 167.936 15.36 3.584 25.6-6.656 29.184-10.752 8.192-9.728 9.728-22.528 5.12-33.792L448.512 793.6c-12.8-30.208-9.728-64 8.704-91.136 18.432-27.136 47.616-43.008 81.408-42.496l183.808 3.072h3.072c47.616 0 94.208-19.968 126.976-54.272 31.232-32.768 46.592-74.752 44.032-117.76-8.704-121.344-74.24-231.424-176.128-297.472-64-41.472-135.68-61.952-208.384-61.952z"/>
        <path d="M272.896 579.072m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" />
        <path d="M325.12 369.152m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" />
        <path d="M513.536 278.528m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" />
        <path d="M709.12 392.192m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" />
      </svg>
    </button>
    <div class="content" :class="{ visible: popoverVisible }">
      <div class="header">
        <span>{{ i18n('view_color_palette_title', lang) }}</span>
        <button type="button" class="reset" @click="resetColor">{{ i18n('view_color_palette_reset', lang) }}</button>
      </div>
      <div
        ref="trackRef"
        class="track-wrap"
        @mousedown="startDrag"
        @touchstart.prevent="startDrag">
        <div class="track"/>
        <button
          type="button"
          class="thumb"
          :style="{ left: `${sliderPercent}%`, backgroundColor: activeColor }"
          :aria-label="i18n('view_color_palette_aria_label', lang)"
          @mousedown.stop="startDrag"
          @touchstart.stop.prevent="startDrag"/>
      </div>
      <div class="preset">
        <button
          v-for="color in colors"
          :key="color"
          type="button"
          class="item preset-item"
          :aria-label="setColorAriaLabel(color)"
          :class="{ active: activeColor === color }"
          :style="{ color }"
          @click="selectPreset(color)">
          <span/>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { inBrowser, useData } from 'vitepress'
import { useLocalStorage, onClickOutside } from '@vueuse/core'
import i18n from '../@i18n'
import {
  applyThemeColorStyle,
  DEFAULT_THEME_COLOR,
  normalizeThemeColor,
  THEME_COLOR_STORAGE_KEY
} from '../.vitepress/theme/theme-color'

const visible = ref(false)
const { lang } = useData()

const popoverVisible = ref(false)
const rootRef = ref(null)
const trackRef = ref(null)

const currentColor = useLocalStorage(THEME_COLOR_STORAGE_KEY)
const previewColor = ref(null)
const sliderValue = ref(0)
const dragging = ref(false)

const colors = [
  '#F92855',
  '#EC4899',
  '#F17313',
  '#E6AC00',
  '#2DC08E',
  "#84CC16",
  '#1677FF',
  '#3FB5FB',
  '#A14DFD',
  '#8F6CEE'
]

const finalColor = computed(() => normalizeThemeColor(currentColor.value) || DEFAULT_THEME_COLOR)
const activeColor = computed(() => previewColor.value || finalColor.value)
const sliderPercent = computed(() => sliderValue.value * 100)
const paletteAriaLabel = computed(() => i18n('view_color_palette_aria_label', lang.value))
const setColorAriaLabel = (color) => `${i18n('view_color_palette_set_color_aria_label', lang.value)} ${color}`

onMounted(() => {
  visible.value = true
  sliderValue.value = getColorValue(finalColor.value)
})

onClickOutside(rootRef, () => {
  popoverVisible.value = false
  if (dragging.value) {
    stopDrag()
  }
  previewColor.value = null
  sliderValue.value = getColorValue(finalColor.value)
})

watch(finalColor, (color) => {
  if (!dragging.value) {
    sliderValue.value = getColorValue(color)
  }
})

watch(activeColor, (color) => {
  applyThemeColorStyle(color || DEFAULT_THEME_COLOR)
}, { immediate: inBrowser, flush: 'post' })

function changePrimaryColor (color) {
  currentColor.value = color
}

function selectPreset (color) {
  previewColor.value = null
  sliderValue.value = getColorValue(color)
  changePrimaryColor(color)
}

function resetColor () {
  previewColor.value = null
  sliderValue.value = getColorValue(DEFAULT_THEME_COLOR)
  currentColor.value = DEFAULT_THEME_COLOR
}

function startDrag (event) {
  dragging.value = true
  updateSlider(event)
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('touchmove', onDragMove, { passive: false })
  window.addEventListener('touchend', onDragEnd)
}

function onDragMove (event) {
  if (!dragging.value) {
    return
  }
  if (event.type === 'touchmove') {
    event.preventDefault()
  }
  updateSlider(event)
}

function onDragEnd () {
  if (!dragging.value) {
    return
  }
  stopDrag()
  changePrimaryColor(activeColor.value)
  previewColor.value = null
}

function stopDrag () {
  dragging.value = false
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('touchmove', onDragMove)
  window.removeEventListener('touchend', onDragEnd)
}

function updateSlider (event) {
  if (!trackRef.value) {
    return
  }
  const point = event.touches?.[0] || event
  const rect = trackRef.value.getBoundingClientRect()
  const ratio = clamp((point.clientX - rect.left) / rect.width, 0, 1)
  sliderValue.value = ratio
  previewColor.value = getColorFromValue(ratio)
}

function getColorValue (color) {
  const index = colors.indexOf(color)
  if (index >= 0) {
    return index / (colors.length - 1)
  }
  return findNearestValue(color)
}

function getColorFromValue (value) {
  const scaled = value * (colors.length - 1)
  const leftIndex = Math.floor(scaled)
  const rightIndex = Math.min(colors.length - 1, leftIndex + 1)
  const ratio = scaled - leftIndex
  const left = colors[leftIndex]
  const right = colors[rightIndex]
  if (left === right) {
    return left
  }
  return mixHexColor(left, right, ratio)
}

function mixHexColor (left, right, ratio) {
  const l = hexToRgb(left)
  const r = hexToRgb(right)
  const red = Math.round(l.r + (r.r - l.r) * ratio)
  const green = Math.round(l.g + (r.g - l.g) * ratio)
  const blue = Math.round(l.b + (r.b - l.b) * ratio)
  return rgbToHex(red, green, blue)
}

function hexToRgb (hex) {
  const cleanHex = hex.replace('#', '')
  return {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16)
  }
}

function rgbToHex (r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('')
  ).toUpperCase()
}

function findNearestValue (color) {
  const target = hexToRgb(color)
  const steps = 240
  let bestValue = getColorValue(DEFAULT_THEME_COLOR)
  let bestDistance = Number.POSITIVE_INFINITY
  for (let i = 0; i <= steps; i++) {
    const value = i / steps
    const candidate = hexToRgb(getColorFromValue(value))
    const distance = colorDistance(target, candidate)
    if (distance < bestDistance) {
      bestDistance = distance
      bestValue = value
    }
  }
  return bestValue
}

function colorDistance (left, right) {
  const dr = left.r - right.r
  const dg = left.g - right.g
  const db = left.b - right.b
  return dr * dr + dg * dg + db * db
}

function clamp (value, min, max) {
  return Math.min(max, Math.max(min, value))
}

onBeforeUnmount(() => {
  stopDrag()
})

</script>

<style scoped>
  .color-palette {
    position: fixed;
    z-index: 99;
    right: 36px;
    bottom: 96px;
  }

  .trigger {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    cursor: pointer;
    background-color: var(--vp-c-bg-elv);
    box-shadow: var(--vp-shadow-3);
    transition: all .2s ease;
    border: solid 1px var(--vp-c-border);
  }

  .trigger:hover {
    background-color: var(--vp-c-bg-soft);
  }

  .trigger-color {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    right: 10px;
    top: 10px;
    border: solid 2px var(--vp-c-bg-elv);
    box-sizing: border-box;
  }

  .content {
    position: absolute;
    bottom: calc(100% + 10px);
    right: 0;
    width: 184px;
    padding: 10px;
    border-radius: 12px;
    background-color: var(--vp-c-bg-elv);
    box-shadow: var(--vp-shadow-3);
    border: solid 1px var(--vp-c-border);
    transform: scale(0);
    opacity: 0;
    pointer-events: none;
    transform-origin: right bottom;
    transition: transform .2s ease, opacity .2s ease;
  }

  .content.visible {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    color: var(--vp-c-text-1);
    font-size: 12px;
    font-weight: 600;
  }

  .reset {
    border: none;
    background: transparent;
    color: var(--vp-c-indigo-1);
    cursor: pointer;
    padding: 0;
    font-size: 12px;
  }

  .track-wrap {
    position: relative;
    height: 18px;
    margin: 2px 2px 14px;
    cursor: pointer;
    user-select: none;
  }

  .track {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 8px;
    border-radius: 999px;
    transform: translateY(-50%);
    background: linear-gradient(
      90deg,
      #F92855 0%,
      #EC4899 11%,
      #F17313 22%,
      #E6AC00 33%,
      #2DC08E 44%,
      #84CC16 55%,
      #1677FF 66%,
      #3FB5FB 77%,
      #A14DFD 88%,
      #8F6CEE 100%
    );
  }

  .thumb {
    position: absolute;
    top: 50%;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: solid 2px #fff;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .18), 0 3px 8px rgba(0, 0, 0, .16);
    transform: translate(-50%, -50%);
    cursor: grab;
    padding: 0;
  }

  .thumb:active {
    cursor: grabbing;
  }

  .preset {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border-radius: 50%;
    border: solid 1px transparent;
    box-sizing: border-box;
    background: transparent;
    cursor: pointer;
  }

  .item span {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: currentColor;
  }

  .item.active {
    border-color: currentColor;
    box-shadow: 0 0 0 1px currentColor;
  }

  @media (max-width: 768px) {
    .color-palette {
      right: 16px;
      bottom: 84px;
    }
  }
</style>
