<script setup>
import { useData } from 'vitepress'

import i18n from '../../@i18n'

const { isDark, lang } = useData()
</script>

<template>
  <div class="top-sponsor">
    <a
      class="top-sponsor-link home-card home-card--interactive home-card--overflow-visible home-reveal-auto"
      href="https://www.tradingx.cloud/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div class="eyebrow">
        <span>{{ i18n('view_home_top_sponsor', lang) }}</span>
        <em>TOP</em>
      </div>
      <div class="brand">
        <img :class="{ invert: isDark }" src="/images/sponsors/tradingx.png" alt="tradingx">
      </div>
      <p class="desc">{{ i18n('view_home_top_sponsor_desc', lang) }}</p>
    </a>
  </div>
</template>

<style scoped>
.top-sponsor {
  display: flex;
  justify-content: center;
  margin: 0 24px;
}

.top-sponsor-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1120px;
  gap: 8px;
  padding: 30px 16px 14px;
  text-decoration: none;
  --home-reveal-distance: 20px;
  --home-reveal-delay: .75s;
}

.desc {
  font-size: clamp(15px, 1.7vw, 17px);
  line-height: clamp(24px, 2.6vw, 27px);
  color: var(--vp-c-text-1);
  text-align: center;
  margin: 0;
}

.top-sponsor-link .eyebrow {
  display: inline-flex;
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 3;
  transform: translate(-50%, -50%);
  align-items: center;
  gap: 10px;
  width: fit-content;
  min-height: 32px;
  padding: 4px 4px 4px 12px;
  border-radius: 999px;
  border: 1px solid var(--home-brand-border);
  background: var(--home-brand-surface-soft);
  transition: border-color .4s var(--home-ease-out);
}

.top-sponsor-link:hover .eyebrow {
  border-color: var(--home-brand-border-hover);
}

.top-sponsor-link .eyebrow span {
  font-size: 12px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}

.top-sponsor-link .eyebrow em {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  min-height: 24px;
  padding: 0 9px;
  border-radius: 999px;
  font-size: 11px;
  line-height: 1;
  font-style: normal;
  font-weight: 800;
  letter-spacing: 0.18em;
  color: white;
  background: var(--vp-c-brand-1);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand img {
  width: auto;
  max-width: 168px;
  height: 38px;
  object-fit: contain;
}

.brand img.invert {
  filter: invert(1);
}

@media (min-width: 640px) {
  .top-sponsor {
    margin: 0 32px;
  }

  .top-sponsor-link {
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 30px 20px 16px;
  }

  .brand {
    order: 1;
  }

  .desc {
    order: 2;
    text-align: left;
    max-width: 360px;
  }

  .brand img {
    max-width: 190px;
    height: 42px;
  }
}

@media (min-width: 960px) {
  .top-sponsor {
    margin: 0 64px;
  }

  .top-sponsor-link {
    max-width: 760px;
    gap: 32px;
    padding: 34px 24px 18px;
  }

  .desc {
    max-width: 400px;
  }

  .brand img {
    max-width: 206px;
    height: 46px;
  }
}
</style>
