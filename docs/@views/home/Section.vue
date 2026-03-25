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
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 80px 24px 0 24px;
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
}
.description {
  padding-top: 14px;
  font-size: 16px;
  line-height: 25px;
  text-align: center;
  color: var(--vp-c-text-2);
  max-width: 620px;
  padding-bottom: 28px;
}

@media (min-width: 640px) {
  .section {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 150px 48px 0 48px;
  }

  .content {
    padding: 0 32px;
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
    padding: 150px 64px 0 64px;
  }
}
</style>
