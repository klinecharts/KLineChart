<template>
  <div class="loading">
    <div class="loader"></div>
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
}

.loader {
  width: 12px;
  aspect-ratio: 1;
  position: relative;
}
.loader::before, .loader::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: var(--vp-c-indigo-1);
}
.loader::before {
  box-shadow: -18px 0 var(--vp-c-indigo-1);
  animation: l8-1 1s infinite linear;
}
.loader::after {
  transform: rotate(0deg) translateX(18px);
  animation: l8-2 1s infinite linear;
}

@keyframes l8-1 {
    100% {transform: translateX(18px)}
}
@keyframes l8-2 {
    100% {transform: rotate(-180deg) translateX(18px)}
}
</style>

