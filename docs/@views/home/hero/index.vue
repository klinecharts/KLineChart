<script setup>
import { useData } from 'vitepress'

import i18n from '../../../@i18n'
import TextLogo from './TextLogo.vue'
import Slogan from './slogan/index.vue'
import QuickStartButton from './QuickStartButton.vue'
import GithubStarButton from './GithubStarButton.vue'

const { lang } = useData()

</script>

<template>
  <div class="hero">
    <div class="container">
      <TextLogo/>
      <Slogan/>
      <p class="tagline">
        {{ i18n('view_home_hero_desc', lang) }}
      </p>
      <div class="actions">
        <QuickStartButton/>
        <GithubStarButton
          username="klinecharts" 
          repo="KLineChart"
          :delay="2"
          :inView="true"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: calc((var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) * -1);
  padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 48px) 24px 48px;
  background: var(--vp-home-hero-bg);
  transition: background .3s ease;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 0 auto;
  max-width: 1080px;
}

.tagline {
  max-width: 392px;
  line-height: 26px;
  font-size: 16px;
  font-weight: 500;
  white-space: pre-wrap;
  color: var(--vp-c-text-2);
  max-width: 100%;
  opacity: 0;
  animation: toTop .6s ease forwards;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  padding-top: 32px;
  font-weight: 500;
  opacity: 0;
  animation: toTop .6s ease forwards 0.6s;
}

@keyframes toTop {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 640px) {
  .hero {
    padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 80px) 48px 64px;
  }
  .tagline {
    max-width: 576px;
    font-size: 20px;
  }
  .actions {
    gap: 20px;
    padding-top: 40px;
  }
}

@media (min-width: 960px) {
  .hero {
    padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 100px) 64px 100px 64px;
  }
  .tagline {
    font-size: 24px;
    max-width: 660px;
  }
  .actions {
    padding-top: 48px;
    font-size: 16px;
  }
}
</style>