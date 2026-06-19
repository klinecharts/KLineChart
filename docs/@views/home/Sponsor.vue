<script setup>
import { computed, ref } from 'vue'
import { useData } from 'vitepress'

import Section from './Section.vue'
import i18n from '../../@i18n'
import Particle from '../../@components/Particle.vue'

const sponsors = [
  {
    name: 'Northstar',
    logo: '/images/sponsors/Northstar.png',
    website: 'https://northstar.quantit.tech:8443/',
    amount: 1600
  },
  {
    name: 'flameOnYou',
    text: 'flameOnYou',
    logo: '/images/sponsors/flameOnYou.jpg',
    website: 'https://github.com/flameOnYou',
    amount: 2100
  },
  {
    name: '糊涂',
    text: '糊涂',
    logo: '/images/sponsors/hutu.png',
    website: 'https://hutu.live',
    amount: 18.8
  },
  {
    name: '好主机',
    text: '好主机',
    website: 'https://www.haozhuji.net/',
    amount: 88.8
  },
  {
    name: 'flowlong',
    text: 'FlowLong',
    logo: '/images/sponsors/flowlong.svg',
    logoStyle: 'max-height: 40px;max-width: 40px;',
    website: 'https://flowlong.aizuda.com/',
    amount: 500
  },
].sort((a, b) => b.amount - a.amount)

const featuredSponsors = computed(() => sponsors.slice(0, 3))
const supportingSponsors = computed(() => sponsors.slice(3))

const { lang } = useData()
const particle = ref(null)

function showParticle() {
  if (particle.value && particle.value.start) {
    particle.value.start()
  }
}
</script>

<template>
  <Section
    out-class="sponsor-section"
    :title="i18n('view_home_sponsor_title', lang)"
    :description="i18n('view_home_sponsor_desc', lang)"
  >
    <div class="sponsor-shell">
      <div class="intro home-card">
        <span class="eyebrow">
          {{ i18n('view_home_sponsor_eyebrow', lang) }}
        </span>
        <p class="lead">
          {{ i18n('view_home_sponsor_lead', lang) }}
        </p>
        <div class="signal">
          <span class="signal-dot"></span>
          <span>
            {{ i18n('view_home_sponsor_signal', lang) }}
          </span>
        </div>
        <div class="sponsor-become">
          <a target="_blank" rel="noreferrer" href="./sponsor.html" @mouseenter="showParticle">
            <Particle ref="particle">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812T2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.387 2.25t-1.363 2.412t-2.625 2.963T13.45 19.7z"/>
              </svg>
            </Particle>
            {{ i18n('view_home_sponsor_become_sponsor', lang) }}
          </a>
        </div>
      </div>

      <div class="board">
        <div class="featured">
          <a
            v-if="featuredSponsors[0]"
            class="featured-main home-card home-card--interactive home-card--no-lift"
            :href="featuredSponsors[0].website"
            target="_blank"
            rel="noreferrer"
          >
            <span class="tier tier-featured">
              <span class="tier-icon" aria-hidden="true">🥇</span>
              {{ i18n('view_home_sponsor_featured', lang) }}
            </span>
            <div class="featured-logo-text">
              <img class="featured-logo featured-logo-main" :src="featuredSponsors[0].logo" :alt="featuredSponsors[0].name">
              <span v-if="featuredSponsors[0].text" class="featured-text">{{ featuredSponsors[0].text }}</span>
            </div>
          </a>

          <div class="featured-side">
            <a
              v-for="(item, supporterIndex) in featuredSponsors.slice(1)"
              :key="item.name"
              class="featured-sub home-card home-card--interactive home-card--no-lift"
              :href="item.website"
              target="_blank"
              rel="noreferrer"
            >
              <span class="tier tier-supporter">
                <span class="tier-icon" aria-hidden="true">{{ supporterIndex === 0 ? '🥈' : '🥉' }}</span>
                {{ i18n('view_home_sponsor_supporter', lang) }}
              </span>
              <div class="featured-logo-text">
                <img v-if="item.logo" class="featured-logo" :style="item.logoStyle" :src="item.logo" :alt="item.name">
                <span v-if="item.text" class="featured-text">{{ item.text }}</span>
              </div>
            </a>
          </div>
        </div>

        <div v-if="supportingSponsors.length > 0" class="supporting">
          <div class="supporting-head">
            <span>{{ i18n('view_home_sponsor_more', lang) }}</span>
          </div>
          <div class="supporting-grid">
            <a
              v-for="item in supportingSponsors"
              :key="item.name"
              class="supporting-item home-card home-card--interactive home-card--no-lift"
              :href="item.website"
              target="_blank"
              rel="noreferrer"
            >
              <img v-if="item.logo" class="supporting-logo" :src="item.logo" :alt="item.name">
              <span v-else class="supporting-text">{{ item.text || item.name }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.sponsor-section {
  margin-top: 0 !important;
  padding-bottom: 8px;
}

.sponsor-shell {
  position: relative;
  display: grid;
  width: 100%;
  gap: 28px;
}

.intro {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px 24px;
}

.eyebrow {
  display: inline-flex;
  width: fit-content;
  font-size: 14px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--vp-c-text-1);
}

