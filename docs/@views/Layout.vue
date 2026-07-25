<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, provide, onMounted, ref } from 'vue'

import Banner from './Banner.vue'
import HomeHero from './home/hero/index.vue'
import HomeTopSponsor from './home/TopSponsor.vue'
import HomeCreateChart from './home/create-chart/index.vue'
import HomeUseCases from './home/UseCases.vue'
import HomeCoreAdvantages from './home/CoreAdvantages.vue'
import HomeEcosystem from './home/Ecosystem.vue'
import HomeUsers from './home/Users.vue'
import HomeSponsor from './home/Sponsor.vue'
// import AsideSponsor from './AsideSponsor.vue'
import NotFound from './NotFound.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <!-- <template #layout-top>
      <Banner/>
    </template> -->
    <template #home-hero-before>
      <HomeHero/>
      <HomeTopSponsor/>
    </template>
    <template #home-features-after>
      <HomeCreateChart/>
      <HomeCoreAdvantages/>
      <HomeUseCases/>
      <HomeEcosystem/>
      <HomeUsers/>
      <HomeSponsor/>
    </template>
    <!-- <template #aside-bottom>
      <AsideSponsor/>
    </template> -->
    <template #not-found>
      <NotFound/>
    </template>
  </DefaultTheme.Layout>
</template>
