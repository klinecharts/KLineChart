<template>
  <button v-if="visible" class="color-palette" @click="popoverVisible = !popoverVisible" @blur="visible = false">
    <div class="content" :class="{ visible: popoverVisible }">
      <div
        v-for="color in colors"
        :key="color"
        class="item"
        :style="{ 'border-color': currentColor === color ? color : 'transparent', color }"
        @click="changePrimaryColor(color)">
        <span/>
      </div>
    </div>
    <svg viewBox="0 0 1024 1024" width="22" height="22" fill="var(--vp-c-text-1)">
      <path d="M443.904 956.416c-6.144 0-12.8-0.512-18.944-2.048-116.736-23.552-221.696-94.72-287.744-195.584S49.152 537.088 74.752 417.28C105.984 270.848 212.48 147.968 353.28 96.256c135.68-49.664 281.6-34.304 400.896 43.008 118.272 76.8 195.072 205.312 205.312 344.576 4.096 64-17.408 122.88-61.44 168.448-46.08 48.128-109.056 75.776-177.152 74.24l-183.808-3.072c-13.312-0.512-20.992 5.12-27.136 14.336-6.144 9.216-7.168 20.48-2.56 30.208l23.04 54.272c14.336 33.28 8.704 71.168-14.336 99.328-18.432 22.528-44.544 34.816-72.192 34.816zM512 131.584c-45.568 0-92.16 8.192-136.704 24.576C254.976 200.192 163.84 305.152 137.216 430.592c-22.016 103.424-3.072 207.872 53.248 293.888 56.32 86.528 146.432 147.456 246.784 167.936 15.36 3.584 25.6-6.656 29.184-10.752 8.192-9.728 9.728-22.528 5.12-33.792L448.512 793.6c-12.8-30.208-9.728-64 8.704-91.136 18.432-27.136 47.616-43.008 81.408-42.496l183.808 3.072h3.072c47.616 0 94.208-19.968 126.976-54.272 31.232-32.768 46.592-74.752 44.032-117.76-8.704-121.344-74.24-231.424-176.128-297.472-64-41.472-135.68-61.952-208.384-61.952z"/>
      <path d="M272.896 579.072m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" />
      <path d="M325.12 369.152m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" />
      <path d="M513.536 278.528m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" />
      <path d="M709.12 392.192m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" />
    </svg>
  </button>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { inBrowser } from 'vitepress'
import { useLocalStorage } from '@vueuse/core'

const visible = ref(false)

const popoverVisible = ref(false)

const currentColor = useLocalStorage('klinecharts-primary-color')

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

const DEFAULT_COLOR = '#E6AC00'

let colorStyle = null

onMounted(() => {
  visible.value = true
})

watch(currentColor, (color) => {
  let finalColor = color || DEFAULT_COLOR
  if (colors.indexOf(finalColor) < 0) {
    finalColor = DEFAULT_COLOR
  }
  if (!colorStyle) {
    colorStyle = document.createElement('style')
    document.body.appendChild(colorStyle)
  }
  colorStyle.innerHTML = `
    :root {
      --vp-c-indigo-1: ${finalColor};
      --vp-c-indigo-2: ${lighten(finalColor, 20)};
      --vp-c-indigo-3: ${lighten(finalColor, 40)};
      --vp-home-hero-bg: linear-gradient(180deg, transparent 0%, ${hexToRgba(finalColor, 0.1)} 52%, transparent 100%)
    }`
}, { immediate: inBrowser, flush: 'post' })

function changePrimaryColor (color) {
  currentColor.value = color
}

function lighten (color, percent) {
  color = color.replace(/^#/, "")

  let r = parseInt(color.substring(0, 2), 16)
  let g = parseInt(color.substring(2, 4), 16)
  let b = parseInt(color.substring(4, 6), 16)

  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)))
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)))
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)))

  return (
    "#" +
    [r, g, b]
      .map(x => x.toString(16).padStart(2, "0"))
      .join("")
  )
}

function hexToRgba (hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

</script>

<style scoped>
  .color-palette {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    z-index: 1000;
    right: 36px;
    bottom: 96px;
    cursor: pointer;
    background-color: var(--vp-c-bg-elv);
    box-shadow: var(--vp-shadow-3);
    transition: all .3s ease;
    border: solid 1px var(--vp-c-border);
  }

  .color-palette:hover {
    background-color: var(--vp-c-bg-soft);
  }

  .content {
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    bottom: calc(100% + 4px);
    right: 0;
    padding: 10px;
    gap: 10px;;
    border-radius: 8px;
    background-color: var(--vp-c-bg-elv);
    box-shadow: var(--vp-shadow-3);
    color: var(--vp-c-text-1);
    font-size: 14px;
    white-space: nowrap;
    user-select: none;
    transform: scale(0);
    opacity: 0;
    transform-origin: bottom;
    transition: all .3s ease;
  }

  .content.visible {
    opacity: 1;
    transform: scale(1);
  }

  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: solid 1px;
    box-sizing: border-box;
  }

  .item span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: currentColor;
  }
</style>

