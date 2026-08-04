<template>
  <div v-if="visible" class="appearance-settings">
    <div class="section">
      <div class="section-title">{{ i18n('component_appearance_mode', lang) }}</div>
      <div class="mode-options">
        <button
          type="button"
          :class="{ active: !isDark }"
          :aria-pressed="!isDark"
          @click="setAppearance(false)">
          <span class="vpi-sun"/>
          <span>{{ i18n('component_appearance_light', lang) }}</span>
        </button>
        <button
          type="button"
          :class="{ active: isDark }"
          :aria-pressed="isDark"
          @click="setAppearance(true)">
          <span class="vpi-moon"/>
          <span>{{ i18n('component_appearance_dark', lang) }}</span>
        </button>
      </div>
    </div>
    <div class="divider"/>
    <div class="header">
      <span>{{ i18n('component_color_palette_title', lang) }}</span>
      <button type="button" class="reset" @click="resetColor">{{ i18n('component_color_palette_reset', lang) }}</button>
    </div>
    <button
      type="button"
      class="color-picker-trigger"
      :aria-expanded="colorPickerOpen"
      @click="colorPickerOpen = !colorPickerOpen">
      <span class="color-preview" :style="{ backgroundColor: activeColor }"/>
      <span>{{ activeColor }}</span>
      <span class="vpi-chevron-down" :class="{ open: colorPickerOpen }"/>
    </button>
    <div v-if="colorPickerOpen" class="color-picker-panel">
      <div
        ref="saturationRef"
        class="saturation-field"
        :style="{ '--picker-hue': hueColor }"
        @pointerdown="startPickerDrag('saturation', $event)"
        @pointermove="movePickerDrag('saturation', $event)"
        @pointerup="stopPickerDrag"
        @pointercancel="stopPickerDrag">
        <span
          class="picker-thumb saturation-thumb"
          :style="{ left: `${pickerSaturation}%`, top: `${100 - pickerValue}%`, backgroundColor: activeColor }"/>
      </div>
      <div
        ref="hueRef"
        class="hue-track"
        @pointerdown="startPickerDrag('hue', $event)"
        @pointermove="movePickerDrag('hue', $event)"
        @pointerup="stopPickerDrag"
        @pointercancel="stopPickerDrag">
        <span class="picker-thumb hue-thumb" :style="{ left: `${pickerHue / 3.6}%`, backgroundColor: hueColor }"/>
      </div>
      <label class="hex-field">
        <span>#</span>
        <input
          :value="activeColor.slice(1)"
          maxlength="6"
          spellcheck="false"
          aria-label="HEX"
          @change="selectHexColor"
          @keydown.enter="selectHexColor">
      </label>
    </div>
    <div class="preset">
      <button
        v-for="color in colors"
        :key="color"
        type="button"
        class="color-item"
        :aria-label="color"
        :aria-pressed="activeColor === color"
        :style="{ color }"
        @click="selectPreset(color)">
        <span/>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useLocalStorage } from '@vueuse/core'
import { inBrowser, useData } from 'vitepress'
import { computed, inject, onMounted, ref, watch } from 'vue'
import i18n from '../../@i18n'
import { applyThemeColorStyle, DEFAULT_THEME_COLOR, normalizeThemeColor, THEME_COLOR_STORAGE_KEY } from '../../.vitepress/theme/theme-color'

const visible = ref(false)
const { isDark, lang } = useData()
const toggleAppearance = inject('toggle-appearance', null)

const currentColor = useLocalStorage(THEME_COLOR_STORAGE_KEY)
const colorPickerOpen = ref(false)
const saturationRef = ref(null)
const hueRef = ref(null)
const pickerHue = ref(0)
const pickerSaturation = ref(0)
const pickerValue = ref(0)
const activeDrag = ref(null)

const colors = ['#F92855', '#EC4899', '#F17313', '#E6AC00', '#2DC08E', '#84CC16', '#1677FF', '#3FB5FB', '#A14DFD', '#8F6CEE']

