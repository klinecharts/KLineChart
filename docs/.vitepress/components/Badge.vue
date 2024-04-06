<template>
  <span class="Badge"><slot></slot></span>
</template>

<style scoped>
.Badge {
  vertical-align: middle;
  padding: 3px 6px;
  font-size: 12px;
  border-radius: 3px;
  background-color: var(--vp-c-indigo-1);
  margin: auto;
  color: #fff;
}
</style>