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
          class="plan-card home-card home-card--interactive"
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

      <section class="content-section">
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

      <section class="content-section dual-grid">
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

      <section class="content-section dual-grid">
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

      <section class="content-section case-section">
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
          <a class="cta-btn" href="./sponsor.html">{{ t('view_customize_cta_primary') }}</a>
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
@import './customize.css';
</style>
