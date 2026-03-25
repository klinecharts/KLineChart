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
          <div v-if="index === 0" class="detail-flow">
            <div v-for="detail in item.details" :key="detail" class="flow-step">
              <span class="flow-dot"></span>
              <p>{{ detail }}</p>
            </div>
          </div>
          <div v-else-if="index === 1" class="detail-bars">
            <div v-for="(detail, detailIndex) in item.details" :key="detail" class="bar-row">
              <div class="bar-head">
                <strong>{{ ['01', '02', '03'][detailIndex] }}</strong>
                <span>{{ detail }}</span>
              </div>
            </div>
          </div>
          <div v-else-if="index === 2" class="detail-grid">
            <div v-for="detail in item.details" :key="detail" class="grid-item">
              <span class="grid-icon"></span>
              <p>{{ detail }}</p>
            </div>
          </div>
          <div v-else class="detail-stack">
            <div v-for="detail in item.details" :key="detail" class="stack-item">
              <span class="stack-line"></span>
              <p>{{ detail }}</p>
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
  gap: 28px;
  padding-top: 8px;
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
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 18px;
  background: color-mix(in srgb, var(--vp-c-bg) 82%, transparent);
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-divider));
}

.metric strong {
  font-size: 22px;
  line-height: 1;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.metric-label {
  font-size: 12px;
  line-height: 18px;
  color: var(--vp-c-text-2);
}

.scenario {
  padding: 16px 18px;
  border-radius: 20px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 5%, transparent);
  border: 1px dashed color-mix(in srgb, var(--vp-c-brand-1) 12%, var(--vp-c-divider));
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
  font-size: 14px;
  line-height: 23px;
  color: var(--vp-c-text-1);
}

.detail-title {
  font-size: 13px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

.detail-flow,
.detail-bars,
.detail-grid,
.detail-stack {
  display: grid;
  gap: 14px;
}

.flow-step,
.stack-item,
.grid-item {
  display: flex;
  gap: 14px;
}

.flow-dot,
.grid-icon {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  margin-top: 7px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}

.flow-step p,
.grid-item p,
.stack-item p {
  font-size: 15px;
  line-height: 24px;
  color: var(--vp-c-text-1);
}

.bar-row {
  display: grid;
  gap: 8px;
}

.bar-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-head span,
.bar-head strong {
  font-size: 14px;
  line-height: 22px;
  color: var(--vp-c-text-1);
}

.bar-head strong {
  color: var(--vp-c-brand-1);
  min-width: 24px;
}


.detail-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-item {
  padding: 16px;
  border-radius: 18px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 4%, transparent);
}

.stack-item {
  position: relative;
  padding-left: 20px;
}

.stack-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--vp-c-brand-1), color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent));
}

.stack-item::before {
  content: '';
  position: absolute;
  top: 7px;
  left: -4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}

@media (min-width: 960px) {
  .advantage {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 34px;
  }
}

.variant-1 .overview {
  padding-left: 28px;
}

.variant-1 .metrics {
  grid-template-columns: repeat(2, minmax(0, 180px));
}

.variant-1 .detail {
  padding: 24px 28px;
  border-radius: 28px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand-1) 3%, transparent), transparent 42%),
    color-mix(in srgb, var(--vp-c-bg-soft) 72%, var(--vp-c-bg));
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 6%, var(--vp-c-divider));
}

.variant-2 .overview {
  padding: 28px;
  border-radius: 32px;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent), transparent 34%),
    linear-gradient(180deg, color-mix(in srgb, var(--vp-c-brand-1) 3%, transparent), transparent 64%),
    color-mix(in srgb, var(--vp-c-bg-soft) 68%, var(--vp-c-bg));
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 6%, var(--vp-c-divider));
}

.variant-2 .metric {
  background: rgba(255, 255, 255, 0.04);
}

.variant-2 .detail {
  padding-top: 8px;
}

.variant-2 .detail-title {
  padding-left: 2px;
}

.variant-2 .bar-row {
  padding: 16px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.variant-3 .overview {
  padding: 24px 0 28px;
}

.variant-3 .metrics {
  grid-template-columns: repeat(2, minmax(0, 160px));
}

.variant-3 .metric {
  padding: 0 0 0 14px;
  border: none;
  border-left: 2px solid color-mix(in srgb, var(--vp-c-brand-1) 36%, transparent);
  border-radius: 0;
  background: transparent;
}

.variant-3 .detail-title {
  padding-bottom: 4px;
}

.variant-3 .grid-item {
  min-height: 90px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 10%, var(--vp-c-divider));
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--vp-c-brand-1) 5%, transparent), transparent 62%),
    var(--vp-code-block-bg);
}

.variant-4 .overview {
  padding: 24px;
  border-radius: 24px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--vp-c-brand-1) 2.5%, transparent), transparent 68%),
    color-mix(in srgb, var(--vp-c-bg-soft) 68%, var(--vp-c-bg));
}

.variant-4 .detail {
  position: relative;
  padding-left: 26px;
}

.variant-4 .detail-title {
  padding-bottom: 4px;
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

  .detail-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (min-width: 960px) {
  .variant-1 {
    grid-template-columns: minmax(0, 1fr) minmax(0, .95fr);
    align-items: start;
  }

  .variant-2 {
    grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr);
    align-items: start;
  }

  .variant-3 {
    grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
    align-items: start;
  }

  .variant-4 {
    grid-template-columns: minmax(0, .92fr) minmax(0, 1.08fr);
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
</style>
