<script setup>
import { onMounted, ref } from 'vue'
import { withBase, useData } from 'vitepress'

import i18n from '../@i18n'
import Logo from '../@components/Logo.vue'
import Particle from '../@components/Particle.vue'

const { lang } = useData()
const root = ref('/')
onMounted(() => {
  root.value = lang.value === 'zh-CN' ? '/' : `/${lang.value}/`
})

const particle = ref(null)

function showParticle() {
  if (particle.value && particle.value.start) {
    particle.value.start()
  }
}
</script>

<template>
  <div class="NotFound">
    <div class="logo">
      <span>4</span>
      <Logo size="90"/>
      <span>4</span>
    </div>
    
    <p class="title">{{ i18n('view_404_title', lang) }}</p>
    <p class="tip" style="margin-top: 30px;">
      {{ i18n('view_404_desc_1', lang) }}
    </p>
    <p class="tip">
      {{ i18n('view_404_desc_2', lang) }}
    </p>
    <div class="action">
      <a
        class="link"
        :href="withBase(root)"
        aria-label="go to home"
        @mouseenter="showParticle">
        <Particle ref="particle">
          <svg
            viewBox="0 0 1024 1024"
            width="16"
            height="16"
            fill="currentColor">
            <path d="M1002.7584 475.776L566.2784 39.68 537.1584 10.24a35.584 35.584 0 0 0-50.176 0L21.2544 475.776A72.192 72.192 0 0 0 0.0064 527.744a72.96 72.96 0 0 0 73.28 71.488h48v367.872h781.44V599.232h49.024c19.264 0 37.44-7.552 51.136-21.184 13.696-13.696 21.12-31.872 21.12-51.2 0-19.2-7.552-37.376-21.248-51.072z m-427.52 410.048H448.7744v-230.4h126.464v230.4z m246.144-367.872v367.872h-173.824V628.288a45.184 45.184 0 0 0-45.184-45.184H421.6384a45.184 45.184 0 0 0-45.184 45.184v257.536H202.6304V517.952H94.2144l417.92-417.6 26.048 26.112 391.68 391.488h-108.48z"/>
          </svg>
        </Particle>
        {{ i18n('view_404_back_home', lang) }}
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
  gap: 20px;
}

.NotFound .logo span {
  font-size: 110px;
  font-weight: 600;
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
  display: flex;
  justify-content: center;
  padding-top: 20px;
  color: var(--vp-c-indigo-1);
}

.link {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: auto;
  gap: 8px;
  border: 1px solid var(--vp-c-brand);
  border-radius: 16px;
  padding: 4px 16px;
  font-size: 14px;
  font-weight: 500;
  transition: border-color 0.2s, color 0.2s;
}

.link:hover {
  border-color: var(--vp-c-indigo-2);
  color: var(--vp-c-indigo-2);
}
</style>