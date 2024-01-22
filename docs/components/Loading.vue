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
  width: 50px;
  aspect-ratio: 1;
  --bg: no-repeat radial-gradient(farthest-side,var(--vp-c-indigo-1) 90%,#0000);
  background: var(--bg), var(--bg), var(--bg);
  background-size: 25% 25%;
  animation: anim 1s infinite;
}
@keyframes anim{ 
  0%     {background-position: 0% -100%,50% -100%,100% -100%}
  16.67% {background-position: 0%   50%,50% -100%,100% -100%}
  33.33% {background-position: 0%   50%,50%   50%,100% -100%}
  45%,55%{background-position: 0%   50%,50%   50%,100%   50%}
  66.67% {background-position: 0%  200%,50%   50%,100%   50%}
  83.33% {background-position: 0%  200%,50%  200%,100%   50%}
  100%   {background-position: 0%  200%,50%  200%,100%  200%}
}
</style>

