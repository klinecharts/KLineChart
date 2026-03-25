<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

import i18n from '../../@i18n'
import Section from './Section.vue'

const { lang } = useData()

const steps = computed(() => [
  {
    index: '01',
    title: i18n('view_home_workflow_1_title', lang.value),
    description: i18n('view_home_workflow_1_desc', lang.value)
  },
  {
    index: '02',
    title: i18n('view_home_workflow_2_title', lang.value),
    description: i18n('view_home_workflow_2_desc', lang.value)
  },
  {
    index: '03',
    title: i18n('view_home_workflow_3_title', lang.value),
    description: i18n('view_home_workflow_3_desc', lang.value)
  },
  {
    index: '04',
    title: i18n('view_home_workflow_4_title', lang.value),
    description: i18n('view_home_workflow_4_desc', lang.value)
  }
])
</script>

<template>
  <Section
    out-class="workflow-section"
    :title="i18n('view_home_workflow_title', lang)"
    :description="i18n('view_home_workflow_desc', lang)"
  >
    <div class="workflow">
      <article
        v-for="item in steps"
        :key="item.index"
        class="step"
      >
        <span class="step-index">{{ item.index }}</span>
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </article>
    </div>
  </Section>
</template>

<style scoped>
.workflow-section {
  padding-top: 60px;
}

.workflow {
  display: grid;
  width: 100%;
  gap: 14px;
}

.step {
  position: relative;
  padding: 22px 22px 22px 72px;
  border-radius: 24px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent), transparent 45%), var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.step-index {
  position: absolute;
  top: 22px;
  left: 22px;
  font-size: 13px;
  line-height: 1;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.step h3 {
  font-size: 18px;
  line-height: 26px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.step p {
  padding-top: 8px;
  font-size: 14px;
  line-height: 23px;
  color: var(--vp-c-text-2);
}

@media (min-width: 768px) {
  .workflow {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 640px) {
  .workflow-section {
    padding-top: 126px;
  }
}
</style>
