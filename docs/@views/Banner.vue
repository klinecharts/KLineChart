<template>
  <div class="banner" role="banner" v-if="isVisible">
    <span v-if="lang === 'zh-CN'">🎉&nbsp;🎉&nbsp;🎉&nbsp;&nbsp;新版本即将发布，旧版文档请访问 <strong><a target="_blank" href="https://v9.klinecharts.com">这里</a></strong>。</span>
    <span v-else>🎉&nbsp;🎉&nbsp;🎉&nbsp;&nbsp;The new version is about to be released, please visit <strong><a target="_blank" href="https://v9.klinecharts.com">here</a></strong> for the old version document.</span>
    <button class="banner-close" @click.prevent="closeBanner">
      <span class="close">&times;</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'

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
  height: 50px;
  background: var(--vp-c-bg);
  overflow: hidden;
  margin: 0;
  color: var(--vp-c-indigo-1);
  font-size: 14px;
  border-bottom: solid 1px var(--vp-c-gutter);
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
  --vp-layout-top-height: 50px;
}
html.banner-fixed .VPNav,
html.banner-fixed .VPSidebar {
  top: 50px;
}
html.banner-fixed {
  margin-top: 52px;
}
@media (max-width: 960px) {
  html.banner-fixed .VPNav,
  html.banner-fixed .VPSidebar {
    top: 0;
  }
}
</style>
