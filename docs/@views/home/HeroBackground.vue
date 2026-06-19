<template>
  <div class="hero-bg" aria-hidden="true">
    <div class="canvas">
      <div class="blob blob-a" />
      <div class="blob blob-b" />
      <div class="blob blob-c" />
      <div class="blob blob-d" />
    </div>
    <div class="pulse" />
    <div class="shimmer" />
    <div class="vignette" />
    <div class="fade" />
  </div>
</template>

<style scoped>
.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  background: var(--vp-c-bg);
}

.canvas {
  position: absolute;
  inset: -35%;
  filter: blur(80px);
  transform: translateZ(0);
  animation: canvasDrift 36s ease-in-out infinite alternate;
}

.blob {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity;
}

.blob-a {
  top: 0;
  left: 24%;
  width: 44%;
  height: 50%;
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
  animation: floatA 24s ease-in-out infinite;
}

.blob-b {
  top: 10%;
  right: 12%;
  width: 36%;
  height: 42%;
  background: color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent);
  animation: floatB 28s ease-in-out infinite;
}

.blob-c {
  bottom: 8%;
  left: 36%;
  width: 40%;
  height: 38%;
  background: color-mix(in srgb, var(--vp-c-brand-1) 5%, transparent);
  animation: floatC 32s ease-in-out infinite;
}

.blob-d {
  top: 32%;
  left: 8%;
  width: 28%;
  height: 30%;
  background: color-mix(in srgb, var(--vp-c-brand-1) 4%, transparent);
  animation: floatD 20s ease-in-out infinite;
}

.pulse {
  position: absolute;
  top: 12%;
  left: 50%;
  width: min(560px, 72vw);
  height: min(320px, 42vh);
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent) 0%,
    transparent 68%
  );
  animation: pulse 9s ease-in-out infinite;
}

.shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    115deg,
    transparent 38%,
    color-mix(in srgb, var(--vp-c-brand-1) 5%, transparent) 50%,
    transparent 62%
  );
  background-size: 220% 220%;
  opacity: 0.45;
  animation: shimmer 14s ease-in-out infinite;
}

.vignette {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 130% 90% at 50% -10%, transparent 48%, color-mix(in srgb, var(--vp-c-bg) 40%, transparent) 100%),
    radial-gradient(ellipse 80% 60% at 50% 110%, color-mix(in srgb, var(--vp-c-bg) 50%, transparent), transparent 58%);
  opacity: 0.55;
}

.fade {
  position: absolute;
  inset: auto 0 0;
  height: 140px;
  background: linear-gradient(180deg, transparent, var(--vp-c-bg));
}

@keyframes canvasDrift {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  100% {
    transform: translate3d(-1.5%, 1.2%, 0) scale(1.02);
  }
}

@keyframes floatA {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.75;
  }

  50% {
    transform: translate(5%, 7%) scale(1.07);
    opacity: 1;
  }
}

@keyframes floatB {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.7;
  }

  50% {
    transform: translate(-6%, 5%) scale(1.09);
    opacity: 0.95;
  }
}

@keyframes floatC {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.65;
  }

  50% {
    transform: translate(4%, -6%) scale(1.06);
    opacity: 0.9;
  }
}

@keyframes floatD {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.6;
  }

  50% {
    transform: translate(8%, -3%) scale(1.1);
    opacity: 0.85;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: translateX(-50%) scale(0.96);
    opacity: 0.55;
  }

  50% {
    transform: translateX(-50%) scale(1.05);
    opacity: 0.85;
  }
}

@keyframes shimmer {
  0%,
  100% {
    background-position: 0% 40%;
    opacity: 0.25;
  }

  50% {
    background-position: 100% 60%;
    opacity: 0.5;
  }
}

@media (prefers-reduced-motion: reduce) {
  .canvas,
  .blob,
  .pulse,
  .shimmer {
    animation: none;
  }

  .blob {
    opacity: 0.8;
  }

  .pulse {
    opacity: 0.6;
    transform: translateX(-50%);
  }

  .shimmer {
    opacity: 0;
  }
}
</style>
