<script setup>
import NavBarAppearance from './NavBarAppearance.vue'
import NavScreenAppearance from './NavScreenAppearance.vue'

defineProps({
  row: Boolean,
  screen: Boolean
})
</script>

<template>
  <NavScreenAppearance v-if="row && screen" />
  <NavBarAppearance v-else />
</template>
