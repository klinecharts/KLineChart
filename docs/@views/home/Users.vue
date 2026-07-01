<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

import i18n from '../../@i18n'
import Section from './Section.vue'

const { lang } = useData()

const userLogos = {
  pandaai: '/images/users/pandaai.png',
  dolphindb: '/images/users/dolphindb.svg',
  fmz: '/images/users/fmz.svg',
  northstar: '/images/users/Northstar.png',
  ths: '/images/users/ths.png'
}

const users = computed(() => [
  {
    name: '同花顺',
    logo: userLogos.ths,
    website: 'https://www.10jqka.com.cn/'
  },
  {
    name: 'PandaAI',
    logo: userLogos.pandaai,
    website: 'https://www.pandaai.online/',
    showName: true
  },
  {
    name: 'DolphinDB',
    logo: userLogos.dolphindb,
    website: 'https://dolphindb.cn/'
  },
  {
    name: 'FMZ',
    logo: userLogos.fmz,
    website: 'https://www.fmz.com/'
  },
  {
    name: 'Northstar',
    logo: userLogos.northstar,
    website: 'https://northstar.quantit.tech:8443/#/welcome?v=8.10.0'
  }
])

const marqueeUsers = computed(() => [...users.value, ...users.value, ...users.value])
</script>

<template>
  <Section
    out-class="users-section"
    :title="i18n('view_home_users_title', lang)"
    :description="i18n('view_home_users_desc', lang)"
  >
    <div class="marquee-shell">
      <div class="marquee" role="presentation">
        <div class="track">
          <a
            v-for="(item, index) in marqueeUsers"
            :key="`${item.name}-${index}`"
            class="user-item"
            :href="item.website"
            target="_blank"
            rel="noreferrer"
          >
            <img
              v-if="item.logo"
              class="logo"
              :src="item.logo"
              :alt="item.name"
            >
            <span v-if="item.showName" class="name">{{ item.name }}</span>
          </a>
        </div>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.users-section {
  overflow: hidden;
}

.marquee-shell {
  position: relative;
  width: 100%;
  padding: 8px 0 4px;
}

.marquee-shell::before,
.marquee-shell::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 72px;
  z-index: 1;
  pointer-events: none;
}

.marquee-shell::before {
  left: 0;
  background: linear-gradient(90deg, var(--vp-c-bg), transparent);
}

.marquee-shell::after {
  right: 0;
  background: linear-gradient(270deg, var(--vp-c-bg), transparent);
}

.marquee {
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%);
}

.track {
  display: flex;
  align-items: center;
  width: max-content;
  gap: 32px;
  animation: marquee 36s linear infinite;
}

.marquee:hover .track {
  animation-play-state: paused;
}

.user-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 148px;
  padding: 12px 16px;
  text-decoration: none;
}

.logo {
  height: 30px;
  object-fit: contain;
  opacity: 0.82;
  filter: grayscale(1);
  transition: filter .25s ease, opacity .25s ease;
}

.name {
  font-size: 15px;
  line-height: 1.2;
  font-weight: 700;
  color: var(--vp-c-text-2);
  transition: color .25s ease;
}

.user-item:hover .logo {
  filter: grayscale(0);
  opacity: 1;
}

.user-item:hover .name {
  color: var(--vp-c-text-1);
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-100% / 3));
  }
}

@media (min-width: 640px) {
  .track {
    gap: 40px;
  }

  .user-item {
    min-width: 180px;
    padding: 14px 20px;
  }

  .logo {
    height: 34px;
  }

  .name {
    font-size: 17px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .track {
    animation: none;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    gap: 16px;
  }

  .logo,
  .name {
    transition: none;
  }

}
</style>
