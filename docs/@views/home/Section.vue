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
  font-size: 28px;
  line-height: 40px;
  text-align: center;
  font-weight: bold;
}
.description {
  padding-top: 18px;
  font-size: 18px;
  line-height: 26px;
  text-align: center;
  color: var(--vp-c-text-2);
  max-width: 660px;
  padding-bottom: 32px;
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
    font-size: 36px;
    line-height: 42px;
  }
  .description {
    padding-top: 26px;
    font-size: 20px;
    line-height: 30px;
    max-width: 660px;
    padding-bottom: 52px;
  }
}

@media (min-width: 960px) {
  .section {
    padding: 150px 64px 0 64px;
  }
}
</style>