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
        <div class="eyebrow">
          <span>{{ i18n('view_home_top_sponsor', lang) }}</span>
          <em>TOP</em>
        </div>
        <div class="headline">
          <strong>{{ lang === 'zh-CN' ? 'TradingX' : 'TradingX' }}</strong>
          <p>{{ i18n('view_home_top_sponsor_desc', lang) }}</p>
        </div>
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
  margin: 10px 24px 34px;
}

.top-sponsor-link {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 1120px;
  gap: 12px;
  padding: 30px 16px 14px;
  overflow: visible;
  border-radius: 22px;
  text-decoration: none;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--vp-c-brand-1) 3%, transparent), transparent 28%),
    color-mix(in srgb, var(--vp-c-bg-soft) 46%, var(--vp-c-bg));
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 5%, var(--vp-c-divider));
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.05);
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}

.top-sponsor-link::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(110deg, transparent 22%, color-mix(in srgb, #ffffff 10%, transparent) 48%, transparent 72%);
  opacity: 0;
  transform: translateX(-28%);
  transition: opacity .25s ease, transform .45s ease;
  pointer-events: none;
}

.top-sponsor-link:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 14%, var(--vp-c-divider));
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.07);
}

.top-sponsor-link:hover::after {
  opacity: 1;
  transform: translateX(20%);
}

.copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  min-width: 0;
}

.eyebrow {
  display: inline-flex;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  align-items: center;
  gap: 10px;
  width: fit-content;
  min-height: 32px;
  padding: 4px 4px 4px 12px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 12%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--vp-c-bg-soft) 42%, var(--vp-c-bg));
}

.eyebrow span {
  font-size: 11px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}

.eyebrow em {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  min-height: 24px;
  padding: 0 9px;
  border-radius: 999px;
  font-size: 10px;
  line-height: 1;
  font-style: normal;
  font-weight: 800;
  letter-spacing: 0.18em;
  color: white;
  background: var(--vp-c-brand-1);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
}

.headline {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.copy strong {
  font-size: clamp(18px, 2.1vw, 22px);
  line-height: 1.1;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.copy p {
  font-size: clamp(13px, 1.5vw, 14px);
  line-height: clamp(20px, 2.3vw, 22px);
  color: var(--vp-c-text-2);
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  min-height: 64px;
  padding: 12px 16px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 34%, var(--vp-c-bg));
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 6%, var(--vp-c-divider));
}

.brand img {
  width: auto;
  max-width: 168px;
  height: 38px;
  object-fit: contain;
  transition: transform .25s ease;
}

.brand img.invert {
  filter: invert(1);
}

.top-sponsor-link:hover .brand img {
  transform: scale(1.03);
}

@media (min-width: 640px) {
  .top-sponsor {
    margin: 12px 32px 40px;
  }

  .top-sponsor-link {
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 30px 20px 16px;
  }

  .copy {
    gap: 6px;
    max-width: 360px;
  }

  .brand {
    align-self: auto;
    min-width: 220px;
    min-height: 68px;
    padding: 12px 18px;
  }

  .brand img {
    max-width: 190px;
    height: 42px;
  }
}

@media (min-width: 960px) {
  .top-sponsor {
    margin: 14px 64px 56px;
  }

  .top-sponsor-link {
    max-width: 760px;
    gap: 64px;
    padding: 34px 24px 18px;
    border-radius: 24px;
  }

  .copy {
    max-width: 400px;
  }

  .brand {
    min-width: 248px;
    min-height: 74px;
  }

  .brand img {
    max-width: 206px;
    height: 46px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .top-sponsor-link,
  .top-sponsor-link::after,
  .brand img {
    transition: none;
  }

  .top-sponsor-link:hover,
  .top-sponsor-link:hover .brand img {
    transform: none;
  }

  .top-sponsor-link:hover::after {
    opacity: 0;
    transform: none;
  }
}

:global(html:not(.dark)) .top-sponsor-link:hover {
  box-shadow:
    0 22px 44px color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent),
    0 14px 26px rgba(15, 23, 42, 0.12);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 28%, var(--vp-c-divider));
}

:global(html:not(.dark)) .top-sponsor-link:hover::after {
  opacity: 1;
}
</style>
