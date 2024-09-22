<script setup>
import { onMounted, ref } from 'vue'
import { withBase, useData } from 'vitepress'

const { lang } = useData()
const root = ref('/')
onMounted(() => {
  root.value = lang.value === 'zh-CN' ? '/' : `/${lang.value}/`
})
</script>

<template>
  <div class="NotFound">
    <div class="logo">
      <span>4</span>
      <img src="/images/logo.svg"/>
      <span>4</span>
    </div>
    
    <p class="title">{{ lang === 'zh-CN' ? '未找到页面' : 'Page Not Found'}}</p>
    <p class="tip" style="margin-top: 30px;">
      {{ lang === 'zh-CN' ? '确保地址正确且页面未移除。' : `Make sure the address is correct and the page hasn't moved.` }}
    </p>
    <p class="tip">
      {{ lang === 'zh-CN' ? '如果您认为这是一个错误，请联系您的 KLineChart 管理员。' : 'Please contact your KLineChart administrator if you think this is a mistake.' }}
    </p>
    <div class="action">
      <a class="link" :href="withBase(root)" aria-label="go to home">
        {{ lang === 'zh-CN' ? '返回首页' : 'Take me home' }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.NotFound {
  padding: 96px 24px 96px;
  text-align: center;
}

.NotFound .logo {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.NotFound .logo span {
  font-size: 110px;
  font-weight: 600;
}

.NotFound .logo img {
  width: 92px;
  margin: 0 16px
}

@media (min-width: 768px) {
  .NotFound {
    padding: 128px 32px 168px;
  }
}

.title {
  padding-top: 30px;
  letter-spacing: 2px;
  font-size: 30px;
  font-weight: 700;
}

.tip {
  font-size: 14px;
  color: var(--vp-c-text-2)
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