.lead {
  max-width: 34ch;
  font-size: clamp(16px, 2.1vw, 19px);
  line-height: clamp(26px, 3.2vw, 31px);
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.signal {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(14px, 1.7vw, 16px);
  line-height: clamp(22px, 2.7vw, 25px);
  color: var(--vp-c-text-2);
}

.signal-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 8px color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  animation: sponsorPulse 2.8s ease-in-out infinite;
}

.board {
  display: grid;
  gap: 18px;
}

.featured {
  display: grid;
  gap: 18px;
}

.featured-main,
.featured-sub,
.supporting-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-decoration: none;
}

.featured-main {
  min-height: 220px;
  padding: 28px;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
}

.featured-side {
  display: grid;
  gap: 18px;
}

.featured-sub {
  min-height: 128px;
  padding: 22px 24px;
}

.tier {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  margin-bottom: 16px;
  min-height: 32px;
  padding: 4px 12px;
  font-size: 12px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 12%, var(--vp-c-divider));
  background: var(--home-brand-surface-soft);
  color: var(--vp-c-brand-1);
  transition: border-color .25s ease, background-color .25s ease, transform .25s ease;
}

.tier-featured {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 24%, var(--vp-c-divider));
  background: transparent;
}

.tier-icon {
  font-size: 14px;
  line-height: 1;
}

.tier-supporter {
  color: color-mix(in srgb, var(--vp-c-brand-1) 84%, var(--vp-c-text-2));
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 16%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--vp-c-bg-soft) 56%, var(--vp-c-bg));
}

.featured-main:hover .tier-featured,
.featured-sub:hover .tier-supporter {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 28%, var(--vp-c-divider));
}

.featured-logo {
  max-width: 148px;
  max-height: 40px;
  object-fit: contain;
}

.featured-logo-main {
  max-width: 210px;
  max-height: 62px;
}

.featured-logo-text {
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
}

.featured-text {
  font-size: clamp(18px, 2.3vw, 22px);
  line-height: 1.25;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.featured-main .featured-logo-text {
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.supporting {
  display: grid;
  gap: 12px;
}

.supporting-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
  font-size: 12px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

.supporting-grid {
  display: grid;
  gap: 12px;
}

.supporting-item {
  min-height: 72px;
  padding: 0 22px;
  align-items: center;
}

.supporting-logo {
  max-width: 120px;
  max-height: 28px;
  object-fit: contain;
}

.supporting-text {
  font-size: clamp(14px, 1.6vw, 16px);
  line-height: 1;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.sponsor-become {
  display: flex;
  padding-top: 8px;
}

.sponsor-become a {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 9px 20px;
  font-size: clamp(13px, 1.6vw, 15px);
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 28%, var(--vp-c-divider));
  background: var(--home-brand-surface-soft);
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: transform .25s ease, border-color .25s ease, background-color .25s ease;
}

.sponsor-become a svg {
  transition: transform .25s ease;
}

.sponsor-become a:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 44%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-bg));
}

.sponsor-become a:hover svg {
  transform: scale(1.08);
}

@keyframes sponsorPulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
    transform: scale(1);
  }

  50% {
    box-shadow: 0 0 0 10px color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent);
    transform: scale(1.08);
  }
}

@media (min-width: 768px) {
  .supporting-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 960px) {
  .sponsor-shell {
    grid-template-columns: minmax(280px, 0.78fr) minmax(0, 1.22fr);
    align-items: start;
    gap: 26px;
  }

  .intro {
    position: sticky;
    top: 96px;
    min-height: 100%;
  }

  .featured {
    grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
  }

  .featured-side {
    grid-template-rows: repeat(2, minmax(0, 1fr));
  }

  .supporting-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .signal-dot {
    animation: none;
  }

  .tier,
  .sponsor-become a,
  .sponsor-become a svg {
    transition: none;
  }

  .sponsor-become a:hover,
  .sponsor-become a:hover svg {
    transform: none;
  }
}
</style>
