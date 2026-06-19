<script setup>
import { useInView } from './composables/useInView.js'

const props = defineProps(['title', 'description', 'outClass'])
const { target, isVisible } = useInView()
</script>

<template>
  <section
    ref="target"
    class="section"
    :class="[props.outClass, { 'is-visible': isVisible }]"
  >
    <div class="content">
      <h2 class="title home-section-enter">{{ props.title }}</h2>
      <p v-if="props.description" class="description home-section-enter">{{ props.description }}</p>
      <div class="body home-section-enter">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.section {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 80px 24px 0;
}

.section:first-child {
  padding-top: 48px;
}

.section + .section {
  margin-top: 0;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: var(--home-content-max);
  min-width: 0;
  padding: 0 6px;
}

.title {
  font-size: clamp(24px, 3vw, 30px);
  line-height: clamp(32px, 3.8vw, 38px);
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
  min-width: 0;
}

.description {
  padding-top: 12px;
  font-size: clamp(15px, 1.75vw, 18px);
  line-height: clamp(24px, 2.8vw, 28px);
  text-align: center;
  color: var(--vp-c-text-2);
  max-width: 560px;
  padding-bottom: 32px;
  overflow-wrap: anywhere;
  min-width: 0;
  --home-section-enter-delay: .08s;
}

.body {
  width: 100%;
  --home-section-enter-distance: 28px;
  --home-section-enter-duration: .7s;
  --home-section-enter-delay: .14s;
}

@media (min-width: 640px) {
  .section {
    padding: 108px 48px 0;
  }

  .section:first-child {
    padding-top: 108px;
  }

  .content {
    padding: 0 24px;
  }

  .description {
    padding-top: 16px;
    padding-bottom: 40px;
  }
}

@media (min-width: 960px) {
  .section {
    padding: 128px 64px 0;
  }

  .content {
    padding: 0 32px;
  }
}

</style>
