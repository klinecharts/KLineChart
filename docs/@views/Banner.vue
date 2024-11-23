<template>
  <div class="banner" :class="{ 'top': y === 0 }" role="banner" v-if="isVisible">
    <span v-if="lang === 'zh-CN'">🎉&nbsp;🎉&nbsp;🎉&nbsp;&nbsp;新版本即将发布。9.x 版本请访问 <strong><a target="_blank" href="https://v9.klinecharts.com">文档</a></strong>。</span>
    <span v-else>🎉&nbsp;🎉&nbsp;🎉&nbsp;&nbsp;The new version is about to be released. Version 9.x please visit <strong><a target="_blank" href="https://v9.klinecharts.com">document</a></strong>.</span>
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
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: fixed;
  padding: 0 12px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 61;
  width: 100%;
  height: 100%;
  height: var(--vp-layout-top-height);
  background-color: var(--vp-c-bg);
  overflow: hidden;
  margin: 0;
  color: var(--vp-c-indigo-1);
  font-size: 14px;
  border-bottom: solid 1px var(--vp-c-gutter);
  transition: background-color 0.15s;
}

.banner.top {
   background-color: transparent;
}

.banner-close {
  position: absolute;
  right: 32px;
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

@media (max-width: 767px) {
  .banner {
    font-size: 12px;
  }
}
</style>

<style>
html.banner-fixed {
  --vp-layout-top-height: 50px
}
</style>
