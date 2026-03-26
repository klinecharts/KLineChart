<template>
  <section class="customize-page">
    <div class="customize-shell">
      <header class="customize-hero">
        <h1 class="customize-title">{{ t('view_customize_title') }}</h1>
        <p class="customize-subtitle">{{ t('view_customize_subtitle') }}</p>
      </header>

      <div class="customize-grid">
        <article
          v-for="plan in plans"
          :key="plan.key"
          class="plan-card"
          :class="`plan-card-${plan.key}`"
        >
          <div class="plan-head">
            <div class="plan-title-row">
              <h2 class="plan-title">{{ plan.title }}</h2>
              <span v-if="plan.badge" class="plan-badge">{{ plan.badge }}</span>
            </div>
            <p class="plan-desc">{{ plan.description }}</p>
            <p class="plan-price">{{ plan.price }}</p>
          </div>
          <FeatureList class="plan-features" :features="plan.features"/>
          <p class="plan-tip">{{ plan.tip }}</p>
        </article>
      </div>

      <section class="content-section">
        <header class="section-head">
          <h2>{{ t('view_customize_compare_title') }}</h2>
          <p>{{ t('view_customize_compare_desc') }}</p>
        </header>
        <div class="compare-wrap">
          <table class="compare-table">
            <thead>
              <tr>
                <th>{{ t('view_customize_compare_col_item') }}</th>
                <th>{{ t('view_customize_free_title') }}</th>
                <th>{{ t('view_customize_sponsor_title') }}</th>
                <th>{{ t('view_customize_custom_title') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in compareRows" :key="row.label">
                <th>{{ row.label }}</th>
                <td>{{ row.free }}</td>
                <td>{{ row.sponsor }}</td>
                <td>{{ row.custom }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="content-section scoped-section">
        <header class="section-head">
          <div class="section-title-row">
            <h2>{{ t('view_customize_flow_title') }}</h2>
            <span class="scope-badge">{{ t('view_customize_custom_only_badge') }}</span>
          </div>
          <p>{{ t('view_customize_flow_desc') }}</p>
        </header>
        <ol class="flow-list">
          <li v-for="(step, index) in flowSteps" :key="step.title" class="flow-item">
            <span class="flow-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.note }}</p>
            </div>
          </li>
        </ol>
      </section>

      <section class="content-section dual-grid scoped-section service-grid">
        <article class="panel-card">
          <header class="section-head">
            <div class="section-title-row">
              <h2>{{ t('view_customize_deliverables_title') }}</h2>
              <span class="scope-badge">{{ t('view_customize_custom_only_badge') }}</span>
            </div>
            <p>{{ t('view_customize_deliverables_desc') }}</p>
          </header>
          <FeatureList class="panel-features" :features="deliverables"/>
        </article>

        <article class="panel-card">
          <header class="section-head">
            <div class="section-title-row">
              <h2>{{ t('view_customize_sla_title') }}</h2>
              <span class="scope-badge">{{ t('view_customize_custom_only_badge') }}</span>
            </div>
            <p>{{ t('view_customize_sla_desc') }}</p>
          </header>
          <ul class="sla-list">
            <li v-for="item in slaItems" :key="item">{{ item }}</li>
          </ul>
        </article>
      </section>

      <section class="content-section dual-grid scoped-section service-grid">
        <article class="panel-card">
          <header class="section-head">
            <div class="section-title-row">
              <h2>{{ t('view_customize_fit_title') }}</h2>
              <span class="scope-badge">{{ t('view_customize_custom_only_badge') }}</span>
            </div>
            <p>{{ t('view_customize_fit_desc') }}</p>
          </header>
          <div class="fit-columns">
            <div class="fit-column">
              <h3>{{ t('view_customize_fit_yes_title') }}</h3>
              <FeatureList class="panel-features" :features="fitYes"/>
            </div>
            <div class="fit-column fit-column-warn">
              <h3>{{ t('view_customize_fit_no_title') }}</h3>
              <FeatureList class="panel-features" :features="fitNo"/>
            </div>
          </div>
        </article>

        <article class="panel-card">
          <header class="section-head">
            <div class="section-title-row">
              <h2>{{ t('view_customize_faq_title') }}</h2>
              <span class="scope-badge">{{ t('view_customize_custom_only_badge') }}</span>
            </div>
            <p>{{ t('view_customize_faq_desc') }}</p>
          </header>
          <div class="faq-list">
            <details v-for="item in faqItems" :key="item.q" class="faq-item">
              <summary>{{ item.q }}</summary>
              <p>{{ item.a }}</p>
            </details>
          </div>
        </article>
      </section>

      <section class="content-section">
        <header class="section-head">
          <h2>{{ t('view_customize_case_title') }}</h2>
          <p>{{ t('view_customize_case_desc') }}</p>
        </header>
        <div class="case-grid">
          <article v-for="item in caseItems" :key="item.title" class="case-card">
            <h3>{{ item.title }}</h3>
            <p class="case-desc">{{ item.desc }}</p>
            <p class="case-result">{{ item.result }}</p>
          </article>
        </div>
      </section>

      <section class="content-section cta-section">
        <header class="section-head">
          <h2>{{ t('view_customize_cta_title') }}</h2>
          <p>{{ t('view_customize_cta_desc') }}</p>
        </header>
        <div class="cta-actions">
          <a class="cta-btn cta-btn-primary" href="./sponsor.html">{{ t('view_customize_cta_primary') }}</a>
          <a class="cta-btn" href="./guide/feedback.html">{{ t('view_customize_cta_secondary') }}</a>
          <a class="cta-btn" href="https://github.com/klinecharts/KLineChart/issues" target="_blank" rel="noreferrer">{{ t('view_customize_cta_tertiary') }}</a>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

import i18n from '../../@i18n'

import FeatureList from './FeatureList.vue'

const { lang } = useData()

const t = key => i18n(key, lang.value)

const plans = computed(() => [
  {
    key: 'free',
    title: t('view_customize_free_title'),
    description: t('view_customize_free_desc'),
    price: t('view_customize_free_price'),
    features: t('view_customize_free_features'),
    tip: t('view_customize_free_tip')
  },
  {
    key: 'sponsor',
    title: t('view_customize_sponsor_title'),
    description: t('view_customize_sponsor_desc'),
    price: t('view_customize_sponsor_price'),
    features: t('view_customize_sponsor_features'),
    tip: t('view_customize_sponsor_tip')
  },
  {
    key: 'custom',
    title: t('view_customize_custom_title'),
    description: t('view_customize_custom_desc'),
    price: t('view_customize_custom_price'),
    features: t('view_customize_custom_features'),
    tip: t('view_customize_custom_tip')
  }
])

const flowSteps = computed(() => {
  const titles = t('view_customize_flow_steps')
  const notes = t('view_customize_flow_notes')
  return titles.map((title, index) => ({ title, note: notes[index] }))
})

const deliverables = computed(() => t('view_customize_deliverables_items'))
const slaItems = computed(() => t('view_customize_sla_items'))
const caseItems = computed(() => t('view_customize_case_items'))
const fitYes = computed(() => t('view_customize_fit_yes_items'))
const fitNo = computed(() => t('view_customize_fit_no_items'))
const faqItems = computed(() => t('view_customize_faq_items'))
const compareRows = computed(() => t('view_customize_compare_rows'))
</script>

<style scoped>
.customize-page {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 72px 24px 108px;
}

.customize-shell {
  --block-gap: 24px;
  width: 100%;
  max-width: 1152px;
  display: grid;
  gap: var(--block-gap);
}

.customize-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.customize-title {
  font-size: clamp(30px, 5.8vw, 44px);
  line-height: clamp(40px, 7vw, 52px);
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.customize-subtitle {
  max-width: 40ch;
  font-size: clamp(15px, 1.9vw, 17px);
  line-height: clamp(24px, 2.7vw, 27px);
  text-align: center;
  color: var(--vp-c-text-2);
}

.customize-grid {
  display: grid;
  gap: 18px;
}

.plan-card,
.panel-card,
.case-card,
.content-section {
  position: relative;
  border-radius: 24px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-divider));
  background:
    linear-gradient(170deg, color-mix(in srgb, var(--vp-c-brand-1) 4%, transparent), transparent 44%),
    color-mix(in srgb, var(--vp-c-bg-soft) 56%, var(--vp-c-bg));
}

.plan-card,
.panel-card,
.case-card {
  overflow: hidden;
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}

.plan-card {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
}

.plan-card::after,
.panel-card::after,
.case-card::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(118deg, transparent 22%, color-mix(in srgb, #ffffff 8%, transparent) 48%, transparent 74%);
  opacity: 0;
  transform: translateX(-28%);
  transition: opacity .25s ease, transform .45s ease;
}

.plan-card:hover,
.panel-card:hover,
.case-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 20%, var(--vp-c-divider));
}

.plan-card:hover::after,
.panel-card:hover::after,
.case-card:hover::after {
  opacity: 1;
  transform: translateX(16%);
}

.plan-head {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px 22px 18px;
}

.plan-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 32px;
}

