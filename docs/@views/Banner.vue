<template>
  <div class="banner" :class="{ 'top': y === 0 }" role="banner" v-if="isVisible">
    <span v-if="lang === 'zh-CN'">🔔&nbsp;&nbsp;v9 将维护到 2025 年 3 月份，建议尽快迁移到新版本。</span>
    <span v-else>🔔&nbsp;&nbsp;v9 will be maintained until March 2025. It is recommended to migrate to the new version as soon as possible.</span>
    <button class="banner-close" @click.prevent="closeBanner">
      <span class="close">&times;</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { useData } from 'vitepress'

const { y } = useWindowScroll()

const isVisible = ref(true)

const { lang } = useData()

const closeBanner = () => {
  isVisible.value = false
  document.documentElement.classList.remove('banner-fixed')
}

onMounted(() => {
  if (isVisible.value) {
    document.documentElement.classList.add('banner-fixed')
  }
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
  height: var(--vp-layout-top-height);
  background-color: var(--vp-c-bg);
  overflow: hidden;
  margin: 0;
  color: var(--vp-c-indigo-1);
  font-size: 12px;
  border-bottom: solid 1px var(--vp-c-gutter);
  transition: background-color 0.15s;
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
