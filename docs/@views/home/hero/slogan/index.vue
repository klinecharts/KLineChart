<script setup>
import { useData } from 'vitepress'

import DropText from './DropText.vue'

import i18n from '../../../../@i18n'

const { lang } = useData()

</script>

<template>
  <div class="slogan">
    <DropText className="background-text" :text="i18n('view_home_hero_title', lang)" :disableAnimation="true"/>
    <DropText className="real-text" :text="i18n('view_home_hero_title', lang)" />
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
  padding: 10px 0 12px 0;
  max-width: 80%;
  position: relative;
  flex-direction: column;
}

.background-text {
  color: var(--vp-c-text-3);
  opacity: 0.6;
}

.real-text {
  position: absolute;
}

@media (min-width: 640px) {
  .slogan {
    padding: 18px 0 28px 0;
    max-width: 70%;
  }
}

@media (min-width: 960px) {
  .slogan {
    padding: 26px 0 36px 0;
    max-width: 700px;
  }
}
</style>
