<script setup>
import { useData } from 'vitepress';

const { isDark, lang } = useData()
</script>

<template>
  <a class="asideSponsor" href="https://www.tradingx.cloud/" target="_blank" rel="noopener noreferrer">
    <img :class="{ 'invert': isDark }" src="/images/sponsors/tradingx.png" alt="tradingx" />
    <span style="padding: 6px 22px 0 22px;text-align: center;">{{ lang === 'zh-CN' ? '以免费赋能专业，以创新重塑交易' : 'Free is the new benchmark of trading innovation.' }}</span>
  </a>
</template>

<style scoped>
.asideSponsor {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--vp-c-text-1);
  font-size: 14px;
  background-color: var(--vp-c-bg-soft);
  min-height: 100px;
  padding: 26px 0;
  border-radius: 8px;
  margin-top: 26px;
  cursor: pointer;
}

.asideSponsor img {
  width: 152px;
  height: 38px;
}

.asideSponsor img.invert {
  filter: invert(1);
}
</style>