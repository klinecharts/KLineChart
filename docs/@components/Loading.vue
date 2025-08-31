<template>
  <div class="loading">
    <div class="loader"/>
  </div>
</template>

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
  z-index: 10;
  background-color: var(--vp-code-block-bg);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.loader {
  width: 14px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--custom-red);
  animation: l2 1.5s infinite;
}
@keyframes l2 {
  0%,
  100%{transform:translate(-35px);box-shadow:  0     0 var(--vp-c-indigo-1), 0     0 var(--custom-green)}
  40% {transform:translate( 35px);box-shadow: -15px  0 var(--vp-c-indigo-1), -30px  0 var(--custom-green)}
  50% {transform:translate( 35px);box-shadow:  0     0 var(--vp-c-indigo-1), 0     0 var(--custom-green)}
  90% {transform:translate(-35px);box-shadow:  15px  0 var(--vp-c-indigo-1), 30px  0 var(--custom-green)}
}
</style>

