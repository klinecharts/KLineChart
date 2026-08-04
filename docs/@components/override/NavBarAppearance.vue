<script setup>
import { useData } from 'vitepress'
import VPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue'
import { computed, ref } from 'vue'

import AppearanceSetting from './AppearanceSetting.vue'
import { APPEARANCE_ICON } from './appearance-icon'

const { site } = useData()
const icon = APPEARANCE_ICON
</script>

<template>
  <VPFlyout
    v-if="
      site.appearance &&
      site.appearance !== 'force-dark' &&
      site.appearance !== 'force-auto'
    "
    :button="icon"
    :hiddenArrow="true"
    class="NavBarAppearance">
    <AppearanceSetting/>
  </VPFlyout>
</template>

<style scoped>
.NavBarAppearance {
  position: relative;
  display: none;
}

.NavBarAppearance :deep(.button) {
  padding: 0 4px
}

.NavBarAppearance :deep(.VPMenu) {
  padding: 14px;
}

@media (min-width: 1280px) {
  .NavBarAppearance {
    display: flex;
    align-items: center;
  }
}
</style>
