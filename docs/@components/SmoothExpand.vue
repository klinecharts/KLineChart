<script setup>
import { Transition } from 'vue'

const props = defineProps({
  expanded: {
    type: Boolean,
    default: false
  }
})

// 处理动画钩子
const onEnter = (el) => {
  el.style.height = '0'
  el.offsetHeight // 强制重排
  el.style.height = el.scrollHeight + 'px'
}

const onAfterEnter = (el) => {
  el.style.height = 'auto'
}

const onLeave = (el) => {
  el.style.height = el.scrollHeight + 'px'
  el.offsetHeight // 强制重排
  el.style.height = '0'
}

</script>

<template>
  <Transition 
    name="expand"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @leave="onLeave">
    <div v-if="props.expanded" style="overflow: hidden">
      <slot></slot>
    </div>
  </Transition>
</template>

<style scoped>
/* Smooth expand/collapse animation */
.expand-enter-active,
.expand-leave-active {
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}
</style>