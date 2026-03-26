<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

import i18n from '../../@i18n'
import Section from './Section.vue'

const { lang } = useData()

const items = computed(() => [
  {
    title: i18n('view_home_advantage_1_title', lang.value),
    description: i18n('view_home_advantage_1_desc', lang.value),
    note: i18n('view_home_advantage_1_note', lang.value),
    detailLead: i18n('view_home_advantage_1_detail_lead', lang.value),
    metrics: [
      {
        value: i18n('view_home_advantage_1_metric_1_value', lang.value),
        label: i18n('view_home_advantage_1_metric_1_label', lang.value)
      },
      {
        value: i18n('view_home_advantage_1_metric_2_value', lang.value),
        label: i18n('view_home_advantage_1_metric_2_label', lang.value)
      }
    ],
    scenario: i18n('view_home_advantage_1_scenario', lang.value),
    details: [
      i18n('view_home_advantage_1_point_1', lang.value),
      i18n('view_home_advantage_1_point_2', lang.value),
      i18n('view_home_advantage_1_point_3', lang.value)
    ]
  },
  {
    title: i18n('view_home_advantage_2_title', lang.value),
    description: i18n('view_home_advantage_2_desc', lang.value),
    note: i18n('view_home_advantage_2_note', lang.value),
    detailLead: i18n('view_home_advantage_2_detail_lead', lang.value),
    metrics: [
      {
        value: i18n('view_home_advantage_2_metric_1_value', lang.value),
        label: i18n('view_home_advantage_2_metric_1_label', lang.value)
      },
      {
        value: i18n('view_home_advantage_2_metric_2_value', lang.value),
        label: i18n('view_home_advantage_2_metric_2_label', lang.value)
      }
    ],
    scenario: i18n('view_home_advantage_2_scenario', lang.value),
    details: [
      i18n('view_home_advantage_2_point_1', lang.value),
      i18n('view_home_advantage_2_point_2', lang.value),
      i18n('view_home_advantage_2_point_3', lang.value)
    ]
  },
  {
    title: i18n('view_home_advantage_3_title', lang.value),
    description: i18n('view_home_advantage_3_desc', lang.value),
    note: i18n('view_home_advantage_3_note', lang.value),
    detailLead: i18n('view_home_advantage_3_detail_lead', lang.value),
    metrics: [
      {
        value: i18n('view_home_advantage_3_metric_1_value', lang.value),
        label: i18n('view_home_advantage_3_metric_1_label', lang.value)
      },
      {
        value: i18n('view_home_advantage_3_metric_2_value', lang.value),
        label: i18n('view_home_advantage_3_metric_2_label', lang.value)
      }
    ],
    scenario: i18n('view_home_advantage_3_scenario', lang.value),
    details: [
      i18n('view_home_advantage_3_point_1', lang.value),
      i18n('view_home_advantage_3_point_2', lang.value),
      i18n('view_home_advantage_3_point_3', lang.value)
    ]
  },
  {
    title: i18n('view_home_advantage_4_title', lang.value),
    description: i18n('view_home_advantage_4_desc', lang.value),
    note: i18n('view_home_advantage_4_note', lang.value),
    detailLead: i18n('view_home_advantage_4_detail_lead', lang.value),
    metrics: [
      {
        value: i18n('view_home_advantage_4_metric_1_value', lang.value),
        label: i18n('view_home_advantage_4_metric_1_label', lang.value)
      },
      {
        value: i18n('view_home_advantage_4_metric_2_value', lang.value),
        label: i18n('view_home_advantage_4_metric_2_label', lang.value)
      }
    ],
    scenario: i18n('view_home_advantage_4_scenario', lang.value),
    details: [
      i18n('view_home_advantage_4_point_1', lang.value),
      i18n('view_home_advantage_4_point_2', lang.value),
      i18n('view_home_advantage_4_point_3', lang.value)
    ]
  }
])
</script>

<template>
  <div class="advantages">
    <Section
      v-for="(item, index) in items"
      :key="item.title"
      out-class="advantage-section"
      :title="item.title"
      :description="item.description"
    >
      <article class="advantage" :class="[`variant-${index + 1}`, { reverse: index % 2 === 1 }]">
        <div class="panel overview">
          <div class="metrics" :class="`metrics-${index + 1}`">
            <div v-for="(metric, metricIndex) in item.metrics" :key="metric.label" class="metric">
              <strong>{{ metric.value }}</strong>
              <span class="metric-label">{{ metric.label }}</span>
            </div>
          </div>
          <div class="scenario">
            <span class="scenario-label">{{ i18n('view_home_advantage_scenario_title', lang) }}</span>
            <p>{{ item.scenario }}</p>
          </div>
        </div>
        <div class="panel detail">
          <div class="detail-title">{{ i18n('view_home_advantage_detail_title', lang) }}</div>
          <div class="detail-bars">
            <div v-for="(detail, detailIndex) in item.details" :key="detail" class="bar-row">
              <div class="bar-head">
                <strong>{{ ['01', '02', '03'][detailIndex] }}</strong>
                <span>{{ detail }}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Section>
  </div>
