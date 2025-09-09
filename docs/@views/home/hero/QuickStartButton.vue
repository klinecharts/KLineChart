<script setup>
import { useData } from 'vitepress'

import i18n from '../../../@i18n'

const { lang } = useData()

</script>

<template>
  <a class="quick-start-button" rel="noreferrer" :href="lang === 'zh-CN' ? '/guide/quick-start' : '/en-US/guide/quick-start'">
    {{ i18n('view_home_hero_button', lang) }}
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
    </svg>
  </a>
</template>

<style scoped>
.quick-start-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 99999px;
  cursor: pointer;
  border: solid 1px var(--vp-c-indigo-1);
  background-color: var(--vp-c-indigo-1);
  color: #FFFFFF;
  padding: 0 16px;
  height: 36px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.quick-start-button:hover {
  background-color: var(--vp-c-indigo-2);
  border-color: var(--vp-c-indigo-2);
}

.quick-start-button svg {
  width: 12px;
  height: 12px;;
  fill: currentColor;
  transition: all 0.3s ease;
  margin-inline-start: 6px;
}

.quick-start-button:hover svg {
  animation: move 0.45s ease infinite alternate;
}

@keyframes move {
  0% {
    transform: translateX(-1px);
  }
  100% {
    transform: translateX(1px);
  }
}

@media (min-width: 640px) {
  .quick-start-button {
    height: 40px;
    font-size: 16px;
    padding: 0 20px;
  }
  .quick-start-button svg {
    width: 14px;
    height: 14px;
    margin-inline-start: 8px;
  }
}
</style>