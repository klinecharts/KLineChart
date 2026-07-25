<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

import i18n from '../../@i18n'
import Section from './Section.vue'
import { useInView } from './composables/useInView.js'

const { lang } = useData()
const { target: ecosystemRef, isVisible } = useInView()

const projects = computed(() => [
  {
    name: 'KLineChart Pro',
    type: i18n('view_home_ecosystem_pro_type', lang.value),
    description: i18n('view_home_ecosystem_pro_desc', lang.value),
    link: lang.value === 'en-US' ? 'https://pro.klinecharts.com/en-US' : 'https://pro.klinecharts.com',
    mark: 'PRO'
  },
  {
    name: 'Extension',
    type: i18n('view_home_ecosystem_extension_type', lang.value),
    description: i18n('view_home_ecosystem_extension_desc', lang.value),
    link: 'https://github.com/klinecharts/extension',
    mark: 'EX'
  },
  {
    name: 'Data Aggregator',
    type: i18n('view_home_ecosystem_aggregator_type', lang.value),
    description: i18n('view_home_ecosystem_aggregator_desc', lang.value),
    link: 'https://github.com/klinecharts/data-aggregator',
    mark: 'DA'
  }
])
</script>

<template>
  <Section
    out-class="ecosystem-section"
    :title="i18n('view_home_ecosystem_title', lang)"
    :description="i18n('view_home_ecosystem_desc', lang)"
  >
    <div ref="ecosystemRef" class="projects home-stagger" :class="{ 'is-visible': isVisible }">
      <a
        v-for="(project, index) in projects"
        :key="project.name"
        class="project home-card home-card--link home-stagger-item"
        :href="project.link"
        target="_blank"
        rel="noopener noreferrer"
        :style="{ '--stagger-delay': `${index * 0.07}s` }"
      >
        <span class="mark" aria-hidden="true">{{ project.mark }}</span>
        <span class="project-content">
          <span class="type">{{ project.type }}</span>
          <h3>{{ project.name }}</h3>
          <span class="summary">{{ project.description }}</span>
          <span class="action">
            {{ i18n('view_home_ecosystem_action', lang) }}
            <svg viewBox="0 0 1024 1024" aria-hidden="true">
              <path d="M869.76 533.333333a32 32 0 0 0-32 32v260.906667A26.88 26.88 0 0 1 810.666667 853.333333H197.76A26.666667 26.666667 0 0 1 170.666667 826.24V213.333333a26.88 26.88 0 0 1 27.093333-27.093333h264.746667a32 32 0 0 0 0-64H197.76A90.88 90.88 0 0 0 106.666667 213.333333v612.906667A90.88 90.88 0 0 0 197.76 917.333333H810.666667a90.88 90.88 0 0 0 90.666666-90.666666V565.546667A32.213333 32.213333 0 0 0 869.76 533.333333zM860.8 88.106667H704a32 32 0 0 0 0 64h121.813333l-322.133333 322.986666a32.213333 32.213333 0 0 0 0 45.226667 32.64 32.64 0 0 0 22.613333 9.386667 31.786667 31.786667 0 0 0 22.613334-9.386667L871.893333 197.333333V320a32 32 0 0 0 64 0V163.2a75.306667 75.306667 0 0 0-75.093333-75.093333z" />
            </svg>
          </span>
        </span>
      </a>
    </div>
  </Section>
</template>

<style scoped>
.projects {
  display: grid;
  width: 100%;
  gap: var(--home-grid-gap);
}

.project {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  min-width: 0;
  padding: 22px;
  color: inherit;
  text-decoration: none;
}

.mark {
  display: grid;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 28%, var(--vp-c-divider));
  border-radius: 14px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, var(--vp-c-bg));
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: .06em;
}

.project-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.type {
  margin-bottom: 5px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.summary {
  min-height: 44px;
  margin-top: 8px;
}

.action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 18px;
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 600;
}

.action svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

@media (min-width: 760px) {
  .projects {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--home-grid-gap-lg);
  }
}

@media (min-width: 960px) {
  .projects {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 420px) {
  .project {
    gap: 14px;
  }

  .mark {
    flex-basis: 42px;
    width: 42px;
    height: 42px;
  }
}
</style>
