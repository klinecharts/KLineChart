<script setup>
  import { ref } from 'vue'

  import { useData } from 'vitepress'

  import sponsors from './sponsors.json'

  sponsors.sort((s1, s2) => s2.amount - s1.amount)

  const pt = []

  const gd = []

  for (let i = 3; i < sponsors.length; i++) {
    const s = sponsors[i]
    if (s.amount >= 5000) {
      pt.push(s)
    } else {
      gd.push(s)
    }
  }

  const platinum = ref(pt)

  const gold = ref(gd)

  const { lang } = useData()
</script>

<template>
  <section class="home-section sponsor-section">
    <div class="home-section-content sponsor">
      <h2>{{ lang === 'zh-CN' ? '赞助商' : 'Sponsors' }}</h2>
      <div class="sponsor-grid sponsor-top-grid">
        <a class="sponsor-grid-item item-no1" :href="sponsors[0].website" target="_blank" rel="noreferrer">
          <img class="image" :src="sponsors[0].logo"/>
          <span class="text" v-if="!!sponsors[0].text">{{ sponsors[0].text }}</span>
        </a>
        <a class="sponsor-grid-item item-no1" :href="sponsors[1].website" target="_blank" rel="noreferrer">
          <img class="image" :src="sponsors[1].logo"/>
          <span class="text" v-if="!!sponsors[1].text">{{ sponsors[1].text }}</span>
        </a>
        <!-- <a v-if="!!sponsors[1]" class="sponsor-grid-item item-no2-no3" :href="sponsors[1].website" target="_blank" rel="noreferrer">
          <img class="image" :src="sponsors[1].logo"/>
        </a>
        <a v-if="!!sponsors[2]" class="sponsor-grid-item item-no2-no3" :href="sponsors[2].website" target="_blank" rel="noreferrer">
          <img class="image" :src="sponsors[2].logo"/>
        </a>
        <a class="sponsor-grid-item item-no1" href="./sponsor.html" target="_blank" rel="noreferrer">
          {{ lang === 'zh-CN' ? '成为赞助商' : 'Become a sponsor' }}
        </a> -->
      </div>
      <!-- <h4 v-if="platinum.length > 0">{{ lang === 'zh-CN' ? '铂金赞助商' : 'Platinum Sponsors' }}</h4> -->
      <div v-if="platinum.length > 0" class="sponsor-grid sponsor-platinum-grid">
        <a v-for="item in platinum" class="sponsor-grid-item item" target="_blank" rel="noreferrer" :href="item.website">
          <img class="image" :src="item.logo"/>
        </a>
      </div>
      <!-- <h4 v-if="gold.length > 0">{{ lang === 'zh-CN' ? '黄金赞助商' : 'Gold Sponsors' }}</h4> -->
      <div v-if="gold.length > 0" class="sponsor-grid sponsor-gold-grid">
        <a v-for="item in gold" class="sponsor-grid-item item" target="_blank" rel="noreferrer" :href="item.website">
          <img class="image" :src="item.logo"/>
        </a>
      </div>
      <div class="sponsor-become">
        <a target="_blank" rel="noreferrer" href="./sponsor.html">
          {{ lang === 'zh-CN' ? '成为赞助商' : 'Become a sponsor' }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .sponsor-section {
    margin-top: 100px;
  }

  .sponsor h2 {
    font-size: 26px;
    text-align: center;
    font-weight: 600;
    padding-bottom: 34px;
  }

  .sponsor h4 {
    font-size: 20px;
    font-weight: 500;
    padding: 30px 0 20px 0;
    text-align: left;
  }

  .sponsor-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .sponsor-grid-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    color: var(--vp-c-text-2)!important;
    background-color: var(--vp-c-bg-soft);
    border-radius: 4px;
    transition: background-color .2s;
    cursor: pointer;
    color: inherit;
  }

  .sponsor-grid-item .text {
    font-size: 38px;
    font-weight: bold;
    padding-left: 12px;
  }

  /* .dark .sponsor .sponsor-grid .sponsor-grid-item .image {
    filter: grayscale(1) invert(1);
  } */

  .dark .sponsor .sponsor-grid .sponsor-grid-item:hover {
    background-color: var(--vp-c-neutral);
    color: rgba(0, 0, 0, 0.6)!important;
  }

  /* .dark .sponsor-grid .sponsor-grid-item:hover .image {
    filter: grayscale(0) invert(0);
  } */

  .sponsor-top-grid .item-no1 {
    height: 160px;
    font-size: 16px;
  }

  .sponsor-top-grid .item-no1 .image {
    height: 56px;
  }

  .sponsor-top-grid .item-no2-no3 {
    height: 140px;
    font-size: 14px;
  }

  .sponsor-top-grid .item-no2-no3 .image {
    height: 46px;
  }

  .sponsor-platinum-grid .item {
    height: 100px;
  }

  .sponsor-platinum-grid .item .image {
    height: 30px;
  }

  .sponsor-gold-grid .item {
    width: calc((100% - 18px) / 4);
    height: 50px;
  }

  .sponsor-gold-grid .item .image {
    height: 16px;
  }

  .sponsor-become {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 26px;
    font-size: 14px;
    color: var(--vp-c-indigo-1);
    font-weight: bold;
  }

  .sponsor-become a {
    padding: 8px 22px;
    border-radius: 99px;
    transition: all .25s ease-in;
    text-decoration: underline;
  }

  .sponsor-become a:hover {
    background-color: var(--vp-c-indigo-1);
    color: white;
    text-decoration: none;
  }

  @media (min-width: 640px) {
    .sponsor-platinum-grid .item {
      width: calc((100% - 12px) / 3);
    }

    .sponsor-gold-grid .item {
      width: calc((100% - 30px) / 4);
    }
  }

  @media (min-width: 960px) {
    .sponsor-top-grid .item-no2-no3 {
      width: calc((100% - 6px) / 2);
    }

    .sponsor-platinum-grid .item {
      width: calc((100% - 18px) / 4);
    }

    .sponsor-gold-grid .item {
      width: calc((100% - 54px) / 10);
    }
  }
</style>