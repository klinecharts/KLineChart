<script setup>
import { useData } from 'vitepress'
import VPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue'
import VPMenuGroup from 'vitepress/dist/client/theme-default/components/VPMenuGroup.vue'
import VPMenuLink from 'vitepress/dist/client/theme-default/components/VPMenuLink.vue'
import VPNavTranslations from 'vitepress/dist/client/theme-default/components/VPNavTranslations.vue'
import VPSocialLinks from 'vitepress/dist/client/theme-default/components/VPSocialLinks.vue'
import { useAppearanceSwitch } from 'vitepress/dist/client/theme-default/composables/nav'
import { useNavOverflow } from 'vitepress/dist/client/theme-default/composables/nav-overflow'
import { useLangs } from 'vitepress/dist/client/theme-default/composables/langs'
import { computed } from 'vue'

import AppearanceSetting from './AppearanceSetting.vue'

const { theme } = useData()
const { localeLinks, currentLang } = useLangs({ linkToCorrespondingPage: true })
const hasAppearanceSwitch = useAppearanceSwitch()
const overflow = useNavOverflow()

const overflowItems = computed(() => {
  const count = overflow?.state.visibleItemCount ?? Infinity
  if (count === Infinity || !theme.value.nav) return []
  return theme.value.nav.slice(count)
})
const showTranslations = computed(() => !!(localeLinks.value.length && currentLang.value.label) && !(overflow?.state.translations ?? true))
const showAppearance = computed(() => hasAppearanceSwitch.value && !(overflow?.state.appearance ?? true))
const showSocialLinks = computed(() => !!theme.value.socialLinks && !(overflow?.state.socialLinks ?? true))
const hasExtraContent = computed(() => overflowItems.value.length > 0 || showTranslations.value || showAppearance.value || showSocialLinks.value)
</script>

<template>
  <VPFlyout
    v-if="hasExtraContent"
    class="NavBarExtra"
    :label="theme.extraMenuLabel || 'More options'"
    :ref="(inst) => overflow?.setExtraEl(inst?.$el ?? null)"
  >
    <ul v-if="overflowItems.length" class="group overflow-items">
      <template v-for="item in overflowItems" :key="JSON.stringify(item)">
        <VPMenuLink v-if="'link' in item" :item="item" />
        <component
          v-else-if="'component' in item"
          :is="item.component"
          v-bind="item.props"
          menu
        />
        <VPMenuGroup v-else :text="item.text" :items="item.items" />
      </template>
    </ul>
    <VPNavTranslations v-if="showTranslations" menu />

    <div v-if="showAppearance" class="group">
      <div class="item appearance">
        <AppearanceSetting/>
      </div>
    </div>

    <div v-if="showSocialLinks" class="group">
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

@media (min-width: 48rem) {
  .NavBarExtra {
    display: block;
  }
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
