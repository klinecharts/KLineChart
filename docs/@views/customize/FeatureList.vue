<template>
  <ul class="feature-list">
    <li v-for="(item, index) in props.features" :key="`${index}-${item}`">
      <span class="feature-dot" aria-hidden="true"></span>
      <span>{{ item }}</span>
    </li>
  </ul>
</template>

<script setup>
const props = defineProps(['features'])

</script>
<style scoped>
.feature-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.feature-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 22px;
  color: var(--vp-c-text-1);
}

.feature-dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  margin-top: 7px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
}
</style>
