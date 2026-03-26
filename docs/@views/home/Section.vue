<script setup>
const props = defineProps(['title', 'description', 'outClass'])

</script>

<template>
  <section class="section" :class="props.outClass">
    <div class="content">
      <h2 class="title">{{ props.title }}</h2>
      <p class="description">{{ props.description }}</p>
      <slot></slot>
    </div>
  </section>
</template>

<style scoped>
.section {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 88px 24px 0 24px;
}

.section::before {
  content: '';
  position: absolute;
  top: 34px;
  left: 50%;
  width: min(1120px, calc(100% - 40px));
  height: 1px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--vp-c-brand-1) 16%, var(--vp-c-divider)) 18%, color-mix(in srgb, var(--vp-c-brand-1) 16%, var(--vp-c-divider)) 82%, transparent 100%);
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1152px;
  padding: 0 6px;
}

.title {
  font-size: 26px;
  line-height: 36px;
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.01em;
  opacity: 0;
  transform: translateY(20px);
  animation: sectionReveal .6s ease forwards;
}
.description {
  padding-top: 14px;
  font-size: 16px;
  line-height: 25px;
  text-align: center;
  color: var(--vp-c-text-2);
  max-width: 620px;
  padding-bottom: 28px;
  opacity: 0;
  transform: translateY(20px);
  animation: sectionReveal .6s ease forwards .12s;
}

.content > :deep(*:last-child) {
  opacity: 0;
  transform: translateY(22px);
  animation: sectionReveal .7s ease forwards .22s;
}

@keyframes sectionReveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 640px) {
  .section {
    padding: 124px 48px 0 48px;
  }

  .content {
    padding: 0 24px;
  }

  .title {
    font-size: 32px;
    line-height: 40px;
  }
  .description {
    padding-top: 18px;
    font-size: 17px;
    line-height: 28px;
    max-width: 640px;
    padding-bottom: 44px;
  }
}

@media (min-width: 960px) {
  .section {
    padding: 148px 64px 0 64px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .title,
  .description,
  .content > :deep(*:last-child) {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
</style>
