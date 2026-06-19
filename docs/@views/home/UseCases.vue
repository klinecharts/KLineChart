<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

import i18n from '../../@i18n'
import Section from './Section.vue'
import { useInView } from './composables/useInView.js'

const { lang } = useData()
const { target: casesRef, isVisible } = useInView()

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
    <div ref="casesRef" class="use-cases home-stagger" :class="{ 'is-visible': isVisible }">
      <article
        v-for="(item, index) in items"
        :key="item.title"
        class="use-case home-card home-card--interactive home-card-body home-stagger-item"
        :style="{ '--stagger-delay': `${index * 0.07}s` }"
      >
        <div class="case-index" aria-hidden="true">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <i />
        </div>
        <h3>{{ item.title }}</h3>
        <p class="summary">{{ item.description }}</p>
        <ul class="points">
          <li v-for="point in item.points" :key="point">
            <span class="point-line" aria-hidden="true" />
            <p>{{ point }}</p>
          </li>
        </ul>
      </article>
    </div>
  </Section>
</template>

<style scoped>
.use-cases {
  display: grid;
  width: 100%;
  gap: var(--home-grid-gap);
}

.use-case {
  min-height: 100%;
}

.case-index {
  display: flex;
  align-items: center;
  gap: 10px;
}

.case-index span {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--vp-c-brand-1);
}

.case-index i {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--vp-c-brand-1) 40%, transparent), transparent);
}

.points {
  display: grid;
  gap: 10px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.points li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.point-line {
  flex-shrink: 0;
  width: 14px;
  height: 2px;
  margin-top: 10px;
  border-radius: 2px;
  background: var(--vp-c-brand-1);
}

.points p {
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-1);
}

@media (min-width: 960px) {
  .use-cases {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--home-grid-gap-lg);
  }
}
</style>