.plan-title {
  font-size: clamp(22px, 2.2vw, 24px);
  line-height: clamp(30px, 3vw, 32px);
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.plan-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 16%, transparent);
}

.plan-desc {
  font-size: 14px;
  line-height: 22px;
  color: var(--vp-c-text-2);
  min-height: 44px;
  overflow-wrap: anywhere;
}

.plan-price {
  padding-top: 4px;
  font-size: clamp(31px, 3.6vw, 38px);
  line-height: 1.1;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.plan-features {
  margin-top: 2px;
  min-height: 0;
  padding: 0 22px 22px;
}

.plan-features :deep(li span:last-child) {
  overflow-wrap: anywhere;
}

.plan-tip {
  display: flex;
  align-items: center;
  padding: 16px 22px;
  font-size: 13px;
  line-height: 20px;
  min-height: 72px;
  overflow-wrap: anywhere;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  background: color-mix(in srgb, var(--vp-c-brand-1) 4%, transparent);
}

.content-section {
  padding: 22px;
}

.section-head {
  display: grid;
  gap: 8px;
}

.section-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.section-head h2 {
  font-size: clamp(22px, 3.2vw, 28px);
  line-height: 1.25;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.section-head p {
  font-size: 14px;
  line-height: 23px;
  color: var(--vp-c-text-2);
}

.scope-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 24%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}

.flow-list {
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.flow-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 82%, transparent);
}

