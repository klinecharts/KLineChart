<script setup>
import { computed, ref } from 'vue'
import { useData } from 'vitepress'

import i18n from '../../../@i18n'
import TextLogo from './TextLogo.vue'
import Slogan from './slogan/index.vue'
import QuickStartButton from './QuickStartButton.vue'
import GithubStarButton from './GithubStarButton.vue'

const { lang } = useData()

const pointer = ref({
  active: false,
  x: 50,
  y: 0
})

const heroStyle = computed(() => ({
  '--hero-mouse-x': `${pointer.value.x}%`,
  '--hero-mouse-y': `${pointer.value.y}%`,
  '--hero-shift-x': `${(pointer.value.x - 50) * 0.12}px`,
  '--hero-shift-y': `${pointer.value.y * 0.08}px`
}))

function handlePointerMove (event) {
  const currentTarget = event.currentTarget
  if (!(currentTarget instanceof HTMLElement)) {
    return
  }
  const rect = currentTarget.getBoundingClientRect()
  pointer.value = {
    active: true,
    x: ((event.clientX - rect.left) / rect.width) * 100,
    y: ((event.clientY - rect.top) / rect.height) * 100
  }
}

function handlePointerLeave () {
  pointer.value = {
    active: false,
    x: 50,
    y: 0
  }
}

</script>

<template>
  <div class="hero" :style="heroStyle" @pointermove="handlePointerMove" @pointerleave="handlePointerLeave">
    <div class="container">
      <TextLogo/>
      <Slogan/>
      <p class="tagline">
        {{ i18n('view_home_hero_desc', lang) }}
      </p>
      <div class="actions">
        <QuickStartButton/>
        <GithubStarButton
          username="klinecharts" 
          repo="KLineChart"
          :delay="2"
          :inView="true"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: calc((var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) * -1);
  padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 60px) 24px 80px 24px;
  background: var(--vp-home-hero-bg);
  transition: background .3s ease;
}

.hero::before,
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero::before {
  background:
    radial-gradient(circle at var(--hero-mouse-x) var(--hero-mouse-y), color-mix(in srgb, var(--vp-c-indigo-1) 10%, transparent) 0%, transparent 24%),
    linear-gradient(180deg, color-mix(in srgb, var(--vp-c-indigo-1) 4%, transparent), transparent 26%),
    linear-gradient(90deg, color-mix(in srgb, var(--vp-c-indigo-1) 15%, transparent) 1px, transparent 1px),
    linear-gradient(180deg, color-mix(in srgb, var(--vp-c-indigo-1) 13%, transparent) 1px, transparent 1px);
  background-size: auto, auto, 88px 88px, 88px 88px;
  background-position:
    var(--hero-shift-x) var(--hero-shift-y),
    center top,
    var(--hero-shift-x) var(--hero-shift-y),
    var(--hero-shift-x) var(--hero-shift-y);
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.5), transparent 78%);
  opacity: 0.72;
  transition:
    background-position .18s ease-out,
    opacity .2s ease,
    transform .18s ease-out;
}

.hero::after {
  inset: auto 0 0;
  height: 132px;
  background:
    linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--vp-c-bg) 97%, transparent) 100%);
}

.container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 0 auto;
  max-width: 1080px;
}

.tagline {
  line-height: clamp(26px, 3.2vw, 34px);
  font-size: clamp(16px, 2.35vw, 22px);
  font-weight: 500;
  white-space: pre-wrap;
  color: var(--vp-c-text-2);
  max-width: 100%;
  opacity: 0;
  animation: toTop .6s ease forwards;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  padding-top: 32px;
  font-weight: 500;
  opacity: 0;
  animation: toTop .6s ease forwards 0.6s;
}

@keyframes toTop {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 640px) {
  .hero {
    padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 100px) 48px 110px 48px;
  }
  .tagline {
    max-width: 576px;
  }
  .actions {
    gap: 20px;
    padding-top: 40px;
  }
}

@media (min-width: 960px) {
  .hero {
    padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 120px) 64px 120px 64px;
  }
  .tagline {
    max-width: 640px;
  }
  .actions {
    padding-top: 48px;
    font-size: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero::before {
    transition: none;
  }
}
</style>
