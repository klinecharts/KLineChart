<script setup>
import { useData } from 'vitepress'
import VPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue'
import VPMenuLink from 'vitepress/dist/client/theme-default/components/VPMenuLink.vue'
import VPSocialLinks from 'vitepress/dist/client/theme-default/components/VPSocialLinks.vue'
import { useLangs } from 'vitepress/dist/client/theme-default/composables/langs'
import { computed } from 'vue'

import AppearanceSetting from './AppearanceSetting.vue'

const { site, theme } = useData()
const { localeLinks, currentLang } = useLangs({ correspondingLink: true })

const hasExtraContent = computed(() => (localeLinks.value.length && currentLang.value.label) || site.value.appearance || theme.value.socialLinks)
</script>

<template>
  <VPFlyout
    v-if="hasExtraContent"
    class="NavBarExtra"
    label="extra navigation"
  >
    <div
      v-if="localeLinks.length && currentLang.label"
      class="group translations"
    >
      <p class="trans-title">{{ currentLang.label }}</p>

      <template v-for="locale in localeLinks" :key="locale.link">
        <VPMenuLink
          :item="locale"
          :external="false"
          :lang="locale.lang"
          :hreflang="locale.lang"
          rel="alternate"
          :dir="locale.dir"
        />
      </template>
    </div>

    <div
      v-if="
        site.appearance &&
        site.appearance !== 'force-dark' &&
        site.appearance !== 'force-auto'
      "
      class="group"
    >
      <div class="item appearance">
        <AppearanceSetting/>
      </div>
    </div>

    <div v-if="theme.socialLinks" class="group">
      <div class="item social-links">
        <VPSocialLinks class="social-links-list" :links="theme.socialLinks" />
      </div>
    </div>
  </VPFlyout>
</template>

<style scoped>
.NavBarExtra {
  display: none;
  margin-right: -12px;
}

@media (min-width: 768px) {
  .NavBarExtra {
    display: block;
  }
}

@media (min-width: 1280px) {
  .NavBarExtra {
    display: none;
  }
}

.trans-title {
  padding: 0 24px 0 12px;
  line-height: 32px;
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.item.appearance,
.item.social-links {
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.item.appearance {
  width: 248px;
  max-width: calc(100vw - 48px);
  padding-top: 2px;
  padding-bottom: 2px;
}

.item.appearance :deep(.appearance-settings) {
  width: 100%;
}

.appearance-action {
  margin-right: -2px;
}

.social-links-list {
  margin: -4px -8px;
}
</style>