.flow-index {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent);
}

.flow-item h3 {
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.flow-item p {
  font-size: 14px;
  line-height: 22px;
  color: var(--vp-c-text-2);
}

.dual-grid {
  display: grid;
  gap: var(--block-gap);
  border: none;
  background: transparent;
}

.service-grid {
  padding: 0;
}

.panel-card {
  padding: 20px;
}

.panel-features {
  margin-top: 16px;
}

.panel-features :deep(li) {
  min-width: 0;
}

.panel-features :deep(li span:last-child) {
  word-break: break-word;
}

.sla-list {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sla-list li {
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  line-height: 1;
  color: var(--vp-c-text-1);
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 16%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent);
}

.case-grid {
  display: grid;
  gap: 14px;
  margin-top: 16px;
}

.case-card {
  display: flex;
  flex-direction: column;
  padding: 18px;
}

.case-card h3 {
  font-size: 18px;
  line-height: 26px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.case-desc {
  padding-top: 8px;
  font-size: 14px;
  line-height: 23px;
  color: var(--vp-c-text-2);
  flex: 1;
}

.case-result {
  padding-top: 12px;
  font-size: 13px;
  line-height: 21px;
  color: var(--vp-c-brand-1);
}

.fit-columns {
  display: grid;
  gap: 16px;
  margin-top: 16px;
}

.fit-column h3 {
  font-size: 15px;
  line-height: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.fit-column-warn h3 {
  color: color-mix(in srgb, var(--vp-c-brand-1) 80%, var(--vp-c-text-1));
}

.faq-list {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}

.faq-item {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 10px 12px;
  background: color-mix(in srgb, var(--vp-c-bg) 82%, transparent);
}

.faq-item summary {
  cursor: pointer;
  list-style: none;
  font-size: 14px;
  line-height: 22px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item p {
  margin-top: 8px;
  font-size: 13px;
  line-height: 21px;
  color: var(--vp-c-text-2);
}

.compare-wrap {
  margin-top: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  overflow: auto;
  background: color-mix(in srgb, var(--vp-c-bg) 82%, transparent);
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 0;
}

.compare-table th,
.compare-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 13px;
  line-height: 20px;
  text-align: left;
}

.compare-table thead th {
  font-size: 12px;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.compare-table tbody th {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.cta-section {
  display: grid;
  gap: 16px;
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  font-size: 13px;
  line-height: 1;
  font-weight: 600;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: transform .25s ease, border-color .25s ease, background-color .25s ease;
}

.cta-btn:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 24%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent);
}

.cta-btn-primary {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 26%, var(--vp-c-divider));
  color: color-mix(in srgb, var(--vp-c-brand-1) 82%, var(--vp-c-text-1));
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}

@media (max-width: 767px) {
  .customize-page {
    padding: 56px 16px 84px;
  }

  .customize-shell {
    --block-gap: 18px;
  }

  .content-section {
    padding: 16px;
    border-radius: 18px;
  }

  .panel-card,
  .case-card,
  .plan-card {
    border-radius: 18px;
  }

  .panel-card,
  .case-card {
    padding: 16px;
  }

  .dual-grid {
    padding: 0;
  }

  .plan-head {
    padding: 18px 16px 14px;
  }

  .plan-features {
    padding: 0 16px 16px;
  }

  .plan-tip {
    padding: 12px 16px;
    min-height: 0;
  }

  .compare-table th,
  .compare-table td {
    padding: 10px 9px;
    font-size: 12px;
    line-height: 18px;
  }

  .cta-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .cta-btn {
    width: 100%;
  }
}

@media (min-width: 768px) {
  .customize-page {
    padding-left: 36px;
    padding-right: 36px;
  }

  .customize-grid,
  .case-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  .plan-card-custom,
  .content-section {
    grid-column: 1 / -1;
  }

  .dual-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .compare-table {
    min-width: 680px;
  }
}

@media (min-width: 960px) {
  .customize-page {
    padding-top: 92px;
    padding-bottom: 116px;
  }

  .customize-shell {
    --block-gap: 24px;
  }

  .customize-grid,
  .case-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }

  .plan-card-custom {
    grid-column: auto;
  }

  .content-section,
  .dual-grid {
    grid-column: 1 / -1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .plan-card,
  .panel-card,
  .case-card,
  .plan-card::after,
  .panel-card::after,
  .case-card::after,
  .cta-btn {
    transition: none;
  }

  .plan-card:hover,
  .panel-card:hover,
  .case-card:hover,
  .cta-btn:hover {
    transform: none;
  }

  .plan-card:hover::after,
  .panel-card:hover::after,
  .case-card:hover::after {
    opacity: 0;
    transform: none;
  }
}

:global(html:not(.dark)) .plan-card:hover,
:global(html:not(.dark)) .panel-card:hover,
:global(html:not(.dark)) .case-card:hover {
  box-shadow:
    0 20px 40px color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent),
    0 12px 24px rgba(15, 23, 42, 0.1);
}
</style>
