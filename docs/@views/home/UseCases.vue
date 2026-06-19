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
    description: i18n('view_home_case_1_desc', lang.value)
  },
  {
    title: i18n('view_home_case_2_title', lang.value),
    description: i18n('view_home_case_2_desc', lang.value)
  },
  {
    title: i18n('view_home_case_3_title', lang.value),
    description: i18n('view_home_case_3_desc', lang.value)
  },
  {
    title: i18n('view_home_case_4_title', lang.value),
    description: i18n('view_home_case_4_desc', lang.value)
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
        <h3>{{ item.title }}</h3>
        <p class="summary">{{ item.description }}</p>
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
  gap: 10px;
  min-height: 100%;
}

.summary {
  flex: 1;
  margin: 0;
  font-size: 14px;
  line-height: 24px;
}

@media (min-width: 768px) {
  .use-cases {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--home-grid-gap-lg);
  }
}
</style>
