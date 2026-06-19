<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

import i18n from '../../@i18n'
import Section from './Section.vue'
import { useInView } from './composables/useInView.js'

const { lang, isDark } = useData()
const { target: bentoRef, isVisible } = useInView()

const icons = [
  { light: '/images/box_light.png', dark: '/images/box_dark.png' },
  { light: '/images/rocket_light.png', dark: '/images/rocket_dark.png' },
  { light: '/images/power_light.png', dark: '/images/power_dark.png' },
  { light: '/images/expand_light.png', dark: '/images/expand_dark.png' },
  { light: '/images/mobile_light.png', dark: '/images/mobile_dark.png' },
  { light: '/images/typescript_light.png', dark: '/images/typescript_dark.png' }
]

function buildItem(index) {
  return {
    icon: icons[index],
    title: i18n(`view_home_advantage_${index + 1}_title`, lang.value),
    description: i18n(`view_home_advantage_${index + 1}_desc`, lang.value),
    metrics: [
      {
        value: i18n(`view_home_advantage_${index + 1}_metric_1_value`, lang.value),
        label: i18n(`view_home_advantage_${index + 1}_metric_1_label`, lang.value)
      },
      {
        value: i18n(`view_home_advantage_${index + 1}_metric_2_value`, lang.value),
        label: i18n(`view_home_advantage_${index + 1}_metric_2_label`, lang.value)
      }
    ],
    points: [
      i18n(`view_home_advantage_${index + 1}_point_1`, lang.value),
      i18n(`view_home_advantage_${index + 1}_point_2`, lang.value)
    ]
  }
}

const items = computed(() => icons.map((_, index) => buildItem(index)))
</script>

<template>
  <Section
    out-class="advantages-section"
    :title="i18n('view_home_advantage_title', lang)"
    :description="i18n('view_home_advantage_desc', lang)"
  >
    <div ref="bentoRef" class="bento home-stagger" :class="{ 'is-visible': isVisible }">
      <article
        v-for="(item, index) in items"
        :key="item.title"
        class="tile home-card home-card--interactive home-card-body home-stagger-item"
        :class="`tile-${index + 1}`"
        :style="{ '--stagger-delay': `${index * 0.07}s` }"
      >
        <div class="tile-head">
          <img
            class="icon"
            :src="withBase(isDark ? item.icon.dark : item.icon.light)"
            :alt="''"
            width="28"
            height="28"
            loading="lazy"
          >
          <h3>{{ item.title }}</h3>
        </div>
        <p class="summary">{{ item.description }}</p>
        <div class="metrics">
          <div v-for="metric in item.metrics" :key="metric.label" class="metric">
            <strong>{{ metric.value }}</strong>
            <span>{{ metric.label }}</span>
          </div>
        </div>
        <ul class="points">
          <li v-for="point in item.points" :key="point">
            <span class="dot" aria-hidden="true" />
            <span>{{ point }}</span>
          </li>
        </ul>
      </article>
    </div>
  </Section>
</template>

<style scoped>
.bento {
  display: grid;
  width: 100%;
  gap: var(--home-grid-gap);
}

.tile {
  min-height: 100%;
}

.tile-head {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--vp-c-bg) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-divider));
}

.metric strong {
  font-family: var(--vp-font-family-mono);
  font-size: 16px;
  line-height: 1;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.metric span {
  font-size: 12px;
  line-height: 17px;
  color: var(--vp-c-text-3);
}

.points {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.points li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-1);
}

.dot {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  margin-top: 7px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--vp-c-brand-1) 24%, transparent);
  animation: dotPulse 2.8s ease-in-out infinite;
}

.tile-2 .dot {
  animation-delay: .4s;
}

.tile-3 .dot {
  animation-delay: .8s;
}

.tile-4 .dot {
  animation-delay: 1.2s;
}

.tile-5 .dot {
  animation-delay: 1.6s;
}

.tile-6 .dot {
  animation-delay: 2s;
}

@keyframes dotPulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
  }

  50% {
    box-shadow: 0 0 0 5px color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent);
  }
}

@media (min-width: 640px) {
  .icon {
    width: 32px;
    height: 32px;
  }
}

@media (min-width: 960px) {
  .bento {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: var(--home-grid-gap-lg);
  }

  .tile-1,
  .tile-2,
  .tile-3,
  .tile-4,
  .tile-5,
  .tile-6 {
    grid-column: span 6;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dot {
    animation: none;
  }
}
</style>
