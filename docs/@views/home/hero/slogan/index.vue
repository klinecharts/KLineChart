<script setup>
import { useData } from 'vitepress'

import DropText from './DropText.vue'

import i18n from '../../../../@i18n'

const { lang } = useData()

</script>

<template>
  <div class="slogan">
    <DropText :text="i18n('view_home_hero_title', lang)" />
  </div>
</template>

<style scoped>
.slogan {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1.16;
  font-size: clamp(28px, 4.4vw, 50px);
  font-weight: 700;
  padding: 8px 0 8px 0;
  max-width: 80%;
  position: relative;
  flex-direction: column;
}

@media (min-width: 640px) {
  .slogan {
    padding: 14px 0 16px 0;
    max-width: 70%;
  }
}

@media (min-width: 960px) {
  .slogan {
    padding: 18px 0 20px 0;
    max-width: 700px;
  }
}
</style>
