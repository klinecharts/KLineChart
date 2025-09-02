<script setup>
const props = defineProps(['tip'])
</script>

<template>
  <div class="tooltip">
    <span class="body">
      <slot></slot>
    </span>
    <div class="tip-container">
      <span class="tip">{{ props.tip }}</span>
    </div>
  </div>
</template>

<style scoped>
.tooltip {
  position: relative;
}

.tip-container {
  position: absolute;
  z-index: 10;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity ease-in-out .2s, bottom ease-in-out .2s;
}

.tip {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  padding: 6px 10px;
  color: var(--dark-c-text-1);
  background-color: var(--dark-c-bg);
  border-radius: 4px;
  font-weight: normal;
  box-shadow: 0 6px 16px -8px rgba(0, 0, 0, .5);
}

.dark .tip {
  color: var(--light-c-text-1);
  background-color: var(--light-c-bg);
}

.tip:after {
  display: inline-block;
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  top: 100%;
  left: calc(50% - 5px);
  border-left: solid 5px transparent;
  border-right: solid 5px transparent;
  border-top: solid 5px var(--dark-c-bg);
  z-index: 20;
}

.dark .tip:after {
  border-top: solid 5px var(--light-c-bg);
}

.body {
  cursor: pointer;
}

.body:hover + .tip-container {
  opacity: 1;
  bottom: calc(100% + 16px);
}

</style>