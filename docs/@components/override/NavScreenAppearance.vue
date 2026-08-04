<script setup>
import { useData } from 'vitepress'
import { ref } from 'vue'
import AppearanceSetting from './AppearanceSetting.vue'
import { APPEARANCE_ICON } from './appearance-icon'

const { site, lang, theme } = useData()
const open = ref(false)
</script>

<template>
  <div
    v-if="
      site.appearance &&
      site.appearance !== 'force-dark' &&
      site.appearance !== 'force-auto'
    "
    class="NavScreenAppearance"
    :class="{ open }"
  >
    <button
      type="button"
      class="title"
      :aria-expanded="open"
      @click="open = !open">
      <span class="icon appearance-icon" v-html="APPEARANCE_ICON"/>
      {{ theme.darkModeSwitchLabel || 'Appearance' }}
      <span class="vpi-chevron-down icon chevron"/>
    </button>
    <div class="content">
      <AppearanceSetting/>
    </div>
  </div>
</template>

<style scoped>
.NavScreenAppearance {
  height: 24px;
  overflow: hidden;
}

.NavScreenAppearance.open {
  height: auto;
}

.title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.icon {
  font-size: 16px;
}

.appearance-icon {
  margin-right: 8px;
}

.chevron {
  margin-left: 4px;
}

.content {
  padding: 12px 0 0 24px;
}

.content :deep(.appearance-settings) {
  width: 100%;
}

</style>
