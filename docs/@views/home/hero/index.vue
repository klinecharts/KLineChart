<script setup>
import { useData } from 'vitepress'

import i18n from '../../../@i18n'
import HeroBackground from '../HeroBackground.vue'
import TextLogo from './TextLogo.vue'
import Slogan from './slogan/index.vue'
import QuickStartButton from './QuickStartButton.vue'
import GithubStarButton from './GithubStarButton.vue'

const { lang } = useData()
</script>

<template>
  <div class="hero">
    <HeroBackground />
    <div class="container">
      <TextLogo />
      <Slogan />
      <p class="tagline">
        {{ i18n('view_home_hero_desc', lang) }}
      </p>
      <div class="actions">
        <QuickStartButton />
        <GithubStarButton
          username="klinecharts"
          repo="KLineChart"
          :delay="2"
          :in-view="true"
        />
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
  justify-content: center;
  overflow: hidden;
  margin-top: calc((var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) * -1);
  padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 60px) 24px 80px;
  background: transparent;
}

.container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 0 auto;
  max-width: 1080px;
}

.tagline {
  margin: 14px 0 0;
  line-height: clamp(26px, 3.2vw, 34px);
  font-size: clamp(16px, 2.35vw, 22px);
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
  padding-top: 24px;
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
    padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 100px) 48px 110px;
  }

  .tagline {
    margin-top: 16px;
    max-width: 576px;
  }

  .actions {
    gap: 20px;
    padding-top: 30px;
  }
}

@media (min-width: 960px) {
  .hero {
    padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 120px) 64px 120px;
  }

  .tagline {
    margin-top: 18px;
    max-width: 640px;
  }

  .actions {
    padding-top: 36px;
    font-size: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tagline,
  .actions {
    opacity: 1;
    animation: none;
  }
}
</style>
