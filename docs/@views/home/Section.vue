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
  padding: 92px 24px 0 24px;
}

.section + .section {
  margin-top: 8px;
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
  font-size: clamp(24px, 3.4vw, 30px);
  line-height: clamp(34px, 4.2vw, 38px);
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.01em;
  opacity: 0;
  transform: translateY(20px);
  animation: sectionReveal .6s ease forwards;
}
.description {
  padding-top: 14px;
  font-size: clamp(15px, 1.8vw, 16px);
  line-height: clamp(24px, 3vw, 27px);
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
    padding: 128px 48px 0 48px;
  }

  .section + .section {
    margin-top: 10px;
  }

  .content {
    padding: 0 24px;
  }

  .description {
    padding-top: 18px;
    max-width: 640px;
    padding-bottom: 44px;
  }
}

@media (min-width: 960px) {
  .section {
    padding: 152px 64px 0 64px;
  }

  .section + .section {
    margin-top: 12px;
  }

  .content {
    padding: 0 32px;
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
