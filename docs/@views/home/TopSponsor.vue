<script setup>
import { useData } from 'vitepress'

import i18n from '../../@i18n'

const { isDark, lang } = useData()
</script>

<template>
  <div class="top-sponsor">
    <a
      class="top-sponsor-link"
      href="https://www.tradingx.cloud/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div class="copy">
        <span class="eyebrow">{{ i18n('view_home_top_sponsor', lang) }}</span>
        <strong>{{ lang === 'zh-CN' ? 'TradingX' : 'TradingX' }}</strong>
        <p>
          {{
            lang === 'zh-CN'
              ? '面向真实交易场景的支持者'
              : 'Supporting KLineChart in real trading scenarios'
          }}
        </p>
      </div>
      <div class="brand">
        <img :class="{ invert: isDark }" src="/images/sponsors/tradingx.png" alt="tradingx">
      </div>
    </a>
  </div>
</template>

<style scoped>
.top-sponsor {
  display: flex;
  justify-content: center;
  margin: 8px 24px 36px;
}

.top-sponsor-link {
  position: relative;
  display: grid;
  width: 100%;
  max-width: 1120px;
  gap: 18px;
  padding: 18px 20px;
  overflow: hidden;
  border-radius: 28px;
  text-decoration: none;
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--vp-c-brand-1) 16%, transparent), transparent 36%),
    linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent), transparent 58%),
    color-mix(in srgb, var(--vp-c-bg-soft) 72%, var(--vp-c-bg));
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 12%, var(--vp-c-divider));
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.06);
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}

.top-sponsor-link:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 22%, var(--vp-c-divider));
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.08);
}

.copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.eyebrow {
  display: inline-flex;
  width: fit-content;
  font-size: 11px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}

.copy strong {
  font-size: 26px;
  line-height: 1;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.copy p {
  font-size: 14px;
  line-height: 22px;
  color: var(--vp-c-text-2);
}

.brand {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 72px;
  padding: 14px 16px;
  border-radius: 22px;
  background: color-mix(in srgb, var(--vp-c-bg) 60%, transparent);
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 10%, var(--vp-c-divider));
}

.brand img {
  width: auto;
  max-width: 180px;
  height: 42px;
  object-fit: contain;
}

.brand img.invert {
  filter: invert(1);
}

@media (min-width: 640px) {
  .top-sponsor {
    margin: 12px 32px 42px;
  }

  .top-sponsor-link {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 20px;
    padding: 20px 24px;
  }

  .copy strong {
    font-size: 30px;
  }

  .brand {
    justify-content: center;
    min-width: 240px;
    min-height: 88px;
    padding: 16px 20px;
  }

  .brand img {
    max-width: 200px;
    height: 50px;
  }
}

@media (min-width: 960px) {
  .top-sponsor {
    margin: 16px 64px 62px;
  }

  .top-sponsor-link {
    padding: 24px 28px;
    border-radius: 32px;
  }

  .copy strong {
    font-size: 34px;
  }

  .copy p {
    font-size: 15px;
  }

  .brand {
    min-width: 280px;
    min-height: 96px;
  }

  .brand img {
    max-width: 220px;
    height: 56px;
  }
}
</style>