const finalColor = computed(() => normalizeThemeColor(currentColor.value) || DEFAULT_THEME_COLOR)
const activeColor = computed(() => finalColor.value)
const hueColor = computed(() => hsvToHex(pickerHue.value, 100, 100))

onMounted(() => {
  visible.value = true
  syncPickerFromColor(finalColor.value)
})

watch(
  activeColor,
  (color) => {
    applyThemeColorStyle(color || DEFAULT_THEME_COLOR)
    syncPickerFromColor(color || DEFAULT_THEME_COLOR)
  },
  { immediate: inBrowser, flush: 'post' }
)

function changePrimaryColor(color) {
  currentColor.value = color
}

function setAppearance(dark) {
  if (isDark.value === dark) {
    return
  }
  if (toggleAppearance) {
    toggleAppearance()
  } else {
    isDark.value = dark
  }
}

function selectPreset(color) {
  changePrimaryColor(color)
}

function resetColor() {
  currentColor.value = DEFAULT_THEME_COLOR
}

function startPickerDrag(type, event) {
  activeDrag.value = type
  event.currentTarget.setPointerCapture(event.pointerId)
  updatePicker(type, event)
}

function movePickerDrag(type, event) {
  if (activeDrag.value === type) {
    updatePicker(type, event)
  }
}

function stopPickerDrag() {
  activeDrag.value = null
}

function updatePicker(type, event) {
  const target = type === 'hue' ? hueRef.value : saturationRef.value
  if (!target) {
    return
  }
  const rect = target.getBoundingClientRect()
  const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
  if (type === 'hue') {
    pickerHue.value = x * 360
  } else {
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1)
    pickerSaturation.value = x * 100
    pickerValue.value = (1 - y) * 100
  }
  changePrimaryColor(hsvToHex(pickerHue.value, pickerSaturation.value, pickerValue.value))
}

function selectHexColor(event) {
  const normalized = normalizeThemeColor(`#${event.target.value}`)
  if (normalized) {
    changePrimaryColor(normalized)
  } else {
    event.target.value = activeColor.value.slice(1)
  }
}

function syncPickerFromColor(color) {
  const { h, s, v } = rgbToHsv(hexToRgb(color))
  pickerHue.value = h
  pickerSaturation.value = s
  pickerValue.value = v
}

function hexToRgb(hex) {
  const value = hex.replace('#', '')
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  }
}

function rgbToHsv({ r, g, b }) {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  let hue = 0

  if (delta !== 0) {
    if (max === red) {
      hue = 60 * (((green - blue) / delta) % 6)
    } else if (max === green) {
      hue = 60 * ((blue - red) / delta + 2)
    } else {
      hue = 60 * ((red - green) / delta + 4)
    }
  }

  return {
    h: hue < 0 ? hue + 360 : hue,
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100
  }
}

function hsvToHex(h, s, v) {
  const saturation = s / 100
  const value = v / 100
  const chroma = value * saturation
  const hue = (h % 360) / 60
  const x = chroma * (1 - Math.abs((hue % 2) - 1))
  const match = value - chroma
  let rgb

  if (hue < 1) {
    rgb = [chroma, x, 0]
  } else if (hue < 2) {
    rgb = [x, chroma, 0]
  } else if (hue < 3) {
    rgb = [0, chroma, x]
  } else if (hue < 4) {
    rgb = [0, x, chroma]
  } else if (hue < 5) {
    rgb = [x, 0, chroma]
  } else {
    rgb = [chroma, 0, x]
  }

  return `#${rgb
    .map((channel) =>
      Math.round((channel + match) * 255)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`.toUpperCase()
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}
</script>

