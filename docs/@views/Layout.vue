<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, provide, onMounted, ref } from 'vue'

import Banner from './Banner.vue'
import HomeHero from './home/hero/index.vue'
import HomeTopSponsor from './home/TopSponsor.vue'
import HomeCreateChart from './home/create-chart/index.vue'
import HomeFAQ from './home/faq/index.vue'
import HomeSponsor from './home/Sponsor.vue'
// import AsideSponsor from './AsideSponsor.vue'
import NotFound from './NotFound.vue'
import ColorPalette from './ColorPalette.vue'
import Loading from '../@components/Loading.vue'

const { isDark } = useData()

const mounted = ref(false)

onMounted(() => {
  mounted.value = true
  document.body.style.overflow = 'auto'
})

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready
 
  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      fill: 'forwards',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )
})
</script>

<template>
  <Loading v-if="!mounted" className="page-loading"/>
  <DefaultTheme.Layout>
    <template #layout-top>
      <Banner/>
    </template>
    <template #home-hero-before>
      <HomeHero/>
      <HomeTopSponsor/>
    </template>
    <template #home-features-after>
      <HomeCreateChart/>
      <HomeFAQ/>
      <HomeSponsor/>
    </template>
    <!-- <template #aside-bottom>
      <AsideSponsor/>
    </template> -->
    <template #not-found>
      <NotFound/>
    </template>
    <template #layout-bottom>
      <ColorPalette/>
    </template>
  </DefaultTheme.Layout>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}

.page-loading {
  position: fixed!important;
  width: 100vw!important;
  height: 100vh!important;
  color: var(--vp-c-text-1)!important;
  background-color: var(--vp-c-bg)!important;
}
</style>