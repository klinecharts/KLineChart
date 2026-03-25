<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

import i18n from '../../@i18n'
import Section from './Section.vue'

const { lang } = useData()

const capabilities = computed(() => [
  {
    title: i18n('view_home_capability_1_title', lang.value),
    description: i18n('view_home_capability_1_desc', lang.value),
    points: [
      i18n('view_home_capability_1_point_1', lang.value),
      i18n('view_home_capability_1_point_2', lang.value),
      i18n('view_home_capability_1_point_3', lang.value)
    ]
  },
  {
    title: i18n('view_home_capability_2_title', lang.value),
    description: i18n('view_home_capability_2_desc', lang.value),
    points: [
      i18n('view_home_capability_2_point_1', lang.value),
      i18n('view_home_capability_2_point_2', lang.value),
      i18n('view_home_capability_2_point_3', lang.value)
    ]
  },
  {
    title: i18n('view_home_capability_3_title', lang.value),
    description: i18n('view_home_capability_3_desc', lang.value),
    points: [
      i18n('view_home_capability_3_point_1', lang.value),
      i18n('view_home_capability_3_point_2', lang.value),
      i18n('view_home_capability_3_point_3', lang.value)
    ]
  }
])
</script>

<template>
  <Section
    :title="i18n('view_home_capability_title', lang)"
    :description="i18n('view_home_capability_desc', lang)"
  >
    <div class="matrix">
      <article
        v-for="item in capabilities"
        :key="item.title"
        class="capability"
      >
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
        <ul>
          <li v-for="point in item.points" :key="point">{{ point }}</li>
        </ul>
      </article>
    </div>
  </Section>
</template>

<style scoped>
.matrix {
  display: grid;
  width: 100%;
  gap: 18px;
}

.capability {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 100%;
  padding: 18px 0 22px;
  border-bottom: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 10%, var(--vp-c-divider));
  min-height: 100%;
}

.capability h3 {
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.capability p {
  font-size: 15px;
  line-height: 24px;
  color: var(--vp-c-text-2);
}

.capability ul {
  display: grid;
  gap: 10px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.capability li {
  position: relative;
  padding-left: 16px;
  font-size: 14px;
  line-height: 22px;
  color: var(--vp-c-text-1);
}

.capability li::before {
  content: '';
  position: absolute;
  top: 9px;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}

@media (min-width: 768px) {
  .matrix {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 26px;
  }

  .capability {
    padding-right: 12px;
    border-bottom: none;
  }
}
</style>