</template>

<style scoped>
.advantages {
  width: 100%;
}

.advantage {
  display: grid;
  width: 100%;
  gap: 28px;
  padding-top: 0;
  opacity: 0;
  transform: translateY(22px);
  animation: advantageReveal .7s ease forwards;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 100%;
  padding: 0;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 18px;
  background: color-mix(in srgb, var(--vp-c-bg) 82%, transparent);
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-divider));
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}

.metric strong {
  font-size: 21px;
  line-height: 1;
  font-weight: 700;
  color: var(--vp-c-text-1);
  transition: transform .25s ease, color .25s ease;
}

.metric-label {
  font-size: 12px;
  line-height: 18px;
  color: var(--vp-c-text-2);
}

.scenario {
  position: relative;
  overflow: hidden;
  padding: 16px 18px;
  border-radius: 20px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 5%, transparent);
  border: 1px dashed color-mix(in srgb, var(--vp-c-brand-1) 12%, var(--vp-c-divider));
  transition: transform .25s ease, border-color .25s ease, background-color .25s ease;
}

.scenario::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 22%, color-mix(in srgb, #ffffff 8%, transparent) 48%, transparent 72%);
  opacity: 0;
  transform: translateX(-28%);
  transition: opacity .25s ease, transform .45s ease;
  pointer-events: none;
}

.scenario-label {
  display: block;
  font-size: 12px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}

.scenario p {
  padding-top: 10px;
  font-size: clamp(14px, 1.6vw, 15px);
  line-height: clamp(22px, 2.7vw, 24px);
  color: var(--vp-c-text-1);
}

.detail-title {
  font-size: 12px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  padding-left: 2px;
}

.detail-bars {
  display: grid;
  gap: 0;
}

.bar-row {
  display: grid;
  gap: 8px;
  padding: 16px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: border-color .25s ease, transform .25s ease;
}

.bar-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-head span {
  transition: color .25s ease;
}

.bar-head span,
.bar-head strong {
  font-size: clamp(14px, 1.6vw, 15px);
  line-height: clamp(22px, 2.7vw, 24px);
  color: var(--vp-c-text-1);
}

.bar-head strong {
  color: var(--vp-c-brand-1);
  min-width: 24px;
  transition: transform .25s ease, color .25s ease;
}


.detail-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.advantage:hover .metric {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 18%, var(--vp-c-divider));
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.04);
}

.advantage:hover .metric strong {
  transform: translateY(-1px);
  color: var(--vp-c-brand-1);
}

.advantage:hover .scenario {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 20%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--vp-c-brand-1) 7%, transparent);
}

.advantage:hover .scenario::after {
  opacity: 1;
  transform: translateX(18%);
}

.bar-row:hover {
  transform: translateX(4px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 18%, var(--vp-c-divider));
}

.bar-row:hover .bar-head strong {
  transform: scale(1.08);
}

.bar-row:hover .bar-head span {
  color: var(--vp-c-text-1);
}

.advantage:nth-child(1) {
  animation-delay: .04s;
}

.advantage:nth-child(2) {
  animation-delay: .1s;
}

.advantage:nth-child(3) {
  animation-delay: .16s;
}

.advantage:nth-child(4) {
  animation-delay: .22s;
}

@keyframes advantageReveal {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 960px) {
  .advantage {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 34px;
  }
}

.detail {
  gap: 0;
  margin-top: 0;
  padding-top: 0;
}

@media (min-width: 640px) {
  :deep(.advantage-section) {
    padding-top: 126px;
  }
}

@media (max-width: 639px) {
  .metrics {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (min-width: 960px) {
  .variant-1,
  .variant-2,
  .variant-3,
  .variant-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  .variant-1 .overview,
  .variant-2 .overview,
  .variant-3 .overview,
  .variant-4 .overview {
    position: sticky;
    top: calc(var(--vp-nav-height) + 24px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .metric,
  .scenario,
  .scenario::after,
  .metric strong,
  .bar-row,
  .bar-head span,
  .bar-head strong {
    transition: none;
  }

  .advantage {
    opacity: 1;
    transform: none;
    animation: none;
  }

  .advantage:hover .metric,
  .advantage:hover .scenario {
    transform: none;
    box-shadow: none;
  }

  .advantage:hover .metric strong,
  .bar-row:hover,
  .bar-row:hover .bar-head strong {
    transform: none;
  }

  .advantage:hover .scenario::after {
    opacity: 0;
    transform: none;
  }
}

:global(html:not(.dark)) .advantage:hover .metric {
  box-shadow:
    0 20px 42px color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent),
    0 12px 24px rgba(15, 23, 42, 0.12);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 30%, var(--vp-c-divider));
}

:global(html:not(.dark)) .advantage:hover .scenario {
  box-shadow:
    0 18px 36px color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent),
    0 10px 22px rgba(15, 23, 42, 0.1);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 26%, var(--vp-c-divider));
}
</style>