<style scoped>
  .appearance-settings {
    width: 224px;
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  .section-title,
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    line-height: 18px;
    color: var(--vp-c-text-1);
    font-size: 14px;
    font-weight: 600;
  }

  .section-title {
    margin-bottom: 8px;
  }

  .mode-options {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 3px;
    padding: 3px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 7px;
    background: var(--vp-c-bg-soft);
  }

  .mode-options button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    height: 32px;
    padding: 0 8px;
    border: 0;
    border-radius: 4px;
    color: var(--vp-c-text-2);
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background-color .2s, color .2s, box-shadow .2s;
  }

  .mode-options button:hover {
    color: var(--vp-c-text-1);
  }

  .mode-options button.active {
    color: var(--vp-c-indigo-1);
    background: var(--vp-c-bg);
    box-shadow: 0 1px 3px rgba(0, 0, 0, .1);
  }

  .mode-options button:focus-visible,
  .reset:focus-visible,
  .color-picker-trigger:focus-visible,
  .hex-field input:focus-visible,
  .color-item:focus-visible {
    outline: 2px solid var(--vp-c-indigo-1);
    outline-offset: 2px;
  }

  .divider {
    height: 1px;
    margin: 14px 0;
    background: var(--vp-c-divider);
  }

  .reset {
    border: none;
    background: transparent;
    color: var(--vp-c-indigo-1);
    cursor: pointer;
    padding: 0;
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    transition: opacity .2s;
  }

  .reset:hover {
    opacity: .72;
  }

  .color-picker-trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 34px;
    margin-bottom: 10px;
    width: 100%;
    padding: 3px 9px 3px 3px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    box-sizing: border-box;
    color: var(--vp-c-text-2);
    background-color: var(--vp-c-bg);
    cursor: pointer;
    font-family: var(--vp-font-family-mono);
    font-size: 14px;
    font-weight: 500;
    text-align: left;
  }

  .color-preview {
    width: 32px;
    height: 26px;
    flex: none;
    border-radius: 4px;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .08);
  }

  .color-picker-trigger .vpi-chevron-down {
    margin-left: auto;
    transition: transform .2s;
  }

  .color-picker-trigger .vpi-chevron-down.open {
    transform: rotate(-90deg);
  }

  .color-picker-panel {
    display: grid;
    gap: 10px;
    margin: -2px 0 10px;
    padding: 10px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    background-color: var(--vp-c-bg);
  }

  .saturation-field {
    position: relative;
    height: 112px;
    border-radius: 4px;
    background:
      linear-gradient(to top, #000, transparent),
      linear-gradient(to right, #fff, transparent),
      var(--picker-hue);
    cursor: crosshair;
    touch-action: none;
  }

  .hue-track {
    position: relative;
    height: 10px;
    margin: 3px 5px;
    border-radius: 999px;
    background: linear-gradient(to right, #F00, #FF0, #0F0, #0FF, #00F, #F0F, #F00);
    cursor: pointer;
    touch-action: none;
  }

  .picker-thumb {
    position: absolute;
    width: 14px;
    height: 14px;
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .25);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .saturation-thumb {
    top: 0;
  }

  .hue-thumb {
    top: 50%;
  }

  .hex-field {
    display: flex;
    align-items: center;
    height: 30px;
    padding: 0 8px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 5px;
    color: var(--vp-c-text-3);
    font-family: var(--vp-font-family-mono);
    font-size: 14px;
  }

  .hex-field input {
    min-width: 0;
    width: 100%;
    padding: 0 0 0 2px;
    border: 0;
    outline: 0;
    color: var(--vp-c-text-1);
    background: transparent;
    font: inherit;
    text-transform: uppercase;
  }

  .hex-field:has(input:focus-visible) {
    border-color: var(--vp-c-indigo-1);
  }

  .hex-field input:focus-visible {
    outline: none;
  }

  .preset {
    display: grid;
    grid-template-columns: repeat(5, 14px);
    justify-content: space-between;
    row-gap: 4px;
  }

  .color-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 24px;
    margin: 0 auto;
    padding: 0;
    border: 0;
    box-sizing: border-box;
    background: transparent;
    cursor: pointer;
  }

  .color-item::before {
    content: '';
    position: absolute;
    inset: 0 -5px;
  }

  .color-item span {
    flex: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: currentColor;
  }

</style>
