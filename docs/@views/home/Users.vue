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
    website: 'https://dolphindb.cn/',
  },
  {
    name: 'FMZ',
    logo: userLogos.fmz,
    website: 'https://www.fmz.com/',
  },
  {
    name: 'Northstar',
    logo: userLogos.northstar,
    website: 'https://northstar.quantit.tech:8443/#/welcome?v=8.10.0'
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
          :style="{ '--logo-h': item.logoHeight }"
        >
        <span v-if="item.showName" class="name">{{ item.name }}</span>
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
  width: 100%;
  overflow: hidden;
  margin-top: 8px;
  mask-image: linear-gradient(90deg, transparent 0, black 6%, black 94%, transparent 100%);
}

.track {
  display: flex;
  align-items: center;
  width: max-content;
  gap: 28px;
  animation: marquee 28s linear infinite;
}

.marquee:hover .track {
  animation-play-state: paused;
}

.user-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 140px;
  padding: 8px 4px;
  text-decoration: none;
  transition: opacity .2s ease;
}

.user-item:hover {
  opacity: 1;
}

.logo {
  height: 30px;
  object-fit: contain;
  opacity: 0.9;
  filter: grayscale(1);
  transition: filter .2s ease;
}

.name {
  font-size: 16px;
  line-height: 20px;
  font-weight: bold;
  color: var(--vp-c-text-2);
  transition: color .2s ease;
}

.user-item:hover .logo {
  filter: grayscale(0);
}

.user-item:hover .name {
  color: var(--vp-c-text-1);
}

@media (min-width: 640px) {
  .track {
    gap: 34px;
  }

  .user-item {
    min-width: 180px;
    padding: 10px 6px;
  }

  .logo {
    height: 36px;
  }

  .name {
    font-size: 19px;
    line-height: 23px;
  }
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-50% - 17px));
  }
}
</style>
