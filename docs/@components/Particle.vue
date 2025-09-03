<template>
  <div class="particle" :style="style">
    <slot></slot>
    <div v-if="show" class="dot-container">
      <div class="dot dot-1" />
      <div class="dot dot-2" />
      <div class="dot dot-3" />
      <div class="dot dot-4" />
      <div class="dot dot-5" />
      <div class="dot dot-6"/>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Props
const props = defineProps({
  color: {
    type: String,
    default: 'var(--vp-c-indigo-1)'
  }
})

const style = reactive({
  '--dot-color': props.color
})

// Reactive data
const show = ref(false)

function start() {
  show.value = true
  setTimeout(() => {
    show.value = false
  }, 1500)
}

defineExpose({
  start
})
</script>

<style scoped>
.particle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dot-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Particle Dots */
.dot {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--dot-color);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: particle-burst 0.8s ease-out;
}

.dot-1 {
  animation-delay: 0s;
  --angle: 0deg;
}

.dot-2 {
  animation-delay: 0.05s;
  --angle: 60deg;
}

.dot-3 {
  animation-delay: 0.1s;
  --angle: 120deg;
}

.dot-4 {
  animation-delay: 0.15s;
  --angle: 180deg;
}

.dot-5 {
  animation-delay: 0.2s;
  --angle: 240deg;
}

.dot-6 {
  animation-delay: 0.25s;
  --angle: 300deg;
}

@keyframes particle-burst {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  50% {
    transform: translate(
      calc(-50% + cos(var(--angle)) * 30px),
      calc(-50% + sin(var(--angle)) * 30px)
    ) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(-50% + cos(var(--angle)) * 30px),
      calc(-50% + sin(var(--angle)) * 30px)
    ) scale(0);
    opacity: 0;
  }
}
</style>