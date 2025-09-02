<template>
  <div :class="{'expand-icon': true, expanded: props.expanded}"/>
</template>

<script setup>
const props = defineProps({
  expanded: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.expand-icon {
  position: relative;
  width: 15px;
  height: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.expand-icon:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  z-index: 10;
  left: 0;
  background-color: var(--vp-c-text-1);
}

.expand-icon:after {
  content: "";
  position: absolute;
  width: 2px;
  height: 100%;
  z-index: 10;
  top: 0;
  background-color: var(--vp-c-text-1);
  transition: all .3s ease;
  transform: scale(1);
  transform-origin: center;
}

.expand-icon.expanded:after {
  transform: scale(0);
}

</style>