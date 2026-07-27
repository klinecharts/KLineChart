<template>
  <div class="hero-bg" aria-hidden="true">
    <div class="brand-glow" />
    <div class="market-grid" />

    <div class="geometry geometry-left">
      <div class="ring ring-large"><i /></div>
      <div class="diamond diamond-left" />
      <div class="dot-matrix dot-matrix-left">
        <i v-for="index in 20" :key="index" />
      </div>
      <div class="micro-shape micro-square" />
      <div class="micro-shape micro-circle" />
    </div>

    <div class="geometry geometry-right">
      <div class="frame frame-large"><i /></div>
      <div class="ring ring-small" />
      <div class="diamond diamond-right" />
      <div class="dot-matrix dot-matrix-right">
        <i v-for="index in 16" :key="index" />
      </div>
      <div class="micro-shape micro-cross" />
    </div>

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

.brand-glow {
  position: absolute;
  top: -42%;
  left: 50%;
  width: min(2100px, 150vw);
  height: min(920px, 108vh);
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    color-mix(in srgb, var(--vp-c-brand-1) 14.5%, transparent) 0%,
    color-mix(in srgb, var(--vp-c-brand-1) 7%, transparent) 42%,
    color-mix(in srgb, var(--vp-c-brand-1) 3%, transparent) 70%,
    transparent 90%
  );
  filter: blur(10px);
  transform: translateX(-50%);
}

.market-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(color-mix(in srgb, var(--vp-c-divider) 68%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--vp-c-divider) 68%, transparent) 1px, transparent 1px);
  background-position: center top;
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgb(0 0 0 / .68), transparent 88%);
  opacity: .2;
}

.geometry {
  position: absolute;
  inset-block: 0;
  width: min(34vw, 480px);
}

.geometry-left { left: 0; }
.geometry-right { right: 0; }

.ring {
  position: absolute;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
  border-radius: 50%;
}

.ring-large {
  top: 19%;
  left: -92px;
  width: 270px;
  height: 270px;
  animation: roam-ring-large 19s cubic-bezier(.45, .05, .3, .98) infinite;
}

.ring-large::before,
.ring-large::after {
  position: absolute;
  content: '';
  border-radius: 50%;
}

.ring-large::before {
  inset: 34px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 9%, transparent);
}

.ring-large::after {
  top: 50%;
  right: -4px;
  width: 8px;
  height: 8px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 70%, var(--vp-c-bg));
  box-shadow: 0 0 14px color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent);
}

.ring-large i {
  position: absolute;
  top: 49%;
  left: 49%;
  width: 38%;
  height: 1px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent);
  transform: rotate(-34deg);
  transform-origin: left center;
}

.ring-small {
  right: 8%;
  bottom: 12%;
  width: 92px;
  height: 92px;
  border-color: color-mix(in srgb, var(--vp-c-text-3) 18%, transparent);
  animation: roam-ring-small 14s cubic-bezier(.3, .1, .35, 1) infinite -4s;
}

.diamond {
  position: absolute;
  width: 58px;
  height: 58px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 16%, transparent);
  transform: rotate(45deg);
}

.diamond-left { left: 29%; bottom: 15%; }
.diamond-left { animation: roam-diamond-left 16s cubic-bezier(.4, 0, .2, 1) infinite -7s; }
.diamond-right { top: 15%; right: 5%; width: 34px; height: 34px; opacity: .7; animation: roam-diamond-right 21s cubic-bezier(.33, 0, .28, 1) infinite -3s; }

.frame {
  position: absolute;
  border: 1px solid color-mix(in srgb, var(--vp-c-text-3) 14%, transparent);
}

.frame-large {
  top: 23%;
  right: -72px;
  width: 250px;
  height: 250px;
  transform: rotate(16deg);
  animation: roam-frame 23s cubic-bezier(.42, .03, .25, 1) infinite -9s;
}

.frame-large::before {
  position: absolute;
  inset: 24px;
  content: '';
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 13%, transparent);
}

.frame-large i {
  position: absolute;
  top: -5px;
  left: -5px;
  width: 10px;
  height: 10px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 42%, transparent);
  background: var(--vp-c-bg);
}

.dot-matrix {
  position: absolute;
  display: grid;
  grid-template-columns: repeat(4, 3px);
  gap: 11px;
  opacity: .52;
}

.dot-matrix i {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--vp-c-brand-1) 52%, transparent);
}

.dot-matrix-left { top: 16%; left: 39%; grid-template-columns: repeat(5, 3px); }
.dot-matrix-left { animation: roam-dots-left 13s ease-in-out infinite -2s; }
.dot-matrix-right { right: 29%; bottom: 19%; animation: roam-dots-right 17s ease-in-out infinite -8s; }

.micro-shape { position: absolute; opacity: .6; }

