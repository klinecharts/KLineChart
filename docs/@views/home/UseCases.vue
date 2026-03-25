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
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 100%;
  padding: 18px 0 24px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 10%, var(--vp-c-divider));
}

.use-case h3 {
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.summary {
  max-width: 30ch;
  font-size: 15px;
  line-height: 24px;
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
}

.point p {
  font-size: 14px;
  line-height: 23px;
  color: var(--vp-c-text-1);
}

@media (min-width: 640px) {
  .use-cases-section {
    padding-top: 126px;
  }
}

@media (min-width: 960px) {
  .use-cases {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 26px;
  }

  .use-case {
    padding: 8px 8px 0 0;
    border-bottom: none;
  }
}
</style>
