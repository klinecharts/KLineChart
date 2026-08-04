<script setup>
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'

import i18n from '../../@i18n'
import { useInView } from './composables/useInView.js'
import Section from './Section.vue'

const { lang, isDark } = useData()
const { target: casesRef, isVisible } = useInView()

const items = computed(() =>
  [1, 2, 3, 4].map((index) => ({
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
        class="use-case home-card home-stagger-item"
        :style="{ '--stagger-delay': `${index * 0.07}s` }"
      >
        <div class="illustration-wrap" aria-hidden="true">
          <img
            class="illustration"
            :src="withBase(`/images/use-cases/use-case-${item.variant}-${isDark ? 'dark' : 'light'}.png`)"
            :alt="''"
            width="160"
            height="120"
            loading="lazy"
          >
        </div>
        <div class="use-case-body home-card-body">
          <h3>{{ item.title }}</h3>
          <p class="summary">{{ item.description }}</p>
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
  padding: 22px;
  overflow: hidden;
}

.use-case-body {
  flex: 1;
  min-width: 0;
  padding: 22px 0 0;
}

.summary {
  flex: 1;
  margin: 0;
  font-size: 14px;
  line-height: 24px;
}

.illustration-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 124px;
  padding: 0;
  overflow: hidden;
}

.illustration {
  display: block;
  width: 100%;
  max-width: 160px;
  height: 100%;
  object-fit: contain;
}

@media (min-width: 768px) {
  .use-cases {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--home-grid-gap-lg);
  }

  .illustration-wrap {
    height: 140px;
  }

  .illustration {
    max-width: 180px;
  }
}

@media (min-width: 960px) {
  .use-cases {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .illustration-wrap {
    height: 150px;
  }

  .illustration {
    max-width: 200px;
  }
}
</style>
