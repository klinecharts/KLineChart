<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

import i18n from '../../@i18n'
import Section from './Section.vue'

const { lang } = useData()

const items = computed(() => [
  {
    title: i18n('view_home_case_1_title', lang.value),
    description: i18n('view_home_case_1_desc', lang.value),
    points: [
      i18n('view_home_case_1_point_1', lang.value),
      i18n('view_home_case_1_point_2', lang.value),
      i18n('view_home_case_1_point_3', lang.value)
    ]
  },
  {
    title: i18n('view_home_case_2_title', lang.value),
    description: i18n('view_home_case_2_desc', lang.value),
    points: [
      i18n('view_home_case_2_point_1', lang.value),
      i18n('view_home_case_2_point_2', lang.value),
      i18n('view_home_case_2_point_3', lang.value)
    ]
  },
  {
    title: i18n('view_home_case_3_title', lang.value),
    description: i18n('view_home_case_3_desc', lang.value),
    points: [
      i18n('view_home_case_3_point_1', lang.value),
      i18n('view_home_case_3_point_2', lang.value),
      i18n('view_home_case_3_point_3', lang.value)
    ]
  }
])
</script>

<template>
  <Section
    out-class="use-cases-section"
    :title="i18n('view_home_case_title', lang)"
    :description="i18n('view_home_case_desc', lang)"
  >
    <div class="use-cases">
      <article
        v-for="item in items"
        :key="item.title"
        class="use-case"
      >
        <h3>{{ item.title }}</h3>
        <p class="summary">{{ item.description }}</p>
        <ul class="points">
          <li v-for="point in item.points.slice(0, 2)" :key="point" class="point">
            <span class="point-dot"></span>
            <p>{{ point }}</p>
          </li>
        </ul>
      </article>
    </div>
  </Section>
</template>

<style scoped>
.use-cases-section {
  padding-top: 60px;
}

.use-cases {
  display: grid;
  width: 100%;
  gap: 14px;
}

.use-case {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 100%;
  padding: 20px 18px 24px;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-divider));
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--vp-c-brand-1) 3%, transparent), transparent 54%),
    color-mix(in srgb, var(--vp-c-bg-soft) 48%, var(--vp-c-bg));
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}

.use-case::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 22%, color-mix(in srgb, #ffffff 10%, transparent) 48%, transparent 72%);
  opacity: 0;
  transform: translateX(-28%);
  transition: opacity .25s ease, transform .45s ease;
  pointer-events: none;
}

.use-case:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 18%, var(--vp-c-divider));
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.06);
}

.use-case:hover::before {
  opacity: 1;
  transform: translateX(20%);
}

.use-case h3 {
  font-size: clamp(18px, 2.2vw, 20px);
  line-height: clamp(26px, 3vw, 28px);
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.summary {
  max-width: 30ch;
  font-size: clamp(14px, 1.5vw, 15px);
  line-height: clamp(22px, 2.6vw, 24px);
  color: var(--vp-c-text-2);
}

.points {
  display: grid;
  gap: 12px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.point {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-top: 2px;
}

.point-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-top: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
  transition: transform .25s ease, box-shadow .25s ease;
}

.use-case:hover .point-dot {
  transform: scale(1.1);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}

.point p {
  font-size: clamp(14px, 1.4vw, 15px);
  line-height: clamp(22px, 2.6vw, 24px);
  color: var(--vp-c-text-1);
}

@media (min-width: 640px) {
  .use-cases-section {
    padding-top: 126px;
  }
}

@media (min-width: 768px) and (max-width: 959px) {
  .use-cases {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px 28px;
  }

  .use-case {
    padding: 18px 18px 22px;
  }

  .summary {
    max-width: 36ch;
  }
}

@media (min-width: 960px) {
  .use-cases {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 26px;
  }

  .use-case {
    padding: 20px 20px 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .use-case,
  .use-case::before,
  .point-dot {
    transition: none;
  }

  .use-case:hover {
    transform: none;
    box-shadow: none;
  }

  .use-case:hover::before {
    opacity: 0;
    transform: none;
  }

  .use-case:hover .point-dot {
    transform: none;
    box-shadow: none;
  }
}

:global(html:not(.dark)) .use-case:hover {
  box-shadow:
    0 22px 44px color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent),
    0 14px 28px rgba(15, 23, 42, 0.14);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 30%, var(--vp-c-divider));
}

:global(html:not(.dark)) .use-case:hover::before {
  opacity: 1;
}
</style>
