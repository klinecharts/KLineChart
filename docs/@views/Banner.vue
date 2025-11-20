<template>
  <div class="banner" :class="{ 'top': y === 0 }" role="banner" v-if="visible">
    <span>{{ i18n('view_banner_tip', lang) }}</span>
    <button class="banner-close" @click.prevent="closeBanner">
      <span class="close">&times;</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { useData } from 'vitepress'

import i18n from '../@i18n'

const { y } = useWindowScroll()

const visible = ref(false)

const { lang } = useData()

const closeBanner = () => {
  visible.value = false
  document.documentElement.classList.remove('banner-fixed')
}

onMounted(() => {
  visible.value = true
  document.documentElement.classList.add('banner-fixed')
})
</script>
<style scoped>
.banner {
  --padding: 26px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: fixed;
  padding: 0 var(--padding);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 61;
  width: 100%;
  height: var(--vp-layout-top-height, 50px);
  background-color: var(--vp-c-bg);
  overflow: hidden;
  margin: 0;
  color: #E6AC00;
  font-size: 12px;
  border-bottom: solid 1px var(--vp-c-gutter);
}

.banner span {
  line-height: normal;
}

.banner.top {
   background-color: transparent;
}

.banner-close {
  position: absolute;
  right: calc(var(--padding) - 8px);
  color: var(--vp-c-text-1);
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-close > .close {
  font-size: 20px;
  font-weight: 500;
}

@media (min-width: 640px) {
  .banner {
    font-size: 14px;
  }
}
</style>

<style>
html.banner-fixed {
  --vp-layout-top-height: 50px
}
</style>
