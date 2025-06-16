<script setup>
import { useData } from 'vitepress'
import i18n from '../../@i18n'

const { isDark, lang } = useData()
</script>

<template>
  <div class="topSponsor">
    <a href="https://www.tradingx.cloud/" target="_blank" rel="noopener noreferrer">
      <span>{{ i18n('view_home_top_sponsor', lang) }}</span>
      <img :class="{ 'invert': isDark }" src="/images/sponsors/tradingx.png" alt="tradingx" />
    </a>
  </div>
</template>

<style scoped>
.topSponsor {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 32px;
  border-top: solid 1px var(--vp-c-divider);
  border-bottom: solid 1px var(--vp-c-divider);
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.topSponsor a {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  cursor: pointer;
}

.topSponsor a img {
  height: 40px;
}

.topSponsor a img.invert {
  filter: invert(1)
}

@media (min-width: 640px) {
  .topSponsor {
    font-size: 15px;
  }
  .topSponsor a img {
    height: 50px;
  }
}

@media (min-width: 960px) {
  .topSponsor {
    margin-bottom: 68px;
    font-size:16px;
  }
  .topSponsor a {
    padding: 18px 0;
  }
  .topSponsor a img {
    margin-top: 8px;
    height: 60px;
  }
}
</style>