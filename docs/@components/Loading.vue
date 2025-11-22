<template>
  <div :class="rootClass">
    <div class="loader"/>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  className: {
    type: String,
    default: ''
  }
})

const rootClass = computed(() => {
  return props.className ? `loading ${props.className}` : 'loading'
})
</script>

<style scoped>
.loading {
  display: flex;
  position: absolute;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  color: var(--vp-c-indigo-1);
}

.loader {
  width: 14px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: currentColor;
  animation: l2 1.5s infinite;
}
@keyframes l2 {
  0%,
  100% {
    transform: translate(-32px);
    box-shadow:  0 0 currentColor, 0 0 currentColor;
  }
  40% {
    transform:translate(32px);
    box-shadow: -18px 0 currentColor, -36px 0 currentColor;
  }
  50% {
    transform:translate(32px);
    box-shadow:  0 0 currentColor, 0 0 currentColor;
  }
  90% {
    transform:translate(-32px);
    box-shadow: 18px 0 currentColor, 36px 0 currentColor;
  }
}
</style>

