<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { withBase, useData } from 'vitepress'


const { lang } = useData()

const root = ref('/')
onMounted(() => {
  console.log(lang.value)
  root.value = lang.value === 'zh-CN' ? '/' : `/${lang.value}/`
})
</script>

<template>
  <div class="NotFound">
    <p class="code">404</p>
    <h1 class="title">{{ lang === 'zh-CN' ? '页面未找到' : 'PAGE NOT FOUND' }}</h1>

    <div class="action">
      <a class="link" :href="withBase(root)" aria-label="go to home">
        {{ lang === 'zh-CN' ? '返回主页' : 'Take me home' }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.NotFound {
  padding: 96px 24px 96px;
  text-align: center;
}

@media (min-width: 768px) {
  .NotFound {
    padding: 128px 32px 168px;
  }
}

.code {
  line-height: 64px;
  font-size: 64px;
  font-weight: 600;
}

.title {
  padding-top: 12px;
  letter-spacing: 2px;
  line-height: 20px;
  font-size: 20px;
  font-weight: 700;
}

.divider {
  margin: 24px auto 18px;
  width: 64px;
  height: 1px;
  background-color: var(--vp-c-divider);
}

.quote {
  margin: 0 auto;
  max-width: 256px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.action {
  padding-top: 20px;
}

.link {
  display: inline-block;
  border: 1px solid var(--vp-c-brand);
  border-radius: 16px;
  padding: 3px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand);
  transition: border-color 0.2s, color 0.2s;
}

.link:hover {
  border-color: var(--vp-c-brand-light);
  color: var(--vp-c-brand-light);
}
</style>