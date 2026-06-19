<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

import i18n from '../../@i18n'
import Section from './Section.vue'
import UseCaseIllustration from './illustrations/UseCaseIllustration.vue'
import { useInView } from './composables/useInView.js'

const { lang } = useData()
const { target: casesRef, isVisible } = useInView()

const items = computed(() =>
  [1, 2, 3, 4].map(index => ({
    variant: index,
    title: i18n(`view_home_case_${index}_title`, lang.value),
    description: i18n(`view_home_case_${index}_desc`, lang.value)
  }))
)
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
        class="use-case home-card home-card--interactive home-stagger-item"
        :style="{ '--stagger-delay': `${index * 0.07}s` }"
      >
        <div class="use-case-body home-card-body">
          <h3>{{ item.title }}</h3>
          <p class="summary">{{ item.description }}</p>
        </div>
        <div class="illustration-wrap" aria-hidden="true">
          <UseCaseIllustration :variant="item.variant" />
        </div>
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
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 0;
  overflow: hidden;
}

.use-case-body {
  flex: 1;
  min-width: 0;
  justify-content: center;
}

.summary {
  flex: 1;
  margin: 0;
  font-size: 14px;
  line-height: 24px;
}

.illustration-wrap {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 124px;
  padding: 16px;
  overflow: hidden;
}

.illustration-wrap :deep(.use-case-illustration) {
  transition: transform .45s var(--home-ease-out);
}

.use-case:hover .illustration-wrap :deep(.use-case-illustration) {
  transform: scale(1.04);
}

@media (min-width: 768px) {
  .use-cases {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--home-grid-gap-lg);
  }

  .use-case {
    flex-direction: row;
    align-items: stretch;
  }

  .illustration-wrap {
    width: 176px;
    min-width: 176px;
    min-height: 100%;
    padding: 20px 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .illustration-wrap :deep(.use-case-illustration) {
    transition: none;
  }

  .use-case:hover .illustration-wrap :deep(.use-case-illustration) {
    transform: none;
  }
}
</style>