.micro-square {
  left: 11%;
  bottom: 18%;
  width: 12px;
  height: 12px;
  border: 1px solid color-mix(in srgb, var(--vp-c-text-3) 30%, transparent);
  animation: roam-micro-square 11s ease-in-out infinite -5s;
}

.micro-circle {
  top: 46%;
  left: 44%;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--vp-c-brand-1) 48%, transparent);
  animation: roam-micro-circle 9s ease-in-out infinite -3s;
}

.micro-cross {
  top: 18%;
  right: 39%;
  width: 15px;
  height: 15px;
  animation: roam-micro-cross 15s ease-in-out infinite -6s;
}

.micro-cross::before,
.micro-cross::after {
  position: absolute;
  top: 7px;
  left: 0;
  width: 15px;
  height: 1px;
  content: '';
  background: color-mix(in srgb, var(--vp-c-brand-1) 34%, transparent);
}

.micro-cross::after { transform: rotate(90deg); }

.fade {
  position: absolute;
  inset: auto 0 0;
  height: 180px;
  background: linear-gradient(180deg, transparent, var(--vp-c-bg));
}

@keyframes roam-ring-large {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(0); }
  22% { transform: translate3d(8px, -5px, 0) rotate(1.2deg); }
  51% { transform: translate3d(-3px, -12px, 0) rotate(-.8deg); }
  73% { transform: translate3d(11px, 3px, 0) rotate(.5deg); }
}

@keyframes roam-ring-small {
  0%, 100% { transform: translate3d(0, 0, 0); }
  31% { transform: translate3d(-9px, 5px, 0); }
  58% { transform: translate3d(4px, -8px, 0); }
  81% { transform: translate3d(-4px, -3px, 0); }
}

@keyframes roam-diamond-left {
  0%, 100% { transform: rotate(45deg) translate3d(0, 0, 0); }
  27% { transform: rotate(48deg) translate3d(7px, -4px, 0); }
  62% { transform: rotate(42deg) translate3d(-6px, -10px, 0); }
  84% { transform: rotate(46deg) translate3d(3px, 5px, 0); }
}

@keyframes roam-diamond-right {
  0%, 100% { transform: rotate(45deg) translate3d(0, 0, 0); }
  19% { transform: rotate(41deg) translate3d(-7px, 4px, 0); }
  47% { transform: rotate(49deg) translate3d(5px, 9px, 0); }
  78% { transform: rotate(43deg) translate3d(8px, -5px, 0); }
}

@keyframes roam-frame {
  0%, 100% { transform: rotate(16deg) translate3d(0, 0, 0); }
  24% { transform: rotate(14deg) translate3d(-6px, 8px, 0); }
  55% { transform: rotate(18deg) translate3d(7px, -7px, 0); }
  79% { transform: rotate(15deg) translate3d(-3px, -12px, 0); }
}

@keyframes roam-dots-left {
  0%, 100% { transform: translate3d(0, 0, 0); }
  38% { transform: translate3d(6px, 9px, 0); }
  69% { transform: translate3d(-5px, -6px, 0); }
}

@keyframes roam-dots-right {
  0%, 100% { transform: translate3d(0, 0, 0); }
  29% { transform: translate3d(-7px, -4px, 0); }
  64% { transform: translate3d(5px, -11px, 0); }
  86% { transform: translate3d(2px, 4px, 0); }
}

@keyframes roam-micro-square {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(0); }
  46% { transform: translate3d(7px, -8px, 0) rotate(8deg); }
  72% { transform: translate3d(-3px, 3px, 0) rotate(-3deg); }
}

@keyframes roam-micro-circle {
  0%, 100% { transform: translate3d(0, 0, 0); opacity: .6; }
  33% { transform: translate3d(-5px, 6px, 0); opacity: .35; }
  70% { transform: translate3d(6px, -5px, 0); opacity: .75; }
}

@keyframes roam-micro-cross {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(0); }
  21% { transform: translate3d(4px, 7px, 0) rotate(4deg); }
  57% { transform: translate3d(-8px, -4px, 0) rotate(-6deg); }
  82% { transform: translate3d(3px, -9px, 0) rotate(2deg); }
}

@media (max-width: 959px) {
  .market-grid { background-size: 60px 60px; opacity: .16; }
  .geometry { width: 38vw; opacity: .6; }
  .ring-large { left: -160px; }
  .frame-large { right: -155px; }
}

@media (max-width: 639px) {
  .brand-glow { top: -18%; width: 175vw; height: 620px; }
  .market-grid { background-size: 52px 52px; opacity: .13; }
  .geometry { width: 46vw; opacity: .38; }
  .ring-large { top: 24%; left: -205px; }
  .frame-large { top: 30%; right: -205px; }
  .dot-matrix, .diamond, .micro-shape { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .ring,
  .diamond,
  .frame,
  .dot-matrix,
  .micro-shape { animation: none; }
}
</style>
