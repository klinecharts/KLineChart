<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

import i18n from '../../@i18n'
import Section from './Section.vue'

const { lang, isDark } = useData()

const users = computed(() => [
  {
    name: 'TradingX',
    logo: '/images/sponsors/tradingx.png',
    website: 'https://www.tradingx.cloud/',
    invertOnDark: true
  },
  {
    name: 'Northstar',
    logo: '/images/sponsors/Northstar.png',
    website: 'https://northstar.quantit.tech:8443/'
  },
  {
    name: 'flameOnYou',
    logo: '/images/sponsors/flameOnYou.jpg',
    website: 'https://github.com/flameOnYou'
  },
  {
    name: '糊涂',
    logo: '/images/sponsors/hutu.png',
    website: 'https://hutu.live'
  },
  {
    name: '好主机',
    text: '好主机',
    website: 'https://www.haozhuji.net/'
  }
])

const marqueeUsers = computed(() => [...users.value, ...users.value])
</script>

<template>
  <Section
    out-class="users-section"
    :title="i18n('view_home_users_title', lang)"
    :description="i18n('view_home_users_desc', lang)"
  >
    <div class="marquee" role="presentation">
      <div class="track">
        <a
          v-for="(item, index) in marqueeUsers"
          :key="`${item.name}-${index}`"
          class="user"
          :href="item.website"
          target="_blank"
          rel="noreferrer"
        >
          <img
            v-if="item.logo"
            class="logo"
            :class="{ invert: item.invertOnDark && isDark }"
            :src="item.logo"
            :alt="item.name"
          >
          <span v-else class="text">{{ item.text }}</span>
        </a>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.users-section {
  overflow: hidden;
}

.marquee {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 4px 0;
  margin-top: -4px;
  mask-image: linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%);
}

.track {
  display: flex;
  width: max-content;
  gap: 16px;
  animation: marquee 28s linear infinite;
}

.marquee:hover .track {
  animation-play-state: paused;
}

.user {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  height: 72px;
  padding: 0 26px;
  overflow: hidden;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--vp-c-bg-soft) 55%, transparent);
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}

.user::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(110deg, transparent 22%, color-mix(in srgb, #ffffff 10%, transparent) 48%, transparent 72%);
  opacity: 0;
  transform: translateX(-28%);
  transition: opacity .25s ease, transform .45s ease;
  pointer-events: none;
}

.user:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 14%, var(--vp-c-divider));
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.07);
}

.user:hover::after {
  opacity: 1;
  transform: translateX(20%);
}

.logo {
  max-width: 124px;
  max-height: 30px;
  object-fit: contain;
  opacity: 0.9;
  transition: transform .25s ease;
}

.logo.invert {
  filter: invert(1);
}

.user:hover .logo {
  transform: scale(1.03);
}

.text {
  font-size: clamp(16px, 2.4vw, 18px);
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: var(--vp-c-text-1);
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-50% - 8px));
  }
}

@media (min-width: 640px) {
  .track {
    gap: 18px;
  }

  .user {
    min-width: 220px;
    height: 78px;
    padding: 0 30px;
  }

  .logo {
    max-width: 138px;
    max-height: 34px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .track {
    animation: none;
  }

  .user,
  .user::after,
  .logo {
    transition: none;
  }

  .user:hover,
  .user:hover .logo {
    transform: none;
  }

  .user:hover::after {
    opacity: 0;
    transform: none;
  }
}
</style>